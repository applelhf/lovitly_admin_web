"use client";

import React from "react";
import { Card, Row, Col, Avatar, Descriptions, Tag } from "antd";
import { UserOutlined } from "@ant-design/icons";
import type { Creator } from "@/lib/types";

interface VotingCreatorCardProps {
    creator?: Creator;
    createdBy?: string;
    creatorAccountType?: string;
}

const getAccountTypeTag = (type?: string) => {
    const typeMap: Record<string, { color: string; text: string }> = {
        personal: { color: "blue", text: "个人用户" },
        personal1: { color: "cyan", text: "测试个人" },
        biz: { color: "gold", text: "商家用户" },
        biz1: { color: "orange", text: "测试商家" },
        admin: { color: "red", text: "管理员" },
    };
    const t = typeMap[type || ""] || { color: "default", text: type || "未知" };
    return <Tag color={t.color}>{t.text}</Tag>;
};

export default function VotingCreatorCard({
    creator,
    createdBy,
    creatorAccountType,
}: VotingCreatorCardProps) {
    return (
        <Card title="创建者信息" className="mb-6">
            {creator ? (
                <Row align="middle" gutter={16}>
                    <Col>
                        <Avatar
                            size={64}
                            src={creator.avatar}
                            icon={<UserOutlined />}
                        />
                    </Col>
                    <Col>
                        <div>
                            <strong style={{ fontSize: 16 }}>
                                {creator.userName}
                            </strong>
                            <div style={{ marginTop: 4 }}>
                                {getAccountTypeTag(creator.accountType)}
                            </div>
                            {creator.companyName && (
                                <div style={{ color: "#666", marginTop: 4 }}>
                                    公司: {creator.companyName}
                                </div>
                            )}
                            {creator.bio && (
                                <div style={{ color: "#999", marginTop: 4 }}>
                                    {creator.bio}
                                </div>
                            )}
                        </div>
                    </Col>
                </Row>
            ) : (
                <Descriptions column={2}>
                    <Descriptions.Item label="创建者ID">
                        {createdBy || "未知"}
                    </Descriptions.Item>
                    <Descriptions.Item label="账户类型">
                        {getAccountTypeTag(creatorAccountType)}
                    </Descriptions.Item>
                </Descriptions>
            )}
        </Card>
    );
}
