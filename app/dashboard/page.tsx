"use client";

import React from "react";
import { Card, Row, Col, Statistic } from "antd";
import { UserOutlined, AppstoreOutlined } from "@ant-design/icons";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">仪表盘</h1>

      <Row gutter={16}>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic title="总用户数" value={0} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card>
            <Statistic
              title="总分类数"
              value={0}
              prefix={<AppstoreOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card className="mt-6" title="欢迎使用 Lovitly 管理后台">
        <p>这是一个简洁高效的管理系统，您可以在这里管理用户和分类信息。</p>
        <ul className="mt-4 list-disc list-inside">
          <li>用户管理：查看、编辑和管理所有用户</li>
          <li>分类管理：创建、编辑和删除分类信息</li>
        </ul>
      </Card>
    </div>
  );
}
