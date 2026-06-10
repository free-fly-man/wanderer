---
title: Import/Export
# 导入/导出
description: How to import and export trails in wanderer
# 如何在 wanderer 中导入和导出路线
---

## Import
<!-- 导入 -->

<span class="-tracking-[0.075em]">wanderer</span> supports bulk uploading of trails via an auto-upload folder. A file watcher automatically detects new files added to this directory and imports them into your library.
<!-- wanderer 支持通过自动上传文件夹批量上传路线。文件监视器会自动检测添加到此目录中的新文件并将其导入你的路线库。 -->

:::note
This feature is currently only available for Docker installations. Files added to the folder while the container is not running are ignored.
<!-- 此功能目前仅适用于 Docker 安装。容器未运行时添加到文件夹中的文件将被忽略。 -->
:::

:::caution
Successfully uploaded files will be deleted from the auto-upload folder.
<!-- 成功上传的文件将从自动上传文件夹中删除。 -->
:::

### Configuration
<!-- 配置 -->

#### Environment variables
<!-- 环境变量 -->

The following environment variable must be present in the `wanderer-web` docker container and set to a valid volume path (see below).
<!-- 以下环境变量必须存在于 `wanderer-web` docker 容器中，并设置为有效的卷路径（见下文）。 -->

| Environment Variable | Description                    | Default      |
| -------------------- | ------------------------------ | ------------ |
| UPLOAD_FOLDER        | Path to the auto-upload folder | /app/uploads |


#### Volume
<!-- 存储卷 -->
Make sure to mount the upload folder as a volume to your host system. The default `docker-compose.yml` already includes this volume. Ensure that the mapped value matches the one in the `UPLOAD_FOLDER` environment variable.
<!-- 确保将上传文件夹作为存储卷挂载到你的主机系统。默认的 `docker-compose.yml` 已包含此卷。确保映射值与 `UPLOAD_FOLDER` 环境变量中的值匹配。 -->

#### API token
<!-- API 令牌 -->
The bulk upload process uses API tokens to authenticate requests and determine which user account the uploaded trails should be assigned to.
<!-- 批量上传过程使用 API 令牌来验证请求并确定上传的路线应分配给哪个用户账户。 -->

1. Create an API token: Follow the steps in the [Authentication section](/use/authentication/#api-tokens) to generate a new API token.
<!-- 1. 创建 API 令牌：按照[身份验证部分](/use/authentication/#api-tokens)的步骤生成新的 API 令牌。 -->
2. Prepare the folder structure: Create the folder: Inside your UPLOAD_FOLDER, create a sub-folder named exactly after your API token.
<!-- 2. 准备文件夹结构：创建文件夹：在你的 UPLOAD_FOLDER 内，创建一个以你的 API 令牌命名的子文件夹。 -->
3. Upload: Move your trail files (e.g., .gpx, .fit, or .kml) into that sub-folder.
<!-- 3. 上传：将你的路线文件（如 .gpx、.fit 或 .kml）移动到该子文件夹中。 -->

**Example structure**:
    `/app/uploads/wanderer_key_<...>/my_trail.gpx`


## Export
<!-- 导出 -->

To export selected trails head over to `/trails` and select the trails you want to export. From the <span class="inline-block w-8 h-8 bg-primary rounded-full text-center text-white">⋮</span> menu select "Export". You can export the route data either in GPX or in GeoJSON format. Furthermore, you can choose whether you want to include the photos and the summit book of the trail. In any case, <span class="-tracking-[0.075em]">wanderer</span> will create a ZIP archive with all the data that is then downloaded.
<!-- 要导出选定的路线，请前往 `/trails` 并选择你想导出的路线。从 <span>⋮</span> 菜单中选择“导出”。你可以以 GPX 或 GeoJSON 格式导出路线数据。此外，你可以选择是否包含照片和登顶日志。无论如何，wanderer 都会创建一个包含所有数据的 ZIP 压缩包然后下载。 -->

You can also export all of your trails at once. To do so, head over to `/settings/export` and click "Export all trails". The other steps remain analogous to exporting a single trail.
<!-- 你也可以一次导出所有路线。为此，前往 `/settings/export` 并点击“导出所有路线”。其他步骤与导出单个路线相同。 -->
