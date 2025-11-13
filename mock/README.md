# Admin API モックサーバ

このプロジェクトは `../api-spec/admin/v1alpha1/openapi.yaml` で定義されている Admin API のモックサーバです。

## 概要

- **API仕様**: `../api-spec/admin/v1alpha1/openapi.yaml` に基づくモックサーバ
- **データストレージ**: インメモリ（メモリ上に状態を保持）
- **技術スタック**: Node.js + Hono + TypeScript
- **ポート**: 3000

## 提供する API エンドポイント

### ヘルスチェック
- `GET /v1alpha1/health/liveness` - サービスの生存確認
- `GET /v1alpha1/health/readiness` - サービスの準備状態確認

### プロジェクト管理
- `GET /v1alpha1/projects` - プロジェクト一覧の取得（ページネーション対応）
- `POST /v1alpha1/projects` - 新規プロジェクトの作成

## セットアップ・実行

### 依存関係のインストール
```bash
npm install
```

### 開発サーバの起動
```bash
npm run dev
```

### ビルドと実行
```bash
npm run build
npm start
```

## アクセス

サーバ起動後、以下のURLでアクセス可能です：

```
http://localhost:3000
```

## データの永続化について

このモックサーバはインメモリでデータを管理しているため、サーバを再起動すると全てのデータが初期化されます。開発・テスト用途での使用を想定しています。

## API仕様

詳細なAPI仕様については、`../api-spec/admin/v1alpha1/openapi.yaml` を参照してください。