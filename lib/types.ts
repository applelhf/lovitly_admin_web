// API 配置
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5003";

// ============================================
// Re-export swagger-generated types
// ============================================
export type {
  Voting,
  VotingItem,
  VotingStats,
  ItemStats,
  Creator,
  Category,
  Subcategory,
  VotingInput,
  VotingRules,
  VotingItemSummary,
  VotingSummary,
} from "@/src/api";

export { BonusRules } from "@/src/api";

// ============================================
// API 响应类型 (通用包装)
// ============================================
export interface ApiResponse<T = unknown> {
  success: boolean;
  code?: string;
  message?: string;
  data?: T;
}

export interface PaginatedResponse<T> {
  success: boolean;
  length?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  data: T[];
}

// ============================================
// 用户类型 (非 swagger 生成)
// ============================================
export interface User {
  _id: string;
  email: string;
  username?: string;
  role?: string;
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

// ============================================
// Voting 扩展类型 (兼容 MongoDB _id)
// 用于前端组件，处理后端返回的 _id 字段
// ============================================
export interface VotingWithId {
  _id: string;
  id?: string;
  title?: string;
  description?: string;
  category?: {
    main?: string;
    sub?: string;
  };
  tags?: string[];
  startTime?: string;
  endTime?: string;
  status?: "draft" | "active" | "closed";
  hasBonus?: boolean;
  bonusDescription?: string;
  items?: VotingItemWithId[];
  stats?: VotingStats;
  creator?: Creator;
  creatorAccountType?: string;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VotingItemWithId {
  _id?: string;
  itemId: string;
  name: string;
  description?: string;
  images: string[];
  primaryImageUrl?: string;
  specs?: Record<string, string>;
  stats?: ItemStats;
}

// 导入 swagger 类型以便在此文件使用
import type { VotingStats, ItemStats, Creator } from "@/src/api";
