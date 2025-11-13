# Admin UI

管理画面のフロントエンドアプリケーション

## 開発環境

```shell
git submodule update --init --recursive
git submodule update --remote

bash ./scripts/generate-dev-certs.sh

export AUTH0_DOMAIN='your_auth0_domain'
export AUTH0_CLIENT_ID='your_auth0_client_id'
export AUTH0_AUDIENCE='your_auth0_audience'
docker compose up --build
```
