import React, { useState, useEffect, useCallback } from "react";
import { Table, Input, Segmented, Avatar, Tag, Space } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { PersonalUsersService } from "@/src/api/services/PersonalUsersService";
import { BizUsersService } from "@/src/api/services/BizUsersService";
import { AdminVotingService } from "@/src/api/services/AdminVotingService";
import type { ColumnsType } from "antd/es/table";

interface UserBatchSelectorProps {
    value?: string[];
    onChange?: (selectedKeys: string[]) => void;
    selectionType?: "checkbox" | "radio";
    votingId?: string; // Optional: if provided, check love status
    currentItemId?: string; // The item currently being operated on
    filterMode?: "love" | "comment"; // Logic mode
}

interface UserData {
    key: string;
    id: string;
    username: string;
    email: string;
    avatar: string;
    accountType: string;
    didLoved?: boolean;
    didLovedItemId?: string | null;
}

export default function UserBatchSelector({
    value = [],
    onChange,
    selectionType = "checkbox",
    votingId,
    currentItemId,
    filterMode = "love",
}: UserBatchSelectorProps) {
    const [userType, setUserType] = useState<"personal" | "biz">("personal");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<UserData[]>([]);

    // Pagination state
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            let res;
            if (userType === "personal") {
                res = await PersonalUsersService.getApiV1AdminPersonalUsers(
                    pagination.current,
                    pagination.pageSize,
                    search
                );
            } else {
                res = await BizUsersService.getApiV1AdminBizUsers(
                    pagination.current,
                    pagination.pageSize,
                    search
                );
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const rawList = (res as any)?.data || [];
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const meta = (res as any)?.meta?.pagination;

            // 1. Initial Parse
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let parsedData: UserData[] = rawList.map((u: any) => ({
                key: u._id || u.id,
                id: u._id || u.id,
                username: u.username,
                email: u.email,
                avatar: u.avatar,
                accountType: u.accountType,
                didLoved: false,
            }));

            // 2. Check Love Status if votingId is provided
            if (votingId && parsedData.length > 0) {
                const userIds = parsedData.map((u) => u.id);
                try {
                    const statusRes =
                        await AdminVotingService.postApiV1AdminVotingsBatchGetUsersLovedStatus({
                            votingId,
                            userIds,
                        });

                    if (statusRes.data) {
                        const statusMap = new Map(
                            statusRes.data.map((item) => [item.userId, {
                                didLoved: item.didLoved,
                                didLovedItemId: item.didLovedItemId
                            }])
                        );
                        parsedData = parsedData.map((u) => {
                            const status = statusMap.get(u.id);
                            return {
                                ...u,
                                didLoved: status?.didLoved || false,
                                didLovedItemId: status?.didLovedItemId || null,
                            };
                        });
                    }
                } catch (err) {
                    console.error("Failed to check love status:", err);
                }
            }

            setData(parsedData);
            if (meta) {
                setPagination((prev) => ({
                    ...prev,
                    total: meta.total,
                }));
            }
        } catch (error) {
            console.error("Failed to fetch users:", error);
        } finally {
            setLoading(false);
        }
    }, [userType, search, pagination.current, pagination.pageSize, votingId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleTableChange = (newPagination: any) => {
        setPagination((prev) => ({
            ...prev,
            current: newPagination.current,
            pageSize: newPagination.pageSize,
        }));
    };

    const handleSearch = (val: string) => {
        setSearch(val);
        setPagination((prev) => ({ ...prev, current: 1 })); // Reset to page 1
    };

    const columns: ColumnsType<UserData> = [
        {
            title: "用户",
            dataIndex: "username",
            render: (_: any, record: UserData) => (
                <Space>
                    <Avatar src={record.avatar} icon={<UserOutlined />} />
                    <span>{record.username}</span>
                    {record.didLoved && (
                        <>
                            {filterMode === 'love' ? (
                                <Tag color="orange">已投票</Tag>
                            ) : (
                                // For comment mode, distinguish between current item and others
                                record.didLovedItemId === currentItemId ? (
                                    <Tag color="green">已投此项</Tag>
                                ) : (
                                    <Tag color="red">已投他项</Tag>
                                )
                            )}
                        </>
                    )}
                </Space>
            ),
        },
        {
            title: "邮箱",
            dataIndex: "email",
        },
        {
            title: "类型",
            dataIndex: "accountType",
            render: (text: string) => <Tag>{text}</Tag>,
        },
    ];

    const rowSelection = {
        type: selectionType,
        selectedRowKeys: value,
        onChange: (selectedRowKeys: React.Key[]) => {
            if (onChange) {
                onChange(selectedRowKeys as string[]);
            }
        },
        preserveSelectedRowKeys: true,
        getCheckboxProps: (record: UserData) => {
            let disabled = false;
            if (filterMode === 'love') {
                // Love Mode: Disable if already voted (any item)
                disabled = !!record.didLoved;
            } else if (filterMode === 'comment') {
                // Comment Mode: 
                // Enable if NOT loved (new vote) OR loved THIS item (add comment)
                // Disable if loved ANOTHER item
                if (record.didLoved && record.didLovedItemId !== currentItemId) {
                    disabled = true;
                }
            }
            return {
                disabled,
                name: record.username,
            };
        },
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <Segmented
                    options={[
                        { label: "个人用户", value: "personal" },
                        { label: "企业用户", value: "biz" },
                    ]}
                    value={userType}
                    onChange={(val) => {
                        setUserType(val as "personal" | "biz");
                        setPagination((prev) => ({ ...prev, current: 1 }));
                        setSearch("");
                    }}
                />

                <Input.Search
                    placeholder="搜索用户名或邮箱"
                    allowClear
                    onSearch={handleSearch}
                    style={{ width: 300 }}
                />
            </div>

            <Table
                columns={columns}
                dataSource={data}
                rowSelection={rowSelection}
                loading={loading}
                pagination={{
                    ...pagination,
                    showTotal: (total) => `共 ${total} 条`,
                }}
                onChange={handleTableChange}
                rowKey="id"
                size="small"
                scroll={{ y: 400 }}
            />

            <div className="text-right text-gray-500">
                已选择 {value.length} 个用户
            </div>
        </div>
    );
}
