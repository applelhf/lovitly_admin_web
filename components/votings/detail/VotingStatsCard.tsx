"use client";

import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import {
    HeartOutlined,
    MessageOutlined,
    EyeOutlined,
    SaveOutlined,
} from "@ant-design/icons";
import type { VotingStats } from "@/lib/types";

interface VotingStatsCardProps {
    stats?: VotingStats;
}

export default function VotingStatsCard({ stats }: VotingStatsCardProps) {
    return (
        <Row gutter={16} className="mb-6">
            <Col span={6}>
                <Card>
                    <Statistic
                        title="总投票数"
                        value={stats?.totalVotes ?? 0}
                        prefix={<HeartOutlined />}
                        valueStyle={{ color: "#ff4d4f" }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="评论数"
                        value={stats?.totalComments ?? 0}
                        prefix={<MessageOutlined />}
                        valueStyle={{ color: "#52c41a" }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="浏览量"
                        value={stats?.views ?? 0}
                        prefix={<EyeOutlined />}
                        valueStyle={{ color: "#1890ff" }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="收藏数"
                        value={stats?.saves ?? 0}
                        prefix={<SaveOutlined />}
                        valueStyle={{ color: "#722ed1" }}
                    />
                </Card>
            </Col>
        </Row>
    );
}
