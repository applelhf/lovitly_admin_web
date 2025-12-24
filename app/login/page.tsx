"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Form, Input, Button, Card, message, Typography } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { authApi } from "@/lib/auth-api";
import { getErrorMessage } from "@/lib/error-handler";

const { Title, Text } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await authApi.login(values);

      // authApi.login 已经自动保存了 token 和 refreshToken
      if (response && typeof response === "object" && "data" in response) {
        const data = (response as { data?: { token?: string; email?: string } })
          .data;
        if (data?.token) {
          // 保存用户信息
          localStorage.setItem("admin_user", JSON.stringify(data));

          message.success("登录成功");
          router.push("/dashboard");
        } else {
          message.error("登录失败");
        }
      } else {
        message.error("登录失败");
      }
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error, "登录失败，请检查邮箱和密码");
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md shadow-lg">
        <div className="text-center mb-8">
          <Title level={2} style={{ marginBottom: "0.5rem" }}>
            Lovitly Admin
          </Title>
          <Text type="secondary">管理后台登录</Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "请输入邮箱" },
              { type: "email", message: "请输入有效的邮箱地址" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="邮箱" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
