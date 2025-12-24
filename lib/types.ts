// API 配置
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";

// API 响应类型
export interface ApiResponse<T = unknown> {
  success: boolean;
  code?: string;
  message?: string;
  data?: T;
}

// 用户类型
export interface User {
  _id: string;
  email: string;
  username?: string;
  role?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 分类类型
export interface Category {
  _id: string;
  key: string;
  name: string;
  order?: number;
  isActive?: boolean;
  subcategories?: Subcategory[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Subcategory {
  _id: string;
  key: string;
  name: string;
  parentKey: string;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 管理员类型
export interface Admin {
  _id: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

// 登录请求
export interface LoginRequest {
  email: string;
  password: string;
}

// 登录响应
export interface LoginResponse {
  _id: string;
  email: string;
  role: string;
  token: string;
}
