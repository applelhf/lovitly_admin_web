import { Tag, Avatar, Button, Space, Popconfirm } from "antd";
import { ShopOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { BizUser } from "@/hooks/users/useBizUsers";
import dayjs from "dayjs";

interface UseBizUserColumnsProps {
  onToggleActive: (id: string, currentStatus: boolean) => void;
  onEdit: (user: BizUser) => void;
  onDelete: (id: string) => void;
}

export const useBizUserColumns = ({
  onToggleActive,
  onEdit,
  onDelete,
}: UseBizUserColumnsProps): ColumnsType<BizUser> => {
  return [
    {
      title: "头像",
      dataIndex: "avatar",
      key: "avatar",
      width: 80,
      render: (avatar) => (
        <Avatar src={avatar} icon={<ShopOutlined />} size={40} />
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
      title: "公司名称",
      dataIndex: "companyName",
      key: "companyName",
      width: 150,
    },
    {
      title: "营业执照",
      dataIndex: "businessLicense",
      key: "businessLicense",
      width: 120,
      render: (license) =>
        license ? (
          <Tag color="green">已上传</Tag>
        ) : (
          <Tag color="default">未上传</Tag>
        ),
    },
    {
      title: "账户类型",
      dataIndex: "accountType",
      key: "accountType",
      width: 120,
      render: (type) => (
        <Tag color={type === "biz1" ? "purple" : "default"}>{type}</Tag>
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
      dataIndex: "isVerified",
      key: "isVerified",
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
        // 只有 biz1 类型可以编辑和删除
        const canEdit = record.accountType === "biz1";

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
              title="确定删除此商家用户吗？"
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
