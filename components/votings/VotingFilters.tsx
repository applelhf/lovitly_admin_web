"use client";

import React from "react";
import { Form, Select, Button, Input, DatePicker } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

interface VotingFiltersProps {
    onFilterChange: (filters: {
        search?: string;
        status?: string;
        categoryMain?: string;
    }) => void;
    onReset: () => void;
}

export default function VotingFilters({
    onFilterChange,
    onReset,
}: VotingFiltersProps) {
    const [form] = Form.useForm();

    const handleSearch = () => {
        const values = form.getFieldsValue();
        onFilterChange({
            search: values.search,
            status: values.status,
            categoryMain: values.categoryMain,
        });
    };

    const handleReset = () => {
        form.resetFields();
        onReset();
    };

    return (
        <Form form={form} layout="inline" className="mb-4">
            <Form.Item name="search">
                <Input
                    placeholder="搜索标题"
                    prefix={<SearchOutlined />}
                    allowClear
                    style={{ width: 200 }}
                />
            </Form.Item>
            <Form.Item name="status">
                <Select
                    placeholder="状态"
                    allowClear
                    style={{ width: 120 }}
                    options={[
                        { value: "active", label: "进行中" },
                        { value: "closed", label: "已结束" },
                        { value: "draft", label: "草稿" },
                    ]}
                />
            </Form.Item>
            <Form.Item>
                <Button type="primary" onClick={handleSearch}>
                    筛选
                </Button>
            </Form.Item>
            <Form.Item>
                <Button icon={<ReloadOutlined />} onClick={handleReset}>
                    重置
                </Button>
            </Form.Item>
        </Form>
    );
}
