"use client";

import React from "react";
import { Table, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { PersonalUser } from "@/hooks/users/usePersonalUsers";
import { usePersonalUserColumns } from "./usePersonalUserColumns";

const { Search } = Input;

interface PersonalUserTableProps {
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
}

export default function PersonalUserTable({
  users,
  loading,
  pagination,
  onSearch,
  onPageChange,
  onToggleActive,
  onEdit,
  onDelete,
}: PersonalUserTableProps) {
  const columns = usePersonalUserColumns({ onToggleActive, onEdit, onDelete });

  return (
    <>
      <div className="mb-4">
        <Search
          placeholder="搜索用户名或邮箱"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={onSearch}
          style={{ maxWidth: 400 }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 个用户`,
          onChange: onPageChange,
        }}
        scroll={{ x: 1200 }}
      />
    </>
  );
}
