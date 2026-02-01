"use client";

import React, { useEffect, useState } from "react";
import {
    Form,
    Input,
    DatePicker,
    Switch,
    Card,
    Typography,
    Row,
    Col,
    Cascader,
} from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs, { type Dayjs } from "dayjs";
import { CategoriesService } from "@/src/api/services/CategoriesService";
import type { Category, Subcategory } from "@/lib/types";
import UserSelector from "./UserSelector";

const { Title, Text } = Typography;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface Option {
    value: string;
    label: string;
    children?: Option[];
}

interface VotingBasicInfoProps {
    hasBonus: boolean;
    setHasBonus: (val: boolean) => void;
}

export default function VotingBasicInfo({ hasBonus, setHasBonus }: VotingBasicInfoProps) {
    const [options, setOptions] = useState<Option[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasCustomPeriod, setHasCustomPeriod] = useState(false);
    const form = Form.useFormInstance();

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            try {
                // Fetch categories with expand=true
                const res = await CategoriesService.getApiV1AdminCategories(true);

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const categories = Array.isArray(res) ? res : (res as any)?.data || [];

                if (categories && categories.length > 0) {
                    const categoryOptions = categories
                        .filter((c: Category) => c.key !== "all")
                        .map((c: Category) => ({
                            value: c.key,
                            label: c.name,
                            children: c.subcategories && c.subcategories.length > 0
                                ? c.subcategories
                                    .filter((sub: Subcategory) => !sub.key.endsWith("-all"))
                                    .map((sub: Subcategory) => ({
                                        value: sub.key,
                                        label: sub.name,
                                    }))
                                : undefined
                        }));
                    setOptions(categoryOptions);
                } else {
                    console.warn("No categories found", res);
                }
            } catch (error) {
                console.error("Failed to fetch categories", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    const disabledDate = (current: Dayjs) => {
        return current && current < dayjs().startOf('day');
    };

    return (
        <Card className="border border-gray-200 shadow-sm overflow-hidden rounded-xl">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div>
                    <Title level={4} className="mb-0 !text-gray-800">
                        基础信息
                    </Title>
                    <Text type="secondary" className="text-sm">
                        定义投票的核心信息
                    </Text>
                </div>
            </div>

            <Row gutter={24}>
                {/* User Selector (Admin Specific) - Styled nicely */}
                <Col span={24} className="mb-6">
                    <Form.Item
                        name="createUserId"
                        label={<span className="font-medium text-gray-700">创建用户 (代表谁发布)</span>}
                        rules={[{ required: true, message: "请选择一个用户" }]}
                    >
                        <UserSelector />
                    </Form.Item>
                </Col>

                <Col span={24} md={12} className="mb-6">
                    <Form.Item
                        name="title"
                        label={<span className="font-medium text-gray-700">标题</span>}
                        rules={[{ required: true, message: "请输入标题" }]}
                        className="mb-0"
                    >
                        <Input
                            placeholder="例如: 2024年最佳夏季手机"
                            size="large"
                            className="rounded-lg"
                        />
                    </Form.Item>
                </Col>

                <Col span={24} md={12} className="mb-6">
                    <Form.Item
                        name="categoryPath"
                        label={<span className="font-medium text-gray-700">分类</span>}
                        rules={[{ required: true, message: "请选择分类" }]}
                        className="mb-0"
                    >
                        <Cascader
                            options={options}
                            placeholder="选择分类 / 子分类"
                            size="large"
                            expandTrigger="hover"
                            className="w-full rounded-lg"
                        />
                    </Form.Item>
                </Col>

                <Col span={24} className="mb-6">
                    <Form.Item
                        name="description"
                        label={<span className="font-medium text-gray-700">描述</span>}
                        className="mb-0"
                    >
                        <TextArea
                            placeholder="描述此投票的内容..."
                            rows={3}
                            className="resize-none rounded-lg"
                            showCount
                            maxLength={500}
                        />
                    </Form.Item>
                </Col>
            </Row>

            {/* Voting Period Section */}
            <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3">
                        <div className="bg-white p-2 rounded-md shadow-sm border border-gray-100">
                            <CalendarOutlined className="text-indigo-500 text-lg" />
                        </div>
                        <div>
                            <div className="font-medium text-gray-900">投票期限</div>
                            <div className="text-sm text-gray-500">
                                设置具体时间范围或保持无限期
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
                        <span className={`text-sm font-medium ${!hasCustomPeriod ? "text-rose-600" : "text-gray-400"}`}>
                            无限期
                        </span>
                        <Switch
                            checked={hasCustomPeriod}
                            onChange={(val) => {
                                setHasCustomPeriod(val);
                                if (!val) {
                                    form.setFieldValue("dateRange", undefined);
                                }
                            }}
                            className={hasCustomPeriod ? "bg-rose-500" : ""}
                        />
                        <span className={`text-sm font-medium ${hasCustomPeriod ? "text-rose-600" : "text-gray-400"}`}>
                            定时
                        </span>
                    </div>
                </div>

                {hasCustomPeriod && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                        <Form.Item
                            name="dateRange"
                            rules={[
                                {
                                    validator: async (_, value) => {
                                        if (!value || !value[0]) {
                                            return Promise.reject(new Error("请选择开始时间"));
                                        }
                                        return Promise.resolve();
                                    },
                                },
                            ]}
                            className="mb-0"
                        >
                            <RangePicker
                                showTime
                                size="large"
                                className="w-full rounded-lg"
                                placeholder={["开始时间", "结束时间 (可选)"]}
                                format="YYYY-MM-DD HH:mm"
                                disabledDate={disabledDate}
                                allowEmpty={[false, true]}
                            />
                        </Form.Item>
                    </div>
                )}
            </div>
        </Card>
    );
}
