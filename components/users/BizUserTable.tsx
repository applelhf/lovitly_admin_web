"use client";

import React from "react";
import { Table, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { BizUser } from "@/hooks/users/useBizUsers";
import { useBizUserColumns } from "./useBizUserColumns";

const { Search } = Input;

interface BizUserTableProps {
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
}

export default function BizUserTable({
  users,
  loading,
  pagination,
  onSearch,
  onPageChange,
  onToggleActive,
  onEdit,
  onDelete,
}: BizUserTableProps) {
  const columns = useBizUserColumns({ onToggleActive, onEdit, onDelete });

  return (
    <>
      <div className="mb-4">
        <Search
          placeholder="搜索用户名、邮箱或公司名称"
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
          showTotal: (total) => `共 ${total} 个商家用户`,
          onChange: onPageChange,
        }}
        scroll={{ x: 1400 }}
      />
    </>
  );
}
