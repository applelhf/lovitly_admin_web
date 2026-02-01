"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
    List,
    Avatar,
    Spin,
    Pagination,
    Select,
    Space,
    Empty,
    Button,
} from "antd";
import {
    UserOutlined,
    LikeOutlined,
    ReloadOutlined,
} from "@ant-design/icons";
import { votingApi } from "@/lib/voting-api";
import dayjs from "dayjs";

// Comment type
interface Comment {
    _id: string;
    votingId: string;
    itemId: string;
    userId: string;
    content: string;
    likes: number;
    likedBy: string[];
    createdAt: string;
    user?: {
        _id: string;
        userName: string;
        avatar?: string;
    };
}

interface ItemCommentListProps {
    votingId: string;
    itemId: string;
    pageSize?: number;
    onBatchLike?: (commentId: string) => void;
}

type SortOption = "newest" | "oldest" | "mostLikes";

export default function ItemCommentList({
    votingId,
    itemId,
    pageSize = 10,
    onBatchLike,
}: ItemCommentListProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [sortBy, setSortBy] = useState<SortOption>("newest");

    const fetchComments = useCallback(async () => {
        setLoading(true);
        try {
            const response = await votingApi.getComments(
                votingId,
                itemId,
                page,
                pageSize
            );
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const data = (response as any)?.data || response;
            let commentList: Comment[] = Array.isArray(data) ? data : data?.data || [];

            // Client-side sorting (API may not support sorting)
            commentList = sortComments(commentList, sortBy);

            setComments(commentList);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setTotal((response as any)?.pagination?.total || commentList.length);
            setLoaded(true);
        } catch (error) {
            console.error("Failed to fetch comments:", error);
            setComments([]);
        } finally {
            setLoading(false);
        }
    }, [votingId, itemId, page, pageSize, sortBy]);

    const sortComments = (list: Comment[], sort: SortOption): Comment[] => {
        const sorted = [...list];
        switch (sort) {
            case "newest":
                return sorted.sort(
                    (a, b) =>
                        new Date(b.createdAt).getTime() -
                        new Date(a.createdAt).getTime()
                );
            case "oldest":
                return sorted.sort(
                    (a, b) =>
                        new Date(a.createdAt).getTime() -
                        new Date(b.createdAt).getTime()
                );
            case "mostLikes":
                return sorted.sort((a, b) => b.likes - a.likes);
            default:
                return sorted;
        }
    };

    // Fetch on first load
    useEffect(() => {
        if (!loaded) {
            fetchComments();
        }
    }, [loaded, fetchComments]);

    // Re-fetch when page or sort changes
    useEffect(() => {
        if (loaded) {
            fetchComments();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, sortBy]);

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleSortChange = (value: SortOption) => {
        setSortBy(value);
        setPage(1); // Reset to first page when sorting changes
    };

    const handleRefresh = () => {
        fetchComments();
    };

    if (loading && !loaded) {
        return (
            <div className="text-center py-4">
                <Spin size="small" />
            </div>
        );
    }

    if (comments.length === 0 && loaded) {
        return <Empty description="暂无评论" image={Empty.PRESENTED_IMAGE_SIMPLE} />;
    }

    return (
        <div>
            {/* Sort and Refresh controls */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 12,
                }}
            >
                <Space>
                    <span style={{ fontSize: 12, color: "#666" }}>排序:</span>
                    <Select
                        size="small"
                        value={sortBy}
                        onChange={handleSortChange}
                        style={{ width: 100 }}
                        options={[
                            { value: "newest", label: "最新" },
                            { value: "oldest", label: "最早" },
                            { value: "mostLikes", label: "最多赞" },
                        ]}
                    />
                </Space>
                <Button
                    size="small"
                    icon={<ReloadOutlined />}
                    onClick={handleRefresh}
                    loading={loading}
                >
                    刷新
                </Button>
            </div>

            {/* Comments List */}
            <List
                size="small"
                loading={loading}
                dataSource={comments}
                renderItem={(comment) => (
                    <List.Item style={{ padding: "8px 0" }}>
                        <List.Item.Meta
                            avatar={
                                <Avatar
                                    size="small"
                                    src={comment.user?.avatar}
                                    icon={<UserOutlined />}
                                />
                            }
                            title={
                                <div style={{ fontSize: 13 }}>
                                    <span style={{ fontWeight: 500 }}>
                                        {comment.user?.userName || "匿名用户"}
                                    </span>
                                    <span
                                        style={{
                                            color: "#999",
                                            fontSize: 11,
                                            marginLeft: 8,
                                        }}
                                    >
                                        {dayjs(comment.createdAt).format("MM-DD HH:mm")}
                                    </span>
                                </div>
                            }
                            description={
                                <div style={{ fontSize: 13 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <p style={{ margin: 0 }}>{comment.content}</p>
                                        <Button
                                            size="small"
                                            type="default"
                                            onClick={() => onBatchLike && onBatchLike(comment._id)}
                                        >
                                            批量点赞
                                        </Button>
                                    </div>
                                    <span style={{ color: "#999", fontSize: 11 }}>
                                        <LikeOutlined /> {comment.likes}
                                    </span>
                                </div>
                            }
                        />
                    </List.Item>
                )
                }
            />

            {/* Pagination */}
            {
                total > pageSize && (
                    <div style={{ textAlign: "center", marginTop: 12 }}>
                        <Pagination
                            size="small"
                            current={page}
                            total={total}
                            pageSize={pageSize}
                            onChange={handlePageChange}
                            showSizeChanger={false}
                            showTotal={(t) => `共 ${t} 条`}
                        />
                    </div>
                )
            }
        </div >
    );
}
