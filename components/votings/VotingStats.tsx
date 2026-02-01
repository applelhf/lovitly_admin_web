"use client";

import React from "react";
import { Card, Statistic, Row, Col } from "antd";
import {
    BarChartOutlined,
    HeartOutlined,
    MessageOutlined,
    EyeOutlined,
} from "@ant-design/icons";

interface VotingStatsProps {
    totalVotings: number;
    totalVotes: number;
    totalComments: number;
    totalViews: number;
}

export default function VotingStats({
    totalVotings,
    totalVotes,
    totalComments,
    totalViews,
}: VotingStatsProps) {
    return (
        <Row gutter={16} className="mb-6">
            <Col span={6}>
                <Card>
                    <Statistic
                        title="总投票数"
                        value={totalVotings}
                        prefix={<BarChartOutlined />}
                        valueStyle={{ color: "#1890ff" }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="总投票次数"
                        value={totalVotes}
                        prefix={<HeartOutlined />}
                        valueStyle={{ color: "#ff4d4f" }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="总评论数"
                        value={totalComments}
                        prefix={<MessageOutlined />}
                        valueStyle={{ color: "#52c41a" }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card>
                    <Statistic
                        title="总浏览量"
                        value={totalViews}
                        prefix={<EyeOutlined />}
                        valueStyle={{ color: "#722ed1" }}
                    />
                </Card>
            </Col>
        </Row>
    );
}
