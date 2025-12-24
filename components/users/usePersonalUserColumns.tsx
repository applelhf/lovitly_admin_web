import { Tag, Avatar, Button, Space, Popconfirm } from "antd";
import { UserOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { PersonalUser } from "@/hooks/users/usePersonalUsers";
import dayjs from "dayjs";

interface UsePersonalUserColumnsProps {
  onToggleActive: (id: string, currentStatus: boolean) => void;
  onEdit: (user: PersonalUser) => void;
  onDelete: (id: string) => void;
}

export const usePersonalUserColumns = ({
  onToggleActive,
  onEdit,
  onDelete,
}: UsePersonalUserColumnsProps): ColumnsType<PersonalUser> => {
  return [
    {
      title: "头像",
      dataIndex: "avatar",
      key: "avatar",
      width: 80,
      render: (avatar) => (
        <Avatar src={avatar} icon={<UserOutlined />} size={40} />
      ),
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
      width: 150,
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
      width: 200,
    },
    {
      title: "账户类型",
      dataIndex: "accountType",
      key: "accountType",
      width: 120,
      render: (type) => (
        <Tag color={type === "personal1" ? "blue" : "default"}>{type}</Tag>
      ),
    },
    {
      title: "激活状态",
      dataIndex: "isActive",
      key: "isActive",
      width: 100,
      render: (isActive, record) => (
        <Tag
          color={isActive ? "success" : "default"}
          style={{ cursor: "pointer" }}
          onClick={() => onToggleActive(record._id, isActive)}
        >
          {isActive ? "激活" : "禁用"}
        </Tag>
      ),
    },
    {
      title: "邮箱验证",
      dataIndex: "isEmailVerified",
      key: "isEmailVerified",
      width: 100,
      render: (verified) => (
        <Tag color={verified ? "success" : "warning"}>
          {verified ? "已验证" : "未验证"}
        </Tag>
      ),
    },
    {
      title: "注册时间",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (date) => dayjs(date).format("YYYY-MM-DD HH:mm"),
    },
    {
      title: "操作",
      key: "action",
      fixed: "right",
      width: 150,
      render: (_, record) => {
        // 只有 personal1 类型可以编辑和删除
        const canEdit = record.accountType === "personal1";

        if (!canEdit) {
          return <span style={{ color: "#999" }}>不可操作</span>;
        }

        return (
          <Space size="small">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            >
              编辑
            </Button>
            <Popconfirm
              title="确定删除此用户吗？"
              description="此操作不可恢复"
              onConfirm={() => onDelete(record._id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" size="small" danger icon={<DeleteOutlined />}>
                删除
              </Button>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
};
