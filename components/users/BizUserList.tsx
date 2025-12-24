"use client";

import React from "react";
import { Card, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import BizUserTable from "./BizUserTable";
import BizUserFilters from "./BizUserFilters";
import { BizUser } from "@/hooks/users/useBizUsers";

interface BizUserListProps {
  users: BizUser[];
  loading: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  onSearch: (value: string) => void;
  onPageChange: (page: number, pageSize: number) => void;
  onToggleActive: (id: string, currentStatus: boolean) => void;
  onEdit: (user: BizUser) => void;
  onDelete: (id: string) => void;
  onFilterChange: (filters: {
    isActive?: boolean;
    isEmailVerified?: boolean;
  }) => void;
  onFilterReset: () => void;
  onCreateClick: () => void;
}

export default function BizUserList({
  users,
  loading,
  pagination,
  onSearch,
  onPageChange,
  onToggleActive,
  onEdit,
  onDelete,
  onFilterChange,
  onFilterReset,
  onCreateClick,
}: BizUserListProps) {
  return (
    <Card>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">商家用户管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreateClick}>
          创建商家用户
        </Button>
      </div>

      <div className="mb-4">
        <BizUserFilters
          onFilterChange={onFilterChange}
          onReset={onFilterReset}
        />
      </div>

      <BizUserTable
        users={users}
        loading={loading}
        pagination={pagination}
        onSearch={onSearch}
        onPageChange={onPageChange}
        onToggleActive={onToggleActive}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </Card>
  );
}
