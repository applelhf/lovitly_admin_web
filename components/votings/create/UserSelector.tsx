"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Select, Spin, Avatar, Space, Tag, Empty } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { PersonalUsersService } from "@/src/api/services/PersonalUsersService";
import { BizUsersService } from "@/src/api/services/BizUsersService";
import type { UserOption } from "@/app/dashboard/votings/create/types";

interface UserSelectorProps {
    value?: string | string[];
    onChange?: (value: any) => void;
    mode?: "multiple" | "tags";
}

export default function UserSelector({ value, onChange, mode }: UserSelectorProps) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState<UserOption[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    // Store timeouts to clear them
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const fetchUsers = useCallback(async (search: string) => {
        if (!search) {
            // Initial load without search term usually returns recent or empty
            // Let's allow fetching empty search results for initial list
        }

        setFetching(true);
        // setOptions([]); // Don't clear immediately to avoid flashing

        try {
            // Search both personal and biz users in parallel
            const [personalRes, bizRes] = await Promise.all([
                PersonalUsersService.getApiV1AdminPersonalUsers(1, 10, search),
                BizUsersService.getApiV1AdminBizUsers(1, 10, search),
            ]);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const personalUsers = (personalRes.data || []).map((u: any) => ({
                value: u._id || u.id,
                label: u.username,
                avatar: u.avatar,
                email: u.email,
                accountType: u.accountType,
            }));

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const bizUsers = (bizRes.data || []).map((u: any) => ({
                value: u._id || u.id,
                label: u.username,
                avatar: u.avatar,
                email: u.email,
                accountType: u.accountType,
            }));

            setOptions([...personalUsers, ...bizUsers]);
        } catch (error) {
            console.error("Failed to search users:", error);
        } finally {
            setFetching(false);
        }
    }, []);

    // Debounce search
    useEffect(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            fetchUsers(searchTerm);
        }, 800);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [searchTerm, fetchUsers]);

    return (
        <Select
            mode={mode}
            showSearch
            value={value}
            placeholder="搜素并选择一个用户"
            filterOption={false}
            onSearch={setSearchTerm}
            onChange={onChange}
            notFoundContent={fetching ? <Spin size="small" /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
            style={{ width: "100%" }}
            size="large"
            optionLabelProp="label"
        >
            {options.map((user) => (
                <Select.Option key={user.value} value={user.value} label={user.label}>
                    <Space>
                        <Avatar
                            size="small"
                            src={user.avatar}
                            icon={<UserOutlined />}
                        />
                        <div>
                            <div>{user.label}</div>
                            <div className="text-xs text-gray-400">
                                {user.email} <Tag style={{ marginLeft: 4 }}>{user.accountType}</Tag>
                            </div>
                        </div>
                    </Space>
                </Select.Option>
            ))}
        </Select>
    );
}
