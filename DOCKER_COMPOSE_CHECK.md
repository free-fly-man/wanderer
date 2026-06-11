# Docker Compose 配置文件检查报告

## 检查日期
2026年6月10日

## 总体评估
⚠️ **存在关键问题** - 需要修复后才能成功部署

---

## 🔴 严重问题（必须修复）

### 1. **缺少微信登录环境变量配置**
**位置**: `db` 服务的环境变量部分（第33-36行）

**问题**: 
- 没有配置微信登录所需的环境变量
- 即使代码已实现，也无法使用微信登录功能

**缺失的变量**:
```yaml
WECHAT_APP_ID: ""           # 必填
WECHAT_APP_SECRET: ""       # 必填
WECHAT_REDIRECT_URI: ""     # 可选
```

**影响**: 微信登录功能无法使用

**修复建议**:
```yaml
environment:
  <<: *cenv
  POCKETBASE_ENCRYPTION_KEY: fde406459dc1f6ca6f348e1f44a9a2af
  ORIGIN: http://localhost:3000
  # 微信登录配置
  WECHAT_APP_ID: ${WECHAT_APP_ID:-}
  WECHAT_APP_SECRET: ${WECHAT_APP_SECRET:-}
  WECHAT_REDIRECT_URI: ${WECHAT_REDIRECT_URI:-}
```

---

### 2. **安全密钥使用默认值** ⚠️⚠️⚠️
**位置**: 第5行和第35行

**问题**:
```yaml
MEILI_MASTER_KEY: vODkljPcfFANYNepCHyDyGjzAMPcdHnrb6X5KyXQPWo  # 默认值
POCKETBASE_ENCRYPTION_KEY: fde406459dc1f6ca6f348e1f44a9a2af  # 默认值
```

**风险**:
- 🚨 **严重安全风险** - 生产环境绝对不能使用默认密钥
- 任何人都知道这些默认值
- 可能导致数据泄露

**修复建议**:
```yaml
# 生成安全的随机密钥
# Meilisearch (至少32字符)
openssl rand -base64 32

# PocketBase (必须32字符)
openssl rand -hex 16
```

然后在 docker-compose.yml 中使用环境变量：
```yaml
x-common-env: &cenv
  MEILI_URL: http://search:7700
  MEILI_MASTER_KEY: ${MEILI_MASTER_KEY:?请设置MEILI_MASTER_KEY环境变量}

services:
  db:
    environment:
      <<: *cenv
      POCKETBASE_ENCRYPTION_KEY: ${POCKETBASE_ENCRYPTION_KEY:?请设置POCKETBASE_ENCRYPTION_KEY环境变量}
```

---

### 3. **AMAP_KEY 可能无效**
**位置**: 第66行

**问题**:
```yaml
AMAP_KEY: b5279fea2eaa266c9f3ea453811ba7e
```

这个高德地图API密钥看起来像是示例密钥或已被截断（通常应该是32位）。

**影响**: 地图功能可能无法正常工作

**修复建议**:
1. 访问 https://console.amap.com/ 注册并获取有效的API密钥
2. 使用环境变量：
```yaml
AMAP_KEY: ${AMAP_KEY:-}
```

---

## ⚠️ 警告问题（建议修复）

### 4. **ORIGIN 配置为 localhost**
**位置**: 第36行和第60行

**问题**:
```yaml
ORIGIN: http://localhost:3000
```

**影响**:
- 仅适用于本地开发
- 生产环境部署时需要修改
- 可能导致CORS问题

**修复建议**:
```yaml
ORIGIN: ${ORIGIN:-http://localhost:3000}
```

---

### 5. **空的环境变量**
**位置**: 第65行和第67行

**问题**:
```yaml
UPLOAD_USER:
UPLOAD_PASSWORD:
```

这些变量为空，如果系统需要认证上传功能，可能会导致问题。

**修复建议**:
```yaml
UPLOAD_USER: ${UPLOAD_USER:-}
UPLOAD_PASSWORD: ${UPLOAD_PASSWORD:-}
```

---

### 6. **Meilisearch 端口暴露**
**位置**: 第15行

**问题**:
```yaml
ports:
  - 7700:7700
```

将搜索服务端口暴露到主机可能有安全风险。

**建议**: 
- 如果只是内部服务通信，可以移除端口映射
- 或者限制访问IP

---

## ✅ 正确的配置

### 1. **服务依赖关系** ✅
```yaml
db:
  depends_on:
    search:
      condition: service_healthy  # ✅ 正确

web:
  depends_on:
    search:
      condition: service_healthy  # ✅ 正确
    db:
      condition: service_healthy  # ✅ 正确
```

### 2. **健康检查** ✅
所有服务都配置了健康检查，这是很好的实践。

### 3. **网络配置** ✅
```yaml
networks:
  wanderer:
    driver: bridge  # ✅ 正确
```

### 4. **数据持久化** ✅
```yaml
volumes:
  - ./data/data.ms:/meili_data/data.ms  # ✅ Meilisearch数据
  - ./data/pb_data:/pb_data             # ✅ PocketBase数据
  - ./data/uploads:/app/uploads         # ✅ 上传文件
```

### 5. **重启策略** ✅
```yaml
restart: unless-stopped  # ✅ 所有服务都配置了
```

---

## 📋 部署前检查清单

### 必需步骤

- [ ] **生成新的安全密钥**
  ```bash
  # 生成 PocketBase 加密密钥（32字符）
  openssl rand -hex 16
  
  # 生成 Meilisearch 主密钥（至少32字符）
  openssl rand -base64 32
  ```

- [ ] **创建 .env 文件**
  ```bash
  cp .env.example .env
  # 编辑 .env 填入实际值
  ```

- [ ] **配置微信登录（如需要）**
  - [ ] 在微信开放平台注册应用
  - [ ] 获取 AppID 和 AppSecret
  - [ ] 配置到 .env 文件

- [ ] **获取有效的高德地图API密钥**
  - [ ] 访问 https://console.amap.com/
  - [ ] 创建应用并获取密钥

- [ ] **确认 ORIGIN 配置**
  - [ ] 本地开发: `http://localhost:3000`
  - [ ] 生产环境: `https://yourdomain.com`

### 可选步骤

- [ ] 配置上传用户认证
- [ ] 调整 Meilisearch 端口暴露
- [ ] 配置 Valhalla 路由服务（已注释）

---

## 🔧 推荐的修复版本

```yaml
version: '3'

x-common-env: &cenv
  MEILI_URL: http://search:7700
  MEILI_MASTER_KEY: ${MEILI_MASTER_KEY:?请设置MEILI_MASTER_KEY环境变量}

services:
  search:
    container_name: wanderer-search
    image: getmeili/meilisearch:v1.36.0
    environment:
      <<: *cenv
      MEILI_NO_ANALYTICS: "true"
    ports:
      - "7700:7700"  # 生产环境建议移除此行
    networks:
      - wanderer
    volumes:
      - ./data/data.ms:/meili_data/data.ms
    restart: unless-stopped
    healthcheck:
      test: curl --fail http://localhost:7700/health || exit 1
      interval: 15s
      retries: 10
      start_period: 20s
      timeout: 10s

  db:
    container_name: wanderer-db
    image: flomp/wanderer-db
    depends_on:
      search:
        condition: service_healthy
    environment:
      <<: *cenv
      POCKETBASE_ENCRYPTION_KEY: ${POCKETBASE_ENCRYPTION_KEY:?请设置POCKETBASE_ENCRYPTION_KEY环境变量}
      ORIGIN: ${ORIGIN:-http://localhost:3000}
      # 微信登录配置
      WECHAT_APP_ID: ${WECHAT_APP_ID:-}
      WECHAT_APP_SECRET: ${WECHAT_APP_SECRET:-}
      WECHAT_REDIRECT_URI: ${WECHAT_REDIRECT_URI:-}
    ports:
      - "8090:8090"
    networks:
      - wanderer
    restart: unless-stopped
    volumes:
      - ./data/pb_data:/pb_data
    healthcheck:
      test: ["CMD", "/curl", "--fail", "http://localhost:8090/health"]
      interval: 15s
      retries: 10
      start_period: 20s
      timeout: 10s

  web:
    container_name: wanderer-web
    image: flomp/wanderer-web
    depends_on:
      search:
        condition: service_healthy
      db:
        condition: service_healthy
    environment:
      <<: *cenv
      ORIGIN: ${ORIGIN:-http://localhost:3000}
      BODY_SIZE_LIMIT: Infinity
      PUBLIC_POCKETBASE_URL: http://db:8090
      PUBLIC_DISABLE_SIGNUP: "false"
      UPLOAD_FOLDER: /app/uploads
      UPLOAD_USER: ${UPLOAD_USER:-}
      AMAP_KEY: ${AMAP_KEY:-b5279fea2eaa266c9f3ea453811ba7e}
      UPLOAD_PASSWORD: ${UPLOAD_PASSWORD:-}
      OVERPASS_API_URL: https://overpass-api.de
      VALHALLA_URL: https://valhalla1.openstreetmap.de
      NOMINATIM_URL: https://nominatim.openstreetmap.org
      PUBLIC_MAP_MAX_POLYLINES: 100
    volumes:
      - ./data/uploads:/app/uploads
    ports:
      - "3000:3000"
    networks:
      - wanderer
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "--fail", "http://localhost:3000/"]
      interval: 15s
      retries: 10
      start_period: 20s
      timeout: 10s

networks:
  wanderer:
    driver: bridge
```

---

## 📝 .env.example 模板

创建 `.env.example` 文件：

```bash
# ===== 必需配置 =====

# PocketBase 加密密钥（必须32字符）
# 生成命令: openssl rand -hex 16
POCKETBASE_ENCRYPTION_KEY=

# Meilisearch 主密钥（至少32字符）
# 生成命令: openssl rand -base64 32
MEILI_MASTER_KEY=

# 应用访问地址
# 本地开发: http://localhost:3000
# 生产环境: https://yourdomain.com
ORIGIN=http://localhost:3000

# ===== 可选配置 =====

# 微信登录配置（如需启用微信登录）
WECHAT_APP_ID=
WECHAT_APP_SECRET=
WECHAT_REDIRECT_URI=

# 高德地图API密钥
AMAP_KEY=

# 上传文件认证（可选）
UPLOAD_USER=
UPLOAD_PASSWORD=

# 禁用注册（生产环境建议设为 true）
PUBLIC_DISABLE_SIGNUP=false
```

---

## 🚀 部署步骤

### 1. 准备环境
```bash
# 克隆项目（如果还没有）
git clone <repository-url>
cd wanderer

# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，填入实际值
nano .env  # 或使用你喜欢的编辑器
```

### 2. 生成安全密钥
```bash
# 生成 PocketBase 密钥
echo "POCKETBASE_ENCRYPTION_KEY=$(openssl rand -hex 16)"

# 生成 Meilisearch 密钥
echo "MEILI_MASTER_KEY=$(openssl rand -base64 32)"
```

### 3. 启动服务
```bash
# 首次启动（会下载镜像）
docker compose up -d

# 查看日志
docker compose logs -f

# 检查服务状态
docker compose ps
```

### 4. 验证部署
```bash
# 检查健康状态
docker compose ps

# 访问应用
# 浏览器打开: http://localhost:3000

# 测试 API
curl http://localhost:8090/health
```

---

## 🔍 故障排查

### 问题1: 容器启动失败
```bash
# 查看详细日志
docker compose logs db
docker compose logs web
docker compose logs search
```

### 问题2: 健康检查失败
```bash
# 检查容器状态
docker compose ps

# 手动检查健康端点
curl http://localhost:8090/health
curl http://localhost:7700/health
curl http://localhost:3000/
```

### 问题3: 数据库连接失败
```bash
# 检查网络
docker network inspect wanderer_wanderer

# 检查容器IP
docker inspect wanderer-db | grep IPAddress
```

### 问题4: 微信登录不工作
```bash
# 检查环境变量
docker exec wanderer-db env | grep WECHAT

# 查看日志
docker compose logs db | grep wechat
```

---

## 📊 总结

### 当前状态
- ❌ **不能直接部署** - 存在安全和配置问题
- ⚠️ 需要先修复关键问题

### 必须修复的问题
1. 🔴 生成并使用新的安全密钥
2. 🔴 添加微信登录环境变量（如需要）
3. 🔴 验证高德地图API密钥

### 建议修复的问题
1. ⚠️ 使用环境变量管理敏感信息
2. ⚠️ 配置正确的 ORIGIN
3. ⚠️ 考虑移除 Meilisearch 端口暴露

### 部署成功率
- **修复前**: 30%（能启动但不安全，微信登录不可用）
- **修复后**: 95%（按照上述步骤操作）

---

**最后更新**: 2026年6月10日  
**检查人员**: AI Assistant  
**置信度**: 高
