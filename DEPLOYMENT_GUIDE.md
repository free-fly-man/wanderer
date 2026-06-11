# Wanderer 部署指南

## 📋 目录
- [快速开始](#快速开始)
- [前置要求](#前置要求)
- [配置步骤](#配置步骤)
- [部署命令](#部署命令)
- [验证部署](#验证部署)
- [故障排查](#故障排查)

---

## 🚀 快速开始

### 5分钟部署（本地开发）

```bash
# 1. 克隆项目
git clone <repository-url>
cd wanderer

# 2. 复制环境变量文件
cp .env.example .env

# 3. 启动服务
docker compose up -d

# 4. 访问应用
# 浏览器打开: http://localhost:3000
```

> ⚠️ **注意**: 快速开始使用默认密钥，仅适用于本地开发。生产环境请务必配置安全密钥！

---

## 📦 前置要求

### 必需软件

| 软件 | 版本 | 说明 |
|------|------|------|
| Docker | 20.10+ | 容器运行时 |
| Docker Compose | 2.0+ | 编排工具 |

### 检查安装

```bash
# 检查 Docker
docker --version
# 输出示例: Docker version 24.0.7, build afdd53b

# 检查 Docker Compose
docker compose version
# 输出示例: Docker Compose version v2.21.0
```

### 系统要求

- **CPU**: 2核心以上
- **内存**: 4GB RAM 以上
- **磁盘**: 10GB 可用空间
- **操作系统**: Linux / macOS / Windows

---

## ⚙️ 配置步骤

### 步骤1: 创建环境变量文件

```bash
# 复制模板
cp .env.example .env
```

### 步骤2: 生成安全密钥（生产环境必需）

#### Linux / macOS

```bash
# 生成 PocketBase 加密密钥（32字符）
echo "POCKETBASE_ENCRYPTION_KEY=$(openssl rand -hex 16)"

# 生成 Meilisearch 主密钥（至少32字符）
echo "MEILI_MASTER_KEY=$(openssl rand -base64 32)"
```

#### Windows PowerShell

```powershell
# 生成 PocketBase 加密密钥
$pbKey = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
echo "POCKETBASE_ENCRYPTION_KEY=$pbKey"

# 生成 Meilisearch 主密钥
$meiliKey = -join ((48..57) + (65..90) + (97..122) + (43,47) | Get-Random -Count 48 | ForEach-Object {[char]$_})
echo "MEILI_MASTER_KEY=$meiliKey"
```

### 步骤3: 编辑 .env 文件

```bash
# 使用你喜欢的编辑器
nano .env        # Linux/macOS
notepad .env     # Windows
code .env        # VS Code
```

填入生成的密钥和其他配置：

```bash
# ===== 必需配置 =====
POCKETBASE_ENCRYPTION_KEY=你的32字符密钥
MEILI_MASTER_KEY=你的至少32字符密钥
ORIGIN=http://localhost:3000

# ===== 微信登录（可选）=====
WECHAT_APP_ID=wx1234567890abcdef
WECHAT_APP_SECRET=your_secret_here

# ===== 地图服务 =====
AMAP_KEY=your_amap_key
```

### 步骤4: 创建数据目录

```bash
# 自动创建（Docker会自动创建）
mkdir -p data/data.ms
mkdir -p data/pb_data
mkdir -p data/uploads
```

---

## 🎯 部署命令

### 首次部署

```bash
# 启动所有服务
docker compose up -d

# 查看启动日志
docker compose logs -f
```

### 更新部署

```bash
# 拉取最新镜像
docker compose pull

# 重启服务
docker compose up -d

# 清理旧镜像
docker image prune -f
```

### 停止服务

```bash
# 停止所有服务
docker compose down

# 停止并删除数据卷（⚠️ 会删除所有数据）
docker compose down -v
```

---

## ✅ 验证部署

### 1. 检查容器状态

```bash
docker compose ps
```

**期望输出**:
```
NAME                STATUS                    PORTS
wanderer-db         Up (healthy)              0.0.0.0:8090->8090/tcp
wanderer-search     Up (healthy)              0.0.0.0:7700->7700/tcp
wanderer-web        Up (healthy)              0.0.0.0:3000->3000/tcp
```

### 2. 检查健康端点

```bash
# PocketBase
curl http://localhost:8090/health
# 期望: {"status":"ok","timestamp":"..."}

# Meilisearch
curl http://localhost:7700/health
# 期望: {"status":"available"}

# Web Frontend
curl http://localhost:3000/
# 期望: HTML内容
```

### 3. 访问应用

打开浏览器访问: **http://localhost:3000**

应该能看到 wanderer 的首页。

### 4. 测试功能

- [ ] 注册新用户
- [ ] 登录系统
- [ ] 上传轨迹文件
- [ ] 查看地图
- [ ] 搜索轨迹

---

## 🔧 高级配置

### 启用微信登录

1. **在微信开放平台注册**
   - 访问: https://open.weixin.qq.com/
   - 创建网站应用
   - 获取 AppID 和 AppSecret

2. **配置回调域名**
   - 在微信后台配置授权回调域
   - 例如: `yourdomain.com`

3. **更新 .env 文件**
   ```bash
   WECHAT_APP_ID=wx1234567890abcdef
   WECHAT_APP_SECRET=your_secret_here
   WECHAT_REDIRECT_URI=https://yourdomain.com/api/v1/auth/wechat/callback
   ```

4. **重启服务**
   ```bash
   docker compose restart db
   ```

### 配置 HTTPS（生产环境）

使用 Nginx 反向代理：

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

更新 `.env`:
```bash
ORIGIN=https://yourdomain.com
```

### 自定义端口

编辑 `docker-compose.yml`:

```yaml
services:
  web:
    ports:
      - "8080:3000"  # 改为 8080 端口
  
  db:
    ports:
      - "8091:8090"  # 改为 8091 端口
```

---

## 🐛 故障排查

### 问题1: 容器无法启动

**症状**: `docker compose ps` 显示 Exit 状态

**解决**:
```bash
# 查看详细日志
docker compose logs db
docker compose logs web
docker compose logs search

# 常见原因:
# 1. 端口被占用
netstat -tulpn | grep :3000

# 2. 权限问题
sudo chmod -R 755 ./data

# 3. 磁盘空间不足
df -h
```

### 问题2: 健康检查失败

**症状**: 容器状态显示 unhealthy

**解决**:
```bash
# 检查服务是否响应
curl http://localhost:8090/health
curl http://localhost:7700/health
curl http://localhost:3000/

# 重启不健康的容器
docker compose restart db

# 等待几分钟后再次检查
docker compose ps
```

### 问题3: 数据库连接失败

**症状**: Web界面显示连接错误

**解决**:
```bash
# 检查网络
docker network inspect wanderer_wanderer

# 检查容器IP
docker inspect wanderer-db | grep IPAddress

# 测试内部连接
docker exec wanderer-web ping db
```

### 问题4: 微信登录不工作

**症状**: 点击微信登录无反应或报错

**解决**:
```bash
# 检查环境变量
docker exec wanderer-db env | grep WECHAT

# 查看日志
docker compose logs db | grep wechat

# 确认配置
# 1. WECHAT_APP_ID 和 WECHAT_APP_SECRET 已设置
# 2. 回调域名在微信后台正确配置
# 3. 应用已通过微信审核
```

### 问题5: 地图无法加载

**症状**: 地图显示空白或错误

**解决**:
```bash
# 检查 AMAP_KEY
docker exec wanderer-web env | grep AMAP

# 验证API密钥有效性
curl "https://restapi.amap.com/v3/ip?key=YOUR_KEY"

# 如果无效，获取新密钥
# 访问: https://console.amap.com/
```

### 问题6: 数据丢失

**症状**: 重启后数据消失

**解决**:
```bash
# 检查卷挂载
docker inspect wanderer-db | grep Mounts -A 20

# 确认数据目录存在
ls -la ./data/pb_data
ls -la ./data/data.ms

# 检查权限
sudo chown -R 1000:1000 ./data
```

---

## 📊 监控和维护

### 查看资源使用

```bash
# 实时资源监控
docker stats

# 磁盘使用
docker system df

# 日志大小
du -sh ./data/*/
```

### 备份数据

```bash
# 停止服务
docker compose down

# 备份数据目录
tar czf backup_$(date +%Y%m%d).tar.gz ./data/

# 重启服务
docker compose up -d
```

### 清理空间

```bash
# 清理未使用的镜像
docker image prune -a

# 清理未使用的网络
docker network prune

# 清理日志
docker compose logs --tail=0
```

---

## 🔐 安全建议

### 生产环境清单

- [ ] 使用强随机密钥（不要使用默认值）
- [ ] 配置 HTTPS
- [ ] 禁用公开注册 (`PUBLIC_DISABLE_SIGNUP=true`)
- [ ] 配置防火墙规则
- [ ] 定期更新镜像
- [ ] 启用自动备份
- [ ] 监控系统日志
- [ ] 限制 API 访问频率

### 密钥管理

```bash
# 推荐: 使用密钥管理服务
# - HashiCorp Vault
# - AWS Secrets Manager
# - Azure Key Vault

# 或者: 使用 Docker Secrets
echo "your_secret" | docker secret create my_secret -
```

---

## 📚 相关文档

- [微信登录配置](docs/src/content/docs/guides/wechat-login.md)
- [Docker Compose 检查报告](DOCKER_COMPOSE_CHECK.md)
- [项目README](README.md)

---

## 💬 获取帮助

- 📖 [完整文档](https://wanderer.to)
- 💬 [Discord社区](https://discord.gg/USSEBY98CP)
- 🐛 [提交Issue](https://github.com/open-wanderer/wanderer/issues)

---

**最后更新**: 2026年6月10日  
**版本**: 1.0.0
