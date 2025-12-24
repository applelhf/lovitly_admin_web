# Token 自动刷新功能说明

## 实现概述

已在 lovitly_admin_web 中成功实现了 token 自动刷新功能，当 access token 过期时，系统会自动使用 refresh token 获取新的 access token，无需用户重新登录。

## 核心文件

### 1. lib/axios-instance.ts

- 配置全局 axios 响应拦截器
- 检测 `AUTH_TOKEN_EXPIRED` 或 `AUTH_TOKEN_INVALID` 错误码
- 自动调用 refresh token API
- 请求队列管理，避免并发刷新
- 刷新失败时自动跳转登录页

### 2. lib/auth-api.ts

- 登录时自动保存 `admin_token` 和 `admin_refresh_token`
- 提供 `refreshToken()` 方法
- 登出时清除所有 token

### 3. lib/api-config.ts

- 配置 OpenAPI 客户端
- 初始化 axios 拦截器

### 4. components/ApiInitializer.tsx

- 应用启动时初始化 API 配置
- 设置拦截器

## 工作流程

```
1. 用户登录
   ↓
2. 保存 access token 和 refresh token
   ↓
3. API 请求带上 access token
   ↓
4. 后端返回 401 + AUTH_TOKEN_EXPIRED
   ↓
5. 自动调用 refresh token API
   ↓
6. 获取新的 access token
   ↓
7. 重试原请求
   ↓
8. 成功返回数据
```

## Token 存储

```typescript
// localStorage 中存储的 key
-admin_token - // Access Token
  admin_refresh_token - // Refresh Token
  admin_user; // 用户信息
```

## 错误处理

### Token 过期时

- 自动刷新 token
- 重试原请求
- 用户无感知

### Refresh Token 也过期时

- 清除所有 token
- 跳转到登录页
- 提示用户重新登录

### 并发请求处理

- 第一个请求触发刷新
- 其他请求进入等待队列
- 刷新成功后批量重试
- 避免重复刷新

## 测试步骤

### 1. 测试正常登录

```bash
# 登录后检查 localStorage
- admin_token: "eyJhbGc..."
- admin_refresh_token: "eyJhbGc..."
```

### 2. 测试 Token 过期

方法 1：等待 token 过期（默认 15 分钟）
方法 2：手动修改 localStorage 中的 token 为无效值
方法 3：修改后端 JWT_EXPIRE 为较短时间（如 "10s"）

### 3. 观察自动刷新

- 打开浏览器开发者工具 Network 面板
- 执行任意 API 请求（如访问用户列表）
- 应该看到：
  1. 第一个请求返回 401
  2. 自动发起 /api/v1/admin/auth/refresh 请求
  3. 原请求自动重试并成功

### 4. 验证并发请求

- 快速刷新页面或同时发起多个请求
- 只应该有一个 refresh token 请求
- 其他请求等待后自动重试

## 配置说明

### 后端配置（.env）

```env
JWT_EXPIRE=15m           # Access Token 有效期
JWT_REFRESH_EXPIRE=7d    # Refresh Token 有效期
```

### 前端配置（.env.local）

```env
NEXT_PUBLIC_API_URL=http://localhost:5003
```

## 安全考虑

1. **Refresh Token 存储**

   - 存储在 localStorage
   - 仅在客户端使用
   - 不暴露给第三方

2. **Token 轮换**

   - 每次刷新可返回新的 refresh token
   - 旧的 refresh token 失效

3. **失败处理**

   - 刷新失败立即清除所有凭证
   - 自动跳转登录页
   - 避免无限循环

4. **HTTPS**
   - 生产环境必须使用 HTTPS
   - 防止 token 被截获

## 常见问题

### Q: 为什么刷新后还是跳转登录页？

A: 可能是 refresh token 也过期了，或者后端 refresh token 配置有问题。

### Q: 并发请求会发送多个 refresh 请求吗？

A: 不会。使用了请求队列机制，只会发送一个 refresh 请求。

### Q: Refresh Token 存储在 localStorage 安全吗？

A: 对于管理后台来说可接受。如需更高安全性，可以：

- 使用 HttpOnly Cookie
- 实现更短的 refresh token 有效期
- 添加设备指纹验证

### Q: 如何测试 token 过期场景？

A: 修改后端 .env 文件：

```env
JWT_EXPIRE=10s  # 改为 10 秒
```

重启后端，10 秒后任意操作将触发自动刷新。
