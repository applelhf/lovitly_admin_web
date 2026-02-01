"use client";

import React from "react";
import { Card, Image, Tag, Table, Collapse, Button } from "antd";
import { HeartOutlined, MessageOutlined } from "@ant-design/icons";
import type { VotingItemWithId } from "@/lib/types";
import ItemCommentList from "./ItemCommentList";

interface VotingItemCardProps {
    item: VotingItemWithId;
    votingId: string;
    onBatchLove?: () => void;
    onAddComment?: () => void;
    onBatchLikeComment?: (commentId: string) => void;
}

export default function VotingItemCard({ item, votingId, onBatchLove, onAddComment, onBatchLikeComment }: VotingItemCardProps) {
    return (
        <Card
            style={{
                minWidth: 400,
                maxWidth: 450,
                flexShrink: 0,
                scrollSnapAlign: "start",
            }}
            cover={
                <Image
                    alt={item.name}
                    src={
                        item.primaryImageUrl ||
                        item.images?.[0] ||
                        "/placeholder.png"
                    }
                    height={200}
                    style={{
                        objectFit: "cover",
                        width: "100%",
                    }}
                    fallback="/placeholder.png"
                />
            }
        >
            {/* Item Header */}
            <div style={{ marginBottom: 12 }}>
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 8,
                    }}
                >
                    <Tag color="red">
                        <HeartOutlined /> {item.stats?.votes ?? 0} 票 (
                        {item.stats?.votePercent ?? 0}%)
                    </Tag>
                    <Tag color="green">
                        <MessageOutlined /> {item.stats?.comments ?? 0}
                    </Tag>
                </div>
                <p
                    style={{
                        fontSize: 14,
                        color: "#333",
                        margin: 0,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                    }}
                    title={item.name}
                >
                    {item.name}
                </p>
            </div>

            {/* Thumbnail images */}
            {item.images && item.images.length > 1 && (
                <div
                    style={{
                        display: "flex",
                        gap: 4,
                        marginBottom: 12,
                        flexWrap: "wrap",
                    }}
                >
                    {item.images.slice(1, 5).map((img, i) => (
                        <Image
                            key={i}
                            src={img}
                            width={48}
                            height={48}
                            style={{
                                objectFit: "cover",
                                borderRadius: 4,
                            }}
                            fallback="/placeholder.png"
                        />
                    ))}
                </div>
            )}

            {/* Specs */}
            {item.specs && Object.keys(item.specs).length > 0 && (
                <Table
                    size="small"
                    pagination={false}
                    showHeader={false}
                    dataSource={Object.entries(item.specs).map(
                        ([key, value]) => ({
                            key,
                            param: key,
                            value,
                        })
                    )}
                    columns={[
                        {
                            dataIndex: "param",
                            width: 100,
                            render: (text: string) => (
                                <span style={{ color: "#666" }}>{text}</span>
                            ),
                        },
                        {
                            dataIndex: "value",
                            render: (text: string) => <strong>{text}</strong>,
                        },
                    ]}
                />
            )}

            {/* Actions */}
            <div style={{ marginTop: 12, marginBottom: 12 }}>
                <Button
                    type="primary"
                    danger
                    ghost
                    icon={<HeartOutlined />}
                    onClick={onBatchLove}
                    block
                >
                    批量点赞
                </Button>
                <div style={{ height: 8 }} />
                <Button
                    icon={<MessageOutlined />}
                    onClick={onAddComment}
                    block
                >
                    添加评论
                </Button>
            </div>

            {/* Comments collapse */}
            <Collapse
                ghost
                size="small"
                items={[
                    {
                        key: "comments",
                        label: `评论 (${item.stats?.comments ?? 0})`,
                        children: (
                            <ItemCommentList
                                votingId={votingId}
                                itemId={item.itemId}
                                onBatchLike={onBatchLikeComment}
                            />
                        ),
                    },
                ]}
            />
        </Card>
    );
}
