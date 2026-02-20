import React from "react";
import {
    Table,
    Button,
    Space,
    Input,
    Switch,
    Tag,
    Avatar,
    Typography,
} from "antd";
import {
    PlusOutlined,
    SearchOutlined,
    EditOutlined,
    DeleteOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { AiUser } from "@/hooks/users/useAiUsers";
import dayjs from "dayjs";
import type { TablePaginationConfig } from "antd";
import type { FilterValue, SorterResult } from "antd/es/table/interface";

const { Text } = Typography;

interface AiUserListProps {
    users: AiUser[];
    loading: boolean;
    pagination: {
        current: number;
        pageSize: number;
        total: number;
    };
    onSearch: (value: string) => void;
    onPageChange: (page: number, pageSize: number) => void;
    onToggleActive: (id: string, currentStatus: boolean) => void;
    onEdit: (user: AiUser) => void;
    onDelete: (id: string) => void;
    onFilterChange: (filters: { isActive?: boolean }) => void;
    onFilterReset: () => void;
    onCreateClick: () => void;
}

export default function AiUserList({
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
}: AiUserListProps) {
    const columns = [
        {
            title: "用户名",
            dataIndex: "username",
            key: "username",
            render: (text: string, record: AiUser) => (
                <Space>
                    <Avatar src={record.avatar} icon={<UserOutlined />} />
                    <Text strong>{text}</Text>
                </Space>
            ),
        },
        {
            title: "邮箱",
            dataIndex: "email",
            key: "email",
            render: (text: string) => text || <Text type="secondary">-</Text>,
        },
        {
            title: "简介",
            dataIndex: "bio",
            key: "bio",
            ellipsis: true,
            width: 200,
            render: (text: string) => text || <Text type="secondary">-</Text>,
        },
        {
            title: "状态",
            dataIndex: "isActive",
            key: "isActive",
            render: (isActive: boolean, record: AiUser) => (
                <Switch
                    checked={isActive}
                    onChange={() => onToggleActive(record._id, isActive)}
                    checkedChildren="启用"
                    unCheckedChildren="禁用"
                />
            ),
            filters: [
                { text: "启用", value: true },
                { text: "禁用", value: false },
            ],
            filterMultiple: false,
        },
        {
            title: "创建时间",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (date: string) => dayjs(date).format("YYYY-MM-DD HH:mm:ss"),
        },
        {
            title: "操作",
            key: "action",
            render: (_: unknown, record: AiUser) => (
                <Space size="small">
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(record)}
                    />
                    <Button
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {
                            if (window.confirm("确定要删除此 AI Employee 吗？删除后将无法恢复。")) {
                                onDelete(record._id);
                            }
                        }}
                    />
                </Space>
            ),
        },
    ];

    const handleTableChange = (
        paginationObj: TablePaginationConfig,
        filters: Record<string, FilterValue | null>,
        _sorter: SorterResult<AiUser> | SorterResult<AiUser>[]
    ) => {
        // 处理分页
        if (
            paginationObj.current !== pagination.current ||
            paginationObj.pageSize !== pagination.pageSize
        ) {
            onPageChange(paginationObj.current as number, paginationObj.pageSize as number);
        }

        // 处理状态过滤
        if (filters.isActive) {
            const isActiveValue =
                filters.isActive.length > 0 ? filters.isActive[0] : undefined;

            // 当清除过滤条件时，值为 undefined
            if (isActiveValue === undefined) {
                onFilterReset();
                return;
            }

            onFilterChange({
                isActive: isActiveValue as boolean,
            });
        } else {
            onFilterReset();
        }
    };

    return (
        <div>
            <div
                style={{
                    marginBottom: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Space>
                    <Input.Search
                        placeholder="搜索用户名"
                        allowClear
                        onSearch={onSearch}
                        style={{ width: 250 }}
                        enterButton={<SearchOutlined />}
                    />
                </Space>
                <Space>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={onCreateClick}
                    >
                        添加 AI Employee
                    </Button>
                </Space>
            </div>

            <Table
                columns={columns}
                dataSource={users}
                rowKey="_id"
                loading={loading}
                pagination={{
                    ...pagination,
                    showSizeChanger: true,
                    showTotal: (total: number) => `共 ${total} 条数据`,
                }}
                onChange={handleTableChange}
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
}
