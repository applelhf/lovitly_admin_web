"use client";

import React from "react";
import { Table } from "antd";
import { Category } from "@/src/api";
import { useCategoryColumns } from "./useCategoryColumns";
import { useSubcategoryColumns } from "./useSubcategoryColumns";

interface CategoryTableProps {
  categories: Category[];
  loading: boolean;
}

export default function CategoryTable({
  categories,
  loading,
}: CategoryTableProps) {
  const columns = useCategoryColumns();
  const subColumns = useSubcategoryColumns();

  return (
    <Table
      columns={columns}
      dataSource={categories}
      rowKey="key"
      loading={loading}
      expandable={{
        expandedRowRender: (record) => {
          if (!record.subcategories || record.subcategories.length === 0) {
            return (
              <p style={{ margin: 0, padding: "12px 24px", color: "#999" }}>
                暂无子分类
              </p>
            );
          }
          return (
            <Table
              columns={subColumns}
              dataSource={record.subcategories}
              rowKey="key"
              pagination={false}
              size="small"
            />
          );
        },
        rowExpandable: () => true,
      }}
      pagination={{
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`,
      }}
      scroll={{ x: 1000 }}
    />
  );
}
