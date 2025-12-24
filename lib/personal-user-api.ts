import { PersonalUsersService } from "@/src/api";

export const personalUserApi = {
  // 获取用户列表
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
    return PersonalUsersService.getApiV1AdminPersonalUsers(
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

  // 获取单个用户
  getUser: async (id: string) => {
    return PersonalUsersService.getApiV1AdminPersonalUsers1(id);
  },

  // 创建用户
  createUser: async (data: {
    username: string;
    email: string;
    password: string;
    avatar?: string;
    bio?: string;
  }) => {
    return PersonalUsersService.postApiV1AdminPersonalUsers(data);
  },

  // 更新用户
  updateUser: async (
    id: string,
    data: {
      username?: string;
      email?: string;
      password?: string;
      avatar?: string;
      bio?: string;
    }
  ) => {
    return PersonalUsersService.putApiV1AdminPersonalUsers(id, data);
  },

  // 删除用户
  deleteUser: async (id: string) => {
    return PersonalUsersService.deleteApiV1AdminPersonalUsers(id);
  },
};
