# 微信登录配置指南

## 概述

本项目已集成微信开放平台OAuth2.0登录功能，允许用户使用微信账号快速登录。

## 前置要求

1. 注册微信开放平台账号：https://open.weixin.qq.com/
2. 创建网站应用并获得以下信息：
   - AppID（应用ID）
   - AppSecret（应用密钥）
3. 配置授权回调域

## 环境变量配置

在 `.env` 文件或 Docker 环境中添加以下变量：

```bash
# 微信开放平台应用配置
WECHAT_APP_ID=your_wechat_app_id
WECHAT_APP_SECRET=your_wechat_app_secret

# 微信OAuth回调地址（可选，默认使用 ORIGIN + /api/v1/auth/wechat/callback）
WECHAT_REDIRECT_URI=https://yourdomain.com/api/v1/auth/wechat/callback
```

### 环境变量说明

- `WECHAT_APP_ID`: 必填，微信开放平台分配的应用ID
- `WECHAT_APP_SECRET`: 必填，微信开放平台分配的应用密钥
- `WECHAT_REDIRECT_URI`: 可选，OAuth回调地址。如果未设置，将自动使用 `ORIGIN` 环境变量生成

## 微信开放平台配置步骤

### 1. 创建网站应用

1. 登录 [微信开放平台](https://open.weixin.qq.com/)
2. 进入"管理中心" -> "网站应用" -> "创建网站应用"
3. 填写应用基本信息：
   - 应用名称
   - 应用简介
   - 应用官网
   - 应用图标

### 2. 配置授权回调域

在应用详情页面的"开发信息"中：
1. 点击"修改"授权回调域
2. 填写你的域名（例如：`yourdomain.com`）
3. 提交审核（通常需要1-3个工作日）

### 3. 获取AppID和AppSecret

应用审核通过后，在应用详情页可以看到：
- AppID
- AppSecret（需要管理员扫码查看）

## Docker Compose 配置示例

```yaml
version: '3'
services:
  pocketbase:
    image: your-pocketbase-image
    environment:
      - WECHAT_APP_ID=wx1234567890abcdef
      - WECHAT_APP_SECRET=your_secret_here
      - ORIGIN=https://yourdomain.com
      # 其他环境变量...
```

## 数据库迁移

系统会自动执行数据库迁移，为 `users` 表添加以下字段：
- `wechat_openid`: 存储微信用户的OpenID
- `avatar_url`: 存储微信头像URL

## 登录流程

1. 用户点击登录页面的"微信登录"按钮
2. 跳转到微信授权页面（显示二维码）
3. 用户使用微信扫码并确认授权
4. 微信回调我们的服务器，携带授权码
5. 服务器使用授权码换取access_token和用户信息
6. 根据微信OpenID查找或创建本地用户
7. 生成本地认证token并登录用户

## 安全注意事项

1. **保护AppSecret**: 永远不要在前端代码或公开仓库中暴露AppSecret
2. **使用HTTPS**: 生产环境必须使用HTTPS协议
3. **State参数验证**: 系统已实现state参数防止CSRF攻击
4. **Token存储**: 认证token存储在HttpOnly cookie中，防止XSS攻击

## 故障排查

### 问题：微信扫码后提示"redirect_uri错误"

**解决方案**：
- 检查 `WECHAT_REDIRECT_URI` 是否与微信开放平台配置的授权回调域一致
- 确保使用的是完整的域名（不包含协议和路径）

### 问题：提示"WeChat credentials not configured"

**解决方案**：
- 检查环境变量 `WECHAT_APP_ID` 和 `WECHAT_APP_SECRET` 是否正确设置
- 重启服务使环境变量生效

### 问题：用户创建失败

**解决方案**：
- 检查数据库迁移是否成功执行
- 确认 `users` 表中存在 `wechat_openid` 和 `avatar_url` 字段
- 查看服务器日志获取详细错误信息

## API端点

### 发起微信登录
```
GET /api/v1/integration/wechat/login
```
重定向到微信授权页面

### 微信OAuth回调
```
GET /api/v1/integration/wechat/callback?code=AUTH_CODE&state=STATE
```
处理微信授权回调，完成登录

## 前端集成

前端登录页面会自动检测可用的OAuth provider并显示相应的登录按钮。无需额外配置。

如果需要在其他地方手动触发微信登录：

```javascript
// 重定向到微信登录
window.location.href = '/api/v1/integration/wechat/login';
```

## 更多资源

- [微信开放平台文档](https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html)
- [OAuth 2.0规范](https://oauth.net/2/)

## 技术支持

如有问题，请查看：
1. 服务器日志
2. 微信开放平台开发者社区
3. 项目Issue tracker
