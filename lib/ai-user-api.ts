import { AiUsersService } from "@/src/api";

export const aiUserApi = {
    // 获取用户列表
    getUsers: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        sortBy?:
        | "username_asc"
        | "username_desc"
        | "createdAt_asc"
        | "createdAt_desc"
        | "updatedAt_asc"
        | "updatedAt_desc";
        isActive?: boolean;
    }) => {
        return AiUsersService.getApiV1AdminAiUsers(
            params?.page,
            params?.limit,
            params?.search,
            params?.sortBy,
            params?.isActive
        );
    },

    // 获取单个用户
    getUser: async (id: string) => {
        return AiUsersService.getApiV1AdminAiUsers1(id);
    },

    // 创建用户
    createUser: async (data: {
        username: string;
        email?: string;
        password?: string;
        avatar?: string;
        bio?: string;
    }) => {
        return AiUsersService.postApiV1AdminAiUsers(data);
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
            isActive?: boolean;
        }
    ) => {
        return AiUsersService.putApiV1AdminAiUsers(id, data);
    },

    // 删除用户
    deleteUser: async (id: string) => {
        return AiUsersService.deleteApiV1AdminAiUsers(id);
    },
};
