import { Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Subcategory } from "@/src/api";

export const useSubcategoryColumns = (): ColumnsType<Subcategory> => {
  return [
    {
      title: "Key",
      dataIndex: "key",
      key: "key",
      width: 200,
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
      width: 200,
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
  ];
};
