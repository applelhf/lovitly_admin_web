import React, { useEffect } from "react";
import { Modal, Form, Input, Switch, message } from "antd";
import { AiUser } from "@/hooks/users/useAiUsers";

interface AiUserFormModalProps {
    open: boolean;
    editingUser: AiUser | null;
    onCancel: () => void;
    onSubmit: (values: Record<string, string | boolean | undefined>) => Promise<void>;
}

export default function AiUserFormModal({
    open,
    editingUser,
    onCancel,
    onSubmit,
}: AiUserFormModalProps) {
    const [form] = Form.useForm();
    const [submitting, setSubmitting] = React.useState(false);

    useEffect(() => {
        if (open) {
            if (editingUser) {
                form.setFieldsValue({
                    username: editingUser.username,
                    email: editingUser.email || "",
                    avatar: editingUser.avatar || "",
                    bio: editingUser.bio || "",
                    isActive: editingUser.isActive !== false,
                    password: "", // 密码不回显
                });
            } else {
                form.resetFields();
                form.setFieldsValue({ isActive: true });
            }
        }
    }, [open, editingUser, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            setSubmitting(true);

            // Convert empty strings to undefined to match backend expectations
            if (values.avatar === '') values.avatar = undefined;
            if (values.bio === '') values.bio = undefined;

            await onSubmit(values);
            form.resetFields();
            onCancel();
        } catch (error) {
            console.error("Validation failed:", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            title={editingUser ? "编辑 AI Employee" : "添加 AI Employee"}
            open={open}
            onOk={handleSubmit}
            onCancel={onCancel}
            confirmLoading={submitting}
            destroyOnClose
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{ isActive: true }}
            >
                <Form.Item
                    name="username"
                    label="用户名"
                    rules={[
                        { required: true, message: "请输入用户名" },
                        { min: 3, message: "用户名至少3个字符" },
                        { max: 30, message: "用户名最多30个字符" },
                    ]}
                >
                    <Input placeholder="输入 AI Employee 用户名" />
                </Form.Item>

                <Form.Item
                    name="email"
                    label="邮箱"
                    rules={[
                        { required: true, message: "请输入邮箱地址" },
                        { type: "email", message: "请输入有效的邮箱地址" },
                    ]}
                >
                    <Input placeholder="输入邮箱" />
                </Form.Item>

                <Form.Item
                    name="password"
                    label={editingUser ? "密码 (留空则不修改)" : "密码"}
                    rules={[
                        { required: !editingUser, message: "请输入密码" },
                        { min: 6, message: "密码至少6个字符" },
                    ]}
                >
                    <Input.Password placeholder="输入密码" />
                </Form.Item>

                <Form.Item name="avatar" label="头像 URL (可选)">
                    <Input placeholder="输入头像链接" />
                </Form.Item>

                <Form.Item name="bio" label="个人简介 (可选)">
                    <Input.TextArea placeholder="输入一小段 AI 简介..." rows={3} maxLength={500} showCount />
                </Form.Item>

                {editingUser && (
                    <Form.Item
                        name="isActive"
                        label="账号状态"
                        valuePropName="checked"
                    >
                        <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                    </Form.Item>
                )}
            </Form>
        </Modal>
    );
}
