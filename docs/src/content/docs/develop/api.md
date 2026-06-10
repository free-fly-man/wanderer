---
title: wanderer API
# wanderer API
description: How to use wanderer's API
# 如何使用 wanderer 的 API
---

wanderer comes with a fully functional RESTful API out of the box. It largely follows the CRUD conventions implemented by the [PocketBase backend](https://pocketbase.io/docs/api-records/#crud-actions). All endpoints are available at `http://<wanderer_host>/api/v1`. The full technical API documentation can be found at `http://<wanderer_host>/docs/api/index.html` and is also provided in the [API Reference](/api-reference).
<!-- wanderer 开箱即用，带有功能齐全的 RESTful API。它在很大程度上遵循 [PocketBase 后端](https://pocketbase.io/docs/api-records/#crud-actions) 实现的 CRUD 约定。所有端点可在 `http://<wanderer_host>/api/v1` 访问。完整的技术 API 文档可在 `http://<wanderer_host>/docs/api/index.html` 找到，并在 [API 参考](/api-reference) 中提供。 -->

## Authentication
<!-- 身份验证 -->
wanderer's API uses cookie-based authentication. To receive an auth cookie send a request to the `/auth/login` endpoint. The request must contain a JSON body in the following form:
<!-- wanderer 的 API 使用基于 cookie 的身份验证。要接收身份验证 cookie，请向 `/auth/login` 端点发送请求。请求必须包含以下形式的 JSON 主体： -->
```
{
    username: string,
    password: string
}
```
The cookie from the response can be sent in a subsequent request to authenticate it.
<!-- 响应中的 cookie 可以在后续请求中发送以进行身份验证。 -->
### Example
<!-- 示例 -->
```bash
curl --header "Content-Type: application/json" --request POST \
--cookie-jar ./wanderer-credentials \
--data '{"username":"MyUser","password":"mysecretpassword"}' \
http://localhost:3000/api/v1/auth/login
```


## Upload trails
<!-- 上传路线 -->
One common use case for wanderer's API is bulk uploading GPX files to create new trails. For that, the API provides a separate endpoint: `/trail/upload`. You must first log in to use the endpoint. Afterwards you can send a GPX file to the endpoint to let <span class="-tracking-[0.075em]">wanderer</span> parse it an create a new trail in your collection. <span class="-tracking-[0.075em]">wanderer</span> will try to infer as much information as possible from the file itself. All additional information can be added to the trail via the UPDATE [endpoint](/api-reference/operations/updatetrail).
<!-- wanderer API 的一个常见用例是批量上传 GPX 文件以创建新路线。为此，API 提供了一个单独的端点：`/trail/upload`。你必须先登录才能使用该端点。之后，你可以向端点发送 GPX 文件，让 wanderer 解析它并在你的收藏中创建新路线。wanderer 会尝试从文件本身推断尽可能多的信息。所有额外信息可以通过 UPDATE [端点](/api-reference/operations/updatetrail) 添加到路线中。 -->

### Example
<!-- 示例 -->
```bash
curl --location --request PUT 'http://localhost:3000/api/v1/trail/upload' \
--header 'Content-Type: application/gpx+xml' \
--cookie './wanderer-credentials' \
--data-binary '@my_trail.gpx'
```
