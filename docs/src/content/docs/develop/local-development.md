---
title: Local development
# 本地开发
description: How to install <span class="-tracking-[0.075em]">wanderer</span> for local development
# 如何安装 wanderer 进行本地开发
---

If you would like to set up a development environment on your own machine to work on <span class="-tracking-[0.075em]">wanderer</span> please first follow the bare-metal installation steps in the [installation guide](/run/installation#from-source). We will slightly modify the launch script to launch a node server in development mode instead:
<!-- 如果你想在本地机器上设置开发环境来开发 wanderer，请先按照[安装指南](/run/installation#from-source)中的裸机安装步骤操作。我们将稍微修改启动脚本，以在开发模式下启动 node 服务器： -->

```bash
trap "kill 0" EXIT

export ORIGIN=http://localhost:5173
export MEILI_URL=http://127.0.0.1:7700
export MEILI_MASTER_KEY=p2gYZAWODOrwTPr4AYoahCZ9CI8y9bUd0yQLGk-E3m8
export PUBLIC_POCKETBASE_URL=http://127.0.0.1:8090
export VALHALLA_URL=https://valhalla1.openstreetmap.de
export POCKETBASE_ENCRYPTION_KEY=9ada3c93163812101e50e2bf49e880bc

cd search && ./meilisearch --master-key $MEILI_MASTER_KEY &
cd db && ./pocketbase serve &
cd web && npm run dev &

wait
```

This will bring up a `meilisearch` instance on `http://127.0.0.1:7700`, a `PocketBase` instance on `http://127.0.0.1:8090`, and a `vite` server for the <span class="-tracking-[0.075em]">wanderer</span> frontend on `http://localhost:5173`.
<!-- 这将在 `http://127.0.0.1:7700` 启动一个 `meilisearch` 实例，在 `http://127.0.0.1:8090` 启动一个 `PocketBase` 实例，并在 `http://localhost:5173` 启动 wanderer 前端的 `vite` 服务器。 -->

## PocketBase dashboard
<!-- PocketBase 管理面板 -->

It is highly advisable to create an admin user to access PocketBase's dashboard. To do so, please refer to the [backend configuration](/run/backend-configuration/#setup) section of the documentation.
<!-- 强烈建议创建一个管理员用户来访问 PocketBase 的管理面板。为此，请参阅文档的[后端配置](/run/backend-configuration/#setup)部分。 -->

## Building
<!-- 构建 -->

When you are done with development and would like to build <span class="-tracking-[0.075em]">wanderer</span> for production there are some steps to follow.
<!-- 当你完成开发并想为生产环境构建 wanderer 时，有一些步骤需要遵循。 -->

### PocketBase
<!-- PocketBase -->

If you modified code in any of the `*.go` files make sure to build an updated binary with `go build`. In case you only edited tables via the `PocketBase` admin panel you don't need to do anything. The database will be migrated automatically.
<!-- 如果你修改了任何 `*.go` 文件中的代码，请确保使用 `go build` 构建更新的二进制文件。如果你只是通过 PocketBase 管理面板编辑了表，则无需执行任何操作。数据库将自动迁移。 -->

Since the Docker image is using Alpine linux with musl, you need to compile the binary
using musl or using `CGO_ENABLED=false` as shown below.
<!-- 由于 Docker 镜像使用的是带有 musl 的 Alpine linux，你需要使用 musl 或如下所示的 `CGO_ENABLED=false` 来编译二进制文件。 -->

```bash
env CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o pocketbase_amd64
```

### Frontend
<!-- 前端 -->

For the frontend there are no further caveats. Simply run `npm run build`.
<!-- 对于前端没有进一步的注意事项。只需运行 `npm run build`。 -->

### Docker
<!-- Docker -->

To create local docker images of <span class="-tracking-[0.075em]">wanderer</span> simply run the script below. These will work as drop-in replacements for the ones hosted on docker hub. This will only work if you have already completed the steps above.
<!-- 要创建 wanderer 的本地 docker 镜像，只需运行以下脚本。这些将作为 docker hub 上托管的镜像的直接替代品。只有在你已完成上述步骤后才能使用。 -->

```bash
# db
docker build db/ --no-cache -t flomp/wanderer-db:latest 

# web
docker build web/ --no-cache  -t flomp/wanderer-web:latest 
```

