---
title: Environment configuration
# 环境配置
description: How to configure <span class="-tracking-[0.075em]">wanderer</span> with environment variables
# 如何使用环境变量配置 wanderer
---

Global settings for <span class="-tracking-[0.075em]">wanderer</span> can be adjusted via environment variables. If you deployed <span class="-tracking-[0.075em]">wanderer</span> with docker you can change the environment variables directly in the `docker-compose.yaml`. If you deployed <span class="-tracking-[0.075em]">wanderer</span> on bare-metal you can change the environment variables in the launch script.
<!-- wanderer 的全局设置可以通过环境变量调整。如果你使用 docker 部署 wanderer，可以直接在 `docker-compose.yaml` 中更改环境变量。如果你在裸机上部署 wanderer，可以在启动脚本中更改环境变量。 -->

## Common
<!-- 通用 -->
These variables are shared between all three services.
<!-- 这些变量在三个服务之间共享。 -->

| Environment Variable | Description                                                      | Default                                     |
| -------------------- | ---------------------------------------------------------------- | ------------------------------------------- |
| MEILI_URL            | IP or hostname (including the port) of your meilisearch instance | http://search:7700                          |
| MEILI_MASTER_KEY     | Master API key for your meilisearch instance                     | vODkljPcfFANYNepCHyDyGjzAMPcdHnrb6X5KyXQPWo |

## Meilisearch
<!-- Meilisearch -->
Since we use an unmodified installation of meilisearch you can use all variables listed in meilisearch's documentation. You can find a full list over [here](https://www.meilisearch.com/docs/learn/configuration/instance_options).
<!-- 由于我们使用未修改的 meilisearch 安装，你可以使用 meilisearch 文档中列出的所有变量。你可以在[这里](https://www.meilisearch.com/docs/learn/configuration/instance_options)找到完整列表。 -->

| Environment Variable | Description                   | Default |
| -------------------- | ----------------------------- | ------- |
| MEILI_NO_ANALYTICS   | Disable meilisearch telemetry | true    |

## Pocketbase
<!-- Pocketbase -->
| Environment Variable          | Description                                                                                                       | Default               |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------- | --------------------- |
| ORIGIN                        | Public IP or hostname (including the port) of your <span class="-tracking-[0.075em]">wanderer</span> frontend (must be the same as in the frontend config) | http://localhost:3000 |
| POCKETBASE_ENCRYPTION_KEY     | Valid 32 character AES key. Used to encrypt secrets                                                               |                       |
| POCKETBASE_CRON_SYNC_SCHEDULE | Valid cron expression. Sets how often trails are synced from 3rd party integrations                               | 0 2 * * *             |
| POCKETBASE_SMTP_ENABLED       | Enables or disables SMTP functionality. Accepted values are true or false                                         | false                 |
| POCKETBASE_SMTP_SENDER_ADDRESS | The email address used as the "From" address in outgoing emails                                                   |                       |
| POCKETBASE_SMTP_SENDER_NAME   | The display name shown as the sender in outgoing emails                                                           |                       |
| POCKETBASE_SMTP_HOST          | The hostname or IP address of the SMTP server                                                                     |                       |
| POCKETBASE_SMTP_PORT          | The port number used to connect to the SMTP server                                                                |                       |
| POCKETBASE_SMTP_USERNAME      | The username used to authenticate with the SMTP server                                                            |                       |
| POCKETBASE_SMTP_PASSWORD      | The password used to authenticate with the SMTP server                                                            |                       |

## Frontend
<!-- 前端 -->

| Environment Variable    | Description                                                                      | Default                             |
| ----------------------- | -------------------------------------------------------------------------------- | ----------------------------------- |
| ORIGIN                  | Public IP or hostname (including the port) of your <span class="-tracking-[0.075em]">wanderer</span> instance             | http://localhost:3000               |
| BODY_SIZE_LIMIT         | Maximum allowed upload size                                                      | Infinity                            |
| PUBLIC_POCKETBASE_URL   | IP or hostname (including the port) of your pocketbase instance                  | http://db:8090                      |
| PUBLIC_DISABLE_SIGNUP   | Disables signup option for new users                                             | false                               |
| PUBLIC_PRIVATE_INSTANCE | Setting this to true will block visitors from viewing content without an account | false                               |
| PUBLIC_MAP_MAX_POLYLINES | Maximum number of polylines (route previews) to show simultaneously on the map, based on result density | 100 |
| UPLOAD_FOLDER           | Folder from which <span class="-tracking-[0.075em]">wanderer</span> auto-uploads trails                                   | /app/uploads                        |
| UPLOAD_USER             | Username for the account with which <span class="-tracking-[0.075em]">wanderer</span> auto-uploads trails                 |                                     |
| UPLOAD_PASSWORD         | Password for the account with which <span class="-tracking-[0.075em]">wanderer</span> auto-uploads trails                 |                                     |

## Geocoding & Routing
<!-- 地理编码和路线规划 -->

These variables configure server-side requests to Valhalla, Nominatim and Overpass.
<!-- 这些变量配置对 Valhalla、Nominatim 和 Overpass 的服务器端请求。 -->

| Environment Variable     | Description                                                                 | Default                             |
| ------------------------ | --------------------------------------------------------------------------- | ----------------------------------- |
| VALHALLA_URL     | Valhalla API URL used for auto-routing and elevation data       | https://valhalla1.openstreetmap.de  |
| NOMINATIM_URL    | Nominatim API URL used for (reverse) geocoding                  | https://nominatim.openstreetmap.org |
| OVERPASS_API_URL | Overpass API URL used for map points of interest                | https://overpass-api.de             |

When `*_URL` is unset, the backend falls back to legacy `PUBLIC_*_URL`.
<!-- 当 `*_URL` 未设置时，后端将回退到旧的 `PUBLIC_*_URL`。 -->

## Custom CA certificates
<!-- 自定义 CA 证书 -->

If your API endpoints use certificates signed by a private CA, add the CA bundle and set `NODE_EXTRA_CA_CERTS` for the `web` service.
<!-- 如果你的 API 端点使用由私有 CA 签名的证书，请添加 CA 包并为 `web` 服务设置 `NODE_EXTRA_CA_CERTS`。 -->

| Environment Variable | Description                                                              | Default |
| -------------------- | ------------------------------------------------------------------------ | ------- |
| NODE_EXTRA_CA_CERTS  | Path to an additional CA bundle used by Node.js TLS connections          |         |

Example (`docker-compose.yml`):

```yaml
services:
  web:
    environment:
      NODE_EXTRA_CA_CERTS: /etc/ssl/private-ca/ca.pem
    volumes:
      - ./certs/ca.pem:/etc/ssl/private-ca/ca.pem:ro
```
