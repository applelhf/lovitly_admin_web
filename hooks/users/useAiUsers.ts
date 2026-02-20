import { useState, useCallback, useEffect } from "react";
import { aiUserApi } from "@/lib/ai-user-api";
import { User, PaginatedResponse } from "@/lib/types";
import { message } from "antd";
import { getErrorMessage } from "@/lib/error-handler";

export interface AiUser extends User {
    avatar?: string;
    bio?: string;
    accountType?: string;
}

export function useAiUsers() {
    const [users, setUsers] = useState<AiUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const fetchUsers = useCallback(
        async (params?: {
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
            setLoading(true);
            try {
                const payload: Record<string, string | number | boolean | undefined> = {
                    page: params?.page || pagination.current,
                    limit: params?.limit || pagination.pageSize,
                };

                if (params?.search !== undefined) payload.search = params.search;
                if (params?.sortBy !== undefined) payload.sortBy = params.sortBy;
                if (params?.isActive !== undefined) payload.isActive = params.isActive;

                const response = (await aiUserApi.getUsers(payload)) as PaginatedResponse<AiUser>;

                if (response.success && response.data) {
                    setUsers(response.data);
                    if (response.pagination) {
                        setPagination({
                            current: response.pagination.page,
                            pageSize: response.pagination.limit,
                            total: response.pagination.total,
                        });
                    }
                } else {
                    message.error("获取 AI Employee 失败");
                }
            } catch (error: unknown) {
                const msg = getErrorMessage(error, "获取 AI Employee 失败");
                message.error(msg);
            } finally {
                setLoading(false);
            }
        },
        [pagination.current, pagination.pageSize]
        // eslint-disable-next-line react-hooks/exhaustive-deps
    );

    useEffect(() => {
        fetchUsers({ page: 1 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const createUser = async (data: {
        username: string;
        email?: string;
        password?: string;
        avatar?: string;
        bio?: string;
    }) => {
        try {
            const response = await aiUserApi.createUser(data);
            if (response.success) {
                message.success("AI Employee 创建成功");
                fetchUsers({ page: 1 });
                return true;
            }
            return false;
        } catch (error: unknown) {
            const msg = getErrorMessage(error, "创建 AI Employee 失败");
            message.error(msg);
            return false;
        }
    };

    const updateUser = async (
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
        try {
            const response = await aiUserApi.updateUser(id, data);
            if (response.success) {
                message.success("AI Employee 更新成功");
                fetchUsers({ page: pagination.current });
                return true;
            }
            return false;
        } catch (error: unknown) {
            const msg = getErrorMessage(error, "更新 AI Employee 失败");
            message.error(msg);
            return false;
        }
    };

    const deleteUser = async (id: string) => {
        try {
            const response = await aiUserApi.deleteUser(id);
            if (response.success) {
                message.success("AI Employee 删除成功");
                // 如果当前页只有一条数据，且不是第一页，则跳到上一页
                if (users.length === 1 && pagination.current > 1) {
                    fetchUsers({ page: pagination.current - 1 });
                } else {
                    fetchUsers({ page: pagination.current });
                }
                return true;
            }
            return false;
        } catch (error: unknown) {
            const msg = getErrorMessage(error, "删除 AI Employee 失败");
            message.error(msg);
            return false;
        }
    };

    const toggleUserActive = async (id: string, currentStatus: boolean) => {
        return updateUser(id, { isActive: !currentStatus });
    };

    return {
        users,
        loading,
        pagination,
        fetchUsers,
        createUser,
        updateUser,
        deleteUser,
        toggleUserActive,
    };
}
