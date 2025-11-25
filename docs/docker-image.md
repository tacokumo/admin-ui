# Docker Image 構成

このドキュメントでは、admin-ui の Docker イメージの構成と環境変数の注入方法について説明します。

## 概要

このアプリケーションは、ビルド時ではなく**実行時**に環境変数を注入する仕組みを採用しています。これにより、1つの Docker イメージを複数の環境（dev/staging/prod）で使い回すことができます。

## アーキテクチャ

### ビルド時

```dockerfile
# ビルド時には環境変数は不要
RUN npm run build
```

- 環境変数をビルド成果物に埋め込まない
- 汎用的なビルド成果物を生成

### 実行時

```bash
docker run -e VITE_AUTH0_DOMAIN="..." -e VITE_AUTH0_CLIENT_ID="..." admin-ui
```

1. コンテナ起動時に `docker-entrypoint.sh` が実行される
2. 環境変数から `/usr/share/nginx/html/config.js` を動的生成
3. ブラウザが `window.ENV` 経由で設定を取得

## 必要な環境変数

| 環境変数名 | 説明 | 例 |
|-----------|------|-----|
| `VITE_AUTH0_DOMAIN` | Auth0 ドメイン | `production.auth0.com` |
| `VITE_AUTH0_CLIENT_ID` | Auth0 クライアント ID | `abc123def456` |
| `VITE_AUTH0_AUDIENCE` | Auth0 オーディエンス | `https://api.example.com` |
| `VITE_API_BASE_URL` | API ベース URL | `https://api.example.com` |

## ファイル構成

### docker-entrypoint.sh

コンテナ起動時に実行されるエントリポイントスクリプト。環境変数から `config.js` を生成します。

```sh
#!/bin/sh
set -e

# Create runtime config file from environment variables
cat > /usr/share/nginx/html/config.js <<EOF
window.ENV = {
  VITE_AUTH0_DOMAIN: "${VITE_AUTH0_DOMAIN}",
  VITE_AUTH0_CLIENT_ID: "${VITE_AUTH0_CLIENT_ID}",
  VITE_AUTH0_AUDIENCE: "${VITE_AUTH0_AUDIENCE}",
  VITE_API_BASE_URL: "${VITE_API_BASE_URL}"
};
EOF

exec "$@"
```

### index.html

`config.js` を読み込むために script タグを追加しています。

```html
<script src="/config.js"></script>
<script type="module" src="/src/main.tsx"></script>
```

### src/main.tsx

実行時環境変数（`window.ENV`）と開発時環境変数（`import.meta.env`）の両方に対応しています。

```typescript
const getEnvVar = (key: keyof NonNullable<typeof window.ENV>): string => {
  // 本番環境: window.ENVから取得
  if (window.ENV?.[key]) {
    return window.ENV[key];
  }
  // 開発環境: import.meta.envから取得
  const devValue = import.meta.env[key];
  if (devValue) {
    return devValue;
  }
  throw new Error(`Missing required environment variable: ${key}`);
};
```

## ビルド方法

```bash
docker build -t admin-ui:latest .
```

## 実行方法

### Docker

```bash
docker run -d -p 8080:80 \
  -e VITE_AUTH0_DOMAIN="your-domain.auth0.com" \
  -e VITE_AUTH0_CLIENT_ID="your-client-id" \
  -e VITE_AUTH0_AUDIENCE="https://api.example.com" \
  -e VITE_API_BASE_URL="https://api.example.com" \
  admin-ui:latest
```

### Kubernetes

Deployment マニフェストの例:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: admin-ui
spec:
  replicas: 3
  selector:
    matchLabels:
      app: admin-ui
  template:
    metadata:
      labels:
        app: admin-ui
    spec:
      containers:
      - name: admin-ui
        image: admin-ui:latest
        ports:
        - containerPort: 80
        env:
        - name: VITE_AUTH0_DOMAIN
          value: "production.auth0.com"
        - name: VITE_AUTH0_CLIENT_ID
          valueFrom:
            secretKeyRef:
              name: auth0-secret
              key: client-id
        - name: VITE_AUTH0_AUDIENCE
          value: "https://api.production.com"
        - name: VITE_API_BASE_URL
          value: "https://api.production.com"
```

Secret の例:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: auth0-secret
type: Opaque
data:
  client-id: <base64-encoded-client-id>
```

### ConfigMap を使った環境別設定

環境ごとに ConfigMap を用意することで、設定を管理しやすくなります。

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: admin-ui-config-production
data:
  VITE_AUTH0_DOMAIN: "production.auth0.com"
  VITE_AUTH0_AUDIENCE: "https://api.production.com"
  VITE_API_BASE_URL: "https://api.production.com"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: admin-ui
spec:
  template:
    spec:
      containers:
      - name: admin-ui
        image: admin-ui:latest
        envFrom:
        - configMapRef:
            name: admin-ui-config-production
        env:
        - name: VITE_AUTH0_CLIENT_ID
          valueFrom:
            secretKeyRef:
              name: auth0-secret
              key: client-id
```

## 開発環境

開発環境では従来通り `.env` ファイルまたは `import.meta.env` を使用します。

```bash
# .env ファイル
VITE_AUTH0_DOMAIN=dev.auth0.com
VITE_AUTH0_CLIENT_ID=dev-client-id
VITE_AUTH0_AUDIENCE=https://api.dev.example.com
VITE_API_BASE_URL=http://localhost:3000

# 開発サーバー起動
npm run dev
```

## トラブルシューティング

### 環境変数が反映されない

コンテナのログを確認して、`config.js` が正しく生成されているか確認してください。

```bash
docker logs <container-id>
```

期待される出力:

```
Runtime configuration created:
window.ENV = {
  VITE_AUTH0_DOMAIN: "your-domain.auth0.com",
  ...
};
```

### config.js の内容を確認

```bash
docker exec <container-id> cat /usr/share/nginx/html/config.js
```

または

```bash
curl http://localhost:8080/config.js
```

## メリット

1. **環境ごとのイメージ不要**: 1つのイメージを全環境で使い回せる
2. **デプロイの簡素化**: ビルドパイプラインが1つで済む
3. **設定の柔軟性**: Kubernetes の ConfigMap/Secret で設定を管理可能
4. **セキュリティ**: 機密情報をビルド成果物に埋め込まない

## 注意点

- `config.js` は実行時に生成されるため、ビルド時には存在しません
- Vite の警告 `can't be bundled without type="module"` は無視して問題ありません
- ブラウザキャッシュに注意（必要に応じて Cache-Control ヘッダーを調整）
