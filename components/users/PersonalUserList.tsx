"use client";

import React from "react";
import { Card, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import PersonalUserTable from "./PersonalUserTable";
import PersonalUserFilters from "./PersonalUserFilters";
import { PersonalUser } from "@/hooks/users/usePersonalUsers";

interface PersonalUserListProps {
  users: PersonalUser[];
  loading: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  onSearch: (value: string) => void;
  onPageChange: (page: number, pageSize: number) => void;
  onToggleActive: (id: string, currentStatus: boolean) => void;
  onEdit: (user: PersonalUser) => void;
  onDelete: (id: string) => void;
  onFilterChange: (filters: {
    isActive?: boolean;
    isEmailVerified?: boolean;
  }) => void;
  onFilterReset: () => void;
  onCreateClick: () => void;
}

export default function PersonalUserList({
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
}: PersonalUserListProps) {
  return (
    <Card>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">个人用户管理</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={onCreateClick}>
          创建用户
        </Button>
      </div>

      <div className="mb-4">
        <PersonalUserFilters
          onFilterChange={onFilterChange}
          onReset={onFilterReset}
        />
      </div>

      <PersonalUserTable
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
