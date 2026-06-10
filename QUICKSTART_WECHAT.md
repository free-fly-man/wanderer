# 微信登录快速启动指南

## 5分钟快速配置

### 步骤1: 获取微信开放平台凭证

1. 访问 [微信开放平台](https://open.weixin.qq.com/)
2. 注册并登录
3. 创建网站应用
4. 记录 AppID 和 AppSecret

### 步骤2: 配置环境变量

在项目根目录创建或编辑 `.env` 文件：

```bash
# 复制示例文件
cp db/.env.wechat.example .env

# 编辑 .env 文件，填入你的微信凭证
WECHAT_APP_ID=wx1234567890abcdef
WECHAT_APP_SECRET=your_actual_secret_here
ORIGIN=https://yourdomain.com
```

### 步骤3: 配置微信回调域

在微信开放平台控制台：
1. 进入你的应用详情
2. 找到"开发信息"
3. 点击"修改"授权回调域
4. 填写你的域名（例如：`yourdomain.com`）

### 步骤4: 重启服务

```bash
# 使用 Docker Compose
docker compose down
docker compose up -d

# 或直接运行
cd db
go run main.go
```

### 步骤5: 测试登录

1. 打开浏览器访问你的应用
2. 点击登录页面
3. 应该能看到"Login with WeChat"按钮
4. 点击按钮，会跳转到微信授权页面
5. 使用微信扫码并确认
6. 自动登录成功！

## 验证配置

### 检查环境变量是否生效

```bash
# 查看环境变量
echo $WECHAT_APP_ID
echo $WECHAT_APP_SECRET
```

### 检查数据库迁移

连接到数据库，检查 `users` 表是否有以下字段：
- `wechat_openid`
- `avatar_url`

### 检查路由是否注册

访问以下URL应该重定向到微信授权页面：
```
http://yourdomain.com/api/v1/integration/wechat/login
```

## 常见问题速查

| 问题 | 解决方案 |
|------|----------|
| 看不到微信登录按钮 | 检查环境变量是否正确设置并重启服务 |
| redirect_uri错误 | 确保微信后台配置的回调域与你的域名一致 |
| 扫码后无反应 | 检查浏览器控制台和服务器日志 |
| 用户创建失败 | 确认数据库迁移已执行 |

## 调试模式

启用详细日志：

```bash
# 在 .env 文件中添加
LOG_LEVEL=debug
```

查看实时日志：

```bash
# Docker Compose
docker compose logs -f pocketbase

# 直接运行
go run main.go 2>&1 | grep wechat
```

## 下一步

- 阅读完整的 [微信登录配置指南](docs/src/content/docs/guides/wechat-login.md)
- 查看 [实现文档](WECHAT_LOGIN_IMPLEMENTATION.md)
- 加入开发者 Discord 社区

## 需要帮助？

- 📖 [完整文档](https://wanderer.to)
- 💬 [Discord社区](https://discord.gg/USSEBY98CP)
- 🐛 [提交Issue](https://github.com/open-wanderer/wanderer/issues)

---

**提示**: 生产环境务必使用HTTPS协议！
