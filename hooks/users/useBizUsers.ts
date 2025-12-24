"use client";

import { useState, useEffect } from "react";
import { message } from "antd";
import { bizUserApi } from "@/lib/biz-user-api";
import { getErrorMessage } from "@/lib/error-handler";

export interface BizUser {
  _id: string;
  username: string;
  email: string;
  accountType: string;
  companyName: string;
  businessLicense?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BizUsersResponse {
  users: BizUser[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalUsers: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export const useBizUsers = () => {
  const [users, setUsers] = useState<BizUser[]>([]);
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
      const response = await bizUserApi.getUsers({
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
            data?: BizUser[];
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
      const errorMessage = getErrorMessage(error, "获取商家用户列表失败");
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserActive = async (id: string, currentStatus: boolean) => {
    try {
      await bizUserApi.updateUser(id, { isActive: !currentStatus } as never);
      message.success("商家用户状态已更新");
      fetchUsers();
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, "更新商家用户状态失败");
      message.error(errorMessage);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      await bizUserApi.deleteUser(id);
      message.success("商家用户已删除");
      fetchUsers();
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, "删除商家用户失败");
      message.error(errorMessage);
    }
  };

  const createUser = async (data: {
    username: string;
    email: string;
    password: string;
    companyName: string;
    businessLicense?: string;
    avatar?: string;
    bio?: string;
  }) => {
    try {
      await bizUserApi.createUser(data);
      message.success("商家用户创建成功");
      fetchUsers();
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, "创建商家用户失败");
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
      companyName?: string;
      businessLicense?: string;
      avatar?: string;
      bio?: string;
    }
  ) => {
    try {
      await bizUserApi.updateUser(id, data);
      message.success("商家用户更新成功");
      fetchUsers();
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, "更新商家用户失败");
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
