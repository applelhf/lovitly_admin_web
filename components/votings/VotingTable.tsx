"use client";

import React from "react";
import { Table, Button, Space, Image, Tag, Tooltip } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { VotingWithId } from "@/lib/types";
import dayjs from "dayjs";

interface VotingTableProps {
    votings: VotingWithId[];
    loading: boolean;
    pagination: {
        current: number;
        pageSize: number;
        total: number;
    };
    onPageChange: (page: number, pageSize: number) => void;
    onView: (voting: VotingWithId) => void;
    onEdit: (voting: VotingWithId) => void;
    onDelete: (id: string) => void;
}

export default function VotingTable({
    votings,
    loading,
    pagination,
    onPageChange,
    onView,
    onEdit,
    onDelete,
}: VotingTableProps) {
    const formatTime = (startTime?: string, endTime?: string) => {
        if (!startTime && !endTime) {
            return <Tag color="blue">无限期</Tag>;
        }
        const start = startTime ? dayjs(startTime).format("YYYY-MM-DD") : "—";
        const end = endTime ? dayjs(endTime).format("YYYY-MM-DD") : "无限期";
        return `${start} ~ ${end}`;
    };

    const getStatusTag = (status: string) => {
        const statusMap: Record<string, { color: string; text: string }> = {
            active: { color: "green", text: "进行中" },
            closed: { color: "red", text: "已结束" },
            draft: { color: "gray", text: "草稿" },
        };
        const s = statusMap[status] || { color: "default", text: status };
        return <Tag color={s.color}>{s.text}</Tag>;
    };

    const columns: ColumnsType<VotingWithId> = [
        {
            title: "投票项目",
            key: "items",
            width: 200,
            render: (_, record) => (
                <div style={{ display: "flex", gap: 4 }}>
                    {(record.items || []).slice(0, 4).map((item, index) => (
                        <Image
                            key={item.itemId || index}
                            src={item.primaryImageUrl || item.images?.[0] || "/placeholder.png"}
                            alt={item.name}
                            width={40}
                            height={40}
                            style={{ objectFit: "cover", borderRadius: 4 }}
                            fallback="/placeholder.png"
                            preview={false}
                        />
                    ))}
                    {(record.items?.length || 0) > 4 && (
                        <div
                            style={{
                                width: 40,
                                height: 40,
                                background: "#f0f0f0",
                                borderRadius: 4,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 12,
                                color: "#666",
                            }}
                        >
                            +{(record.items?.length || 0) - 4}
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: "标题",
            dataIndex: "title",
            key: "title",
            width: 200,
            ellipsis: true,
            render: (text) => (
                <Tooltip title={text}>
                    <span style={{ fontWeight: 500 }}>{text}</span>
                </Tooltip>
            ),
        },
        {
            title: "状态",
            dataIndex: "status",
            key: "status",
            width: 100,
            render: (status) => getStatusTag(status),
        },
        {
            title: "时间",
            key: "time",
            width: 180,
            render: (_, record) => formatTime(record.startTime, record.endTime),
        },
        {
            title: "投票数",
            key: "votes",
            width: 80,
            render: (_, record) => (
                <span style={{ color: "#ff4d4f" }}>{record.stats?.totalVotes ?? 0}</span>
            ),
        },
        {
            title: "评论数",
            key: "comments",
            width: 80,
            render: (_, record) => (
                <span style={{ color: "#52c41a" }}>{record.stats?.totalComments ?? 0}</span>
            ),
        },
        {
            title: "收藏数",
            key: "saves",
            width: 80,
            render: (_, record) => (
                <span style={{ color: "#1890ff" }}>{record.stats?.saves ?? 0}</span>
            ),
        },
        {
            title: "操作",
            key: "actions",
            width: 150,
            fixed: "right",
            render: (_, record) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EyeOutlined />}
                        onClick={() => onView(record)}
                    >
                        查看
                    </Button>
                    <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => onEdit(record)}
                    >
                        编辑
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Table
            columns={columns}
            dataSource={votings}
            loading={loading}
            rowKey="_id"
            scroll={{ x: 1100 }}
            pagination={{
                current: pagination.current,
                pageSize: pagination.pageSize,
                total: pagination.total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条`,
                onChange: onPageChange,
            }}
        />
    );
}
