"use client";

import { useState, useEffect } from "react";
import { message } from "antd";
import { personalUserApi } from "@/lib/personal-user-api";
import { getErrorMessage } from "@/lib/error-handler";

export interface PersonalUser {
  _id: string;
  username: string;
  email: string;
  accountType: string;
  isActive: boolean;
  isEmailVerified: boolean;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalUsersResponse {
  users: PersonalUser[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const usePersonalUsers = () => {
  const [users, setUsers] = useState<PersonalUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const fetchUsers = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    isActive?: boolean;
    isEmailVerified?: boolean;
  }) => {
    setLoading(true);
    try {
      const response = await personalUserApi.getUsers({
        page: params?.page || pagination.current,
        limit: params?.limit || pagination.pageSize,
        search: params?.search,
        isActive: params?.isActive,
        isEmailVerified: params?.isEmailVerified,
        sortBy: "createdAt_desc",
      });

      if (response && typeof response === "object" && "data" in response) {
        const dataArray = (
          response as {
            data?: PersonalUser[];
            meta?: {
              pagination: { page: number; limit: number; total: number };
            };
          }
        ).data;
        const meta = (
          response as {
            meta?: {
              pagination: { page: number; limit: number; total: number };
            };
          }
        ).meta;

        if (Array.isArray(dataArray)) {
          setUsers(dataArray);
          if (meta?.pagination) {
            setPagination({
              current: meta.pagination.page,
              pageSize: meta.pagination.limit,
              total: meta.pagination.total,
            });
          }
        }
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, "获取用户列表失败");
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserActive = async (id: string, currentStatus: boolean) => {
    try {
      await personalUserApi.updateUser(id, {
        isActive: !currentStatus,
      } as never);
      message.success("用户状态已更新");
      fetchUsers();
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, "更新用户状态失败");
      message.error(errorMessage);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await personalUserApi.deleteUser(id);
      message.success("用户已删除");
      fetchUsers();
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, "删除用户失败");
      message.error(errorMessage);
    }
  };

  const createUser = async (data: {
    username: string;
    email: string;
    password: string;
    avatar?: string;
    bio?: string;
  }) => {
    try {
      await personalUserApi.createUser(data);
      message.success("用户创建成功");
      fetchUsers();
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, "创建用户失败");
      message.error(errorMessage);
      throw error;
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
    }
  ) => {
    try {
      await personalUserApi.updateUser(id, data);
      message.success("用户更新成功");
      fetchUsers();
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, "更新用户失败");
      message.error(errorMessage);
      throw error;
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    users,
    loading,
    pagination,
    fetchUsers,
    toggleUserActive,
    deleteUser,
    createUser,
    updateUser,
  };
};
