"use client";

import React from "react";
import { Card, Descriptions, Tag } from "antd";
import dayjs from "dayjs";
import type { VotingWithId } from "@/lib/types";

interface VotingInfoCardProps {
    voting: VotingWithId;
}

const getStatusTag = (status?: string) => {
    const statusMap: Record<string, { color: string; text: string }> = {
        active: { color: "green", text: "进行中" },
        closed: { color: "red", text: "已结束" },
        draft: { color: "gray", text: "草稿" },
    };
    const s = statusMap[status || ""] || { color: "default", text: status || "" };
    return <Tag color={s.color}>{s.text}</Tag>;
};

const formatTime = (time?: string) => {
    return time ? dayjs(time).format("YYYY-MM-DD HH:mm") : "—";
};

export default function VotingInfoCard({ voting }: VotingInfoCardProps) {
    return (
        <Card title="投票信息" className="mb-6">
            <Descriptions column={2}>
                <Descriptions.Item label="标题">{voting.title}</Descriptions.Item>
                <Descriptions.Item label="状态">
                    {getStatusTag(voting.status)}
                </Descriptions.Item>
                <Descriptions.Item label="分类">
                    {voting.category?.main || "-"}
                    {voting.category?.sub && ` / ${voting.category.sub}`}
                </Descriptions.Item>
                <Descriptions.Item label="有奖励">
                    {voting.hasBonus ? (
                        <Tag color="gold">是</Tag>
                    ) : (
                        <Tag color="default">否</Tag>
                    )}
                </Descriptions.Item>
                <Descriptions.Item label="开始时间">
                    {formatTime(voting.startTime)}
                </Descriptions.Item>
                <Descriptions.Item label="结束时间">
                    {voting.endTime ? formatTime(voting.endTime) : "无限期"}
                </Descriptions.Item>
                <Descriptions.Item label="创建时间">
                    {formatTime(voting.createdAt)}
                </Descriptions.Item>
                <Descriptions.Item label="更新时间">
                    {formatTime(voting.updatedAt)}
                </Descriptions.Item>
                {voting.description && (
                    <Descriptions.Item label="描述" span={2}>
                        {voting.description}
                    </Descriptions.Item>
                )}
                {voting.tags && voting.tags.length > 0 && (
                    <Descriptions.Item label="标签" span={2}>
                        {voting.tags.map((tag) => (
                            <Tag key={tag} color="blue">
                                {tag}
                            </Tag>
                        ))}
                    </Descriptions.Item>
                )}
            </Descriptions>
        </Card>
    );
}
