"use client";

import React from "react";
import { Space, Select, Button } from "antd";
import { ClearOutlined } from "@ant-design/icons";

interface BizUserFiltersProps {
  onFilterChange: (filters: {
    isActive?: boolean;
    isEmailVerified?: boolean;
  }) => void;
  onReset: () => void;
}

export default function BizUserFilters({
  onFilterChange,
  onReset,
}: BizUserFiltersProps) {
  const [isActive, setIsActive] = React.useState<boolean | undefined>(
    undefined
  );
  const [isEmailVerified, setIsEmailVerified] = React.useState<
    boolean | undefined
  >(undefined);

  const handleActiveChange = (value: boolean | undefined) => {
    setIsActive(value);
    onFilterChange({ isActive: value, isEmailVerified });
  };

  const handleEmailVerifiedChange = (value: boolean | undefined) => {
    setIsEmailVerified(value);
    onFilterChange({ isActive, isEmailVerified: value });
  };

  const handleReset = () => {
    setIsActive(undefined);
    setIsEmailVerified(undefined);
    onReset();
  };

  return (
    <Space wrap>
      <Select
        placeholder="激活状态"
        allowClear
        style={{ width: 120 }}
        value={isActive}
        onChange={handleActiveChange}
        options={[
          { label: "全部", value: undefined },
          { label: "激活", value: true },
          { label: "禁用", value: false },
        ]}
      />
      <Select
        placeholder="邮箱验证"
        allowClear
        style={{ width: 120 }}
        value={isEmailVerified}
        onChange={handleEmailVerifiedChange}
        options={[
          { label: "全部", value: undefined },
          { label: "已验证", value: true },
          { label: "未验证", value: false },
        ]}
      />
      <Button icon={<ClearOutlined />} onClick={handleReset}>
        重置筛选
      </Button>
    </Space>
  );
}
