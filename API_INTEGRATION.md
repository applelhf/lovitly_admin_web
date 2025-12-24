# Lovitly Admin Web - API 集成文档

## 概览

本项目使用 **OpenAPI/Swagger 自动生成客户端代码**的方式来调用后端 API，无需手写 API 调用代码。

## API 配置

### 环境变量

在 `.env.local` 文件中配置后端 API 地址：

```env
NEXT_PUBLIC_API_URL=http://localhost:5003
```

### 自动生成 API 客户端

1. **确保后端服务正在运行**

   ```bash
   cd backend/lovitly_admin_backend
   npm run dev
   ```

2. **生成 API 客户端代码**

   ```bash
   pnpm run generate-api
   ```

   这将从后端的 Swagger/OpenAPI 规范自动生成 TypeScript 客户端代码到 `src/api/` 目录。

### 生成的目录结构

```
src/api/
├── core/           # 核心请求处理
│   ├── OpenAPI.ts  # API 配置
│   ├── request.ts  # 请求处理器
│   └── ...
├── models/         # 类型定义
│   ├── Category.ts
│   └── ...
├── services/       # API 服务
│   ├── AdminAuthService.ts
│   ├── CategoriesService.ts
│   └── ...
└── index.ts        # 导出入口
```

## 使用方式

### 1. API 配置

在 `lib/api-config.ts` 中配置 API 客户端：

```typescript
import { OpenAPI } from "@/src/api";

export function configureApiClient() {
  OpenAPI.BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";

  // 自动添加 Token
  OpenAPI.TOKEN = async () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("admin_token") || "";
    }
    return "";
  };
}
```

### 2. 封装 API 调用

在 `lib/*-api.ts` 文件中封装具体的 API 调用：

```typescript
import { AdminAuthService } from "@/src/api";
import "@/lib/api-config";

export const authApi = {
  login: async (data: { email: string; password: string }) => {
    return AdminAuthService.postApiV1AdminAuthLogin(data);
  },

  getMe: async () => {
    return AdminAuthService.getApiV1AdminAuthMe();
  },
};
```

### 3. 在组件中使用

```typescript
import { authApi } from "@/lib/auth-api";

// 登录
const response = await authApi.login({ email, password });
if (response?.data?.token) {
  localStorage.setItem("admin_token", response.data.token);
}
```

## API 服务列表

### 已集成的服务

- ✅ **AdminAuthService** - 管理员认证

  - `postApiV1AdminAuthLogin()` - 登录
  - `getApiV1AdminAuthMe()` - 获取当前用户
  - `putApiV1AdminAuthUpdateProfile()` - 更新资料

- ✅ **CategoriesService** - 分类管理
  - `getApiV1AdminCategories()` - 获取所有分类
  - `postApiV1AdminCategories()` - 创建分类
  - `putApiV1AdminCategories()` - 更新分类
  - `deleteApiV1AdminCategories()` - 删除分类
  - `postApiV1AdminCategoriesImport()` - 批量导入
  - `deleteApiV1AdminCategoriesAll()` - 删除所有

### 待集成的服务

- ⏳ **UserService** - 用户管理（等待后端添加 Swagger 定义）

## 类型安全

所有 API 调用都是**完全类型安全**的：

```typescript
import { Category } from "@/src/api";

// 类型会自动推断
const categories: Category[] = await categoryApi.getCategories(true);

// 参数类型检查
await categoryApi.createCategory({
  key: "food", // ✅
  name: "食品", // ✅
  order: 1, // ✅
  invalid: "test", // ❌ TypeScript 错误
});
```

## 更新 API

当后端 API 发生变化时：

1. **重新生成客户端代码**

   ```bash
   pnpm run generate-api
   ```

2. **检查类型错误**

   ```bash
   pnpm run lint
   ```

3. **更新相应的封装代码**（如果方法签名变化）

## 优势

✅ **自动生成** - 无需手写 API 代码
✅ **类型安全** - 完整的 TypeScript 类型定义
✅ **自动同步** - API 变更时重新生成即可
✅ **减少错误** - 避免手写 URL 和参数错误
✅ **文档一致** - 代码与 API 文档保持同步

## 故障排查

### 生成失败

```bash
❌ 错误: ECONNREFUSED

💡 请确保后端服务正在运行在 http://localhost:5003
   运行命令: cd backend/lovitly_admin_backend && npm run dev
```

### API 调用 401 错误

检查 Token 是否正确设置：

```typescript
// 在浏览器控制台
localStorage.getItem("admin_token");
```

### 类型不匹配

重新生成 API 客户端代码：

```bash
pnpm run generate-api
```
