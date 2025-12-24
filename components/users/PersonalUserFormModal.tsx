"use client";

import React, { useState } from "react";
import { Modal, Form, Input, Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { PersonalUser } from "@/hooks/users/usePersonalUsers";

interface PersonalUserFormModalProps {
  open: boolean;
  editingUser: PersonalUser | null;
  onCancel: () => void;
  onSubmit: (values: {
    username: string;
    email: string;
    password?: string;
    avatar?: string;
    bio?: string;
  }) => Promise<void>;
}

export default function PersonalUserFormModal({
  open,
  editingUser,
  onCancel,
  onSubmit,
}: PersonalUserFormModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (open) {
      if (editingUser) {
        form.setFieldsValue({
          username: editingUser.username,
          email: editingUser.email,
          avatar: editingUser.avatar,
          bio: editingUser.bio,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, editingUser, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await onSubmit(values);
      form.resetFields();
      onCancel();
    } catch {
      // 表单验证错误或提交错误，不关闭 Modal
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={editingUser ? "编辑用户" : "创建用户"}
      open={open}
      onOk={handleSubmit}
      onCancel={onCancel}
      okText="确定"
      cancelText="取消"
      confirmLoading={loading}
      width={600}
    >
      <Form form={form} layout="vertical" className="mt-4">
        <Form.Item
          label="用户名"
          name="username"
          rules={[
            { required: true, message: "请输入用户名" },
            { min: 3, message: "用户名至少 3 个字符" },
            { max: 30, message: "用户名最多 30 个字符" },
          ]}
        >
          <Input placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item
          label="邮箱"
          name="email"
          rules={[
            { required: true, message: "请输入邮箱" },
            { type: "email", message: "请输入有效的邮箱地址" },
          ]}
        >
          <Input placeholder="请输入邮箱" disabled={!!editingUser} />
        </Form.Item>

        {!editingUser && (
          <Form.Item
            label="密码"
            name="password"
            rules={[
              { required: true, message: "请输入密码" },
              { min: 6, message: "密码至少 6 个字符" },
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        )}

        {editingUser && (
          <Form.Item
            label="新密码（不修改请留空）"
            name="password"
            rules={[{ min: 6, message: "密码至少 6 个字符" }]}
          >
            <Input.Password placeholder="留空则不修改密码" />
          </Form.Item>
        )}

        <Form.Item label="头像 URL" name="avatar">
          <Input
            placeholder="请输入头像 URL"
            prefix={<Avatar icon={<UserOutlined />} size="small" />}
          />
        </Form.Item>

        <Form.Item label="个人简介" name="bio">
          <Input.TextArea
            rows={4}
            placeholder="请输入个人简介"
            maxLength={200}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
