import { BizUsersService } from "@/src/api";

export const bizUserApi = {
  // 获取商家用户列表
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    accountType?: "personal" | "personal1" | "biz" | "biz1" | "admin";
    email?: string;
    sortBy?:
      | "username_asc"
      | "username_desc"
      | "email_asc"
      | "email_desc"
      | "createdAt_asc"
      | "createdAt_desc"
      | "updatedAt_asc"
      | "updatedAt_desc";
    isActive?: boolean;
    isEmailVerified?: boolean;
  }) => {
    return BizUsersService.getApiV1AdminBizUsers(
      params?.page,
      params?.limit,
      params?.search,
      params?.accountType,
      params?.email,
      params?.sortBy,
      params?.isActive,
      params?.isEmailVerified
    );
  },

  // 获取单个商家用户
  getUser: async (id: string) => {
    return BizUsersService.getApiV1AdminBizUsers1(id);
  },

  // 创建商家用户
  createUser: async (data: {
    username: string;
    email: string;
    password: string;
    companyName: string;
    businessLicense?: string;
    avatar?: string;
    bio?: string;
  }) => {
    return BizUsersService.postApiV1AdminBizUsers(data);
  },

  // 更新商家用户
  updateUser: async (
    id: string,
    data: {
      username?: string;
      email?: string;
      password?: string;
      companyName?: string;
      businessLicense?: string;
      avatar?: string;
      bio?: string;
    }
  ) => {
    return BizUsersService.putApiV1AdminBizUsers(id, data);
  },

  // 删除商家用户
  deleteUser: async (id: string) => {
    return BizUsersService.deleteApiV1AdminBizUsers(id);
  },
};
