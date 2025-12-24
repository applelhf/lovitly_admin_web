import { Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Category } from "@/src/api";
import dayjs from "dayjs";

export const useCategoryColumns = (): ColumnsType<Category> => {
  return [
    {
      title: "Key",
      dataIndex: "key",
      key: "key",
      width: 150,
    },
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "排序",
      dataIndex: "order",
      key: "order",
      width: 100,
    },
    {
      title: "状态",
      dataIndex: "isActive",
      key: "isActive",
      width: 100,
      render: (isActive) => (
        <Tag color={isActive ? "success" : "default"}>
          {isActive ? "激活" : "禁用"}
        </Tag>
      ),
    },
    {
      title: "子分类数",
      dataIndex: "subcategories",
      key: "subcategories",
      width: 120,
      render: (subcategories) => subcategories?.length || 0,
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (date) => (date ? dayjs(date).format("YYYY-MM-DD HH:mm") : "-"),
    },
  ];
};
