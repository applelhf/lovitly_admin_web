"use client";

import React from "react";
import { Button, Space, Card } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import CategoryTable from "./CategoryTable";
import { Category } from "@/src/api";

interface CategoryListProps {
  categories: Category[];
  loading: boolean;
  onRefresh: () => void;
}

export default function CategoryList({
  categories,
  loading,
  onRefresh,
}: CategoryListProps) {
  return (
    <Card>
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">分类管理</h1>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={onRefresh}>
            刷新
          </Button>
        </Space>
      </div>

      <CategoryTable categories={categories} loading={loading} />
    </Card>
  );
}
