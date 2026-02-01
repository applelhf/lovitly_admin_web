"use client";

import React, { useRef, useState } from "react";
import { Card, Button, message, Modal, Progress } from "antd";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import PersonalUserTable from "./PersonalUserTable";
import PersonalUserFilters from "./PersonalUserFilters";
import { PersonalUser } from "@/hooks/users/usePersonalUsers";
import { personalUserApi } from "@/lib/personal-user-api";

interface BatchUserData {
  username: string;
  email: string;
}

interface PersonalUserListProps {
  users: PersonalUser[];
  loading: boolean;
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  onSearch: (value: string) => void;
  onPageChange: (page: number, pageSize: number) => void;
  onToggleActive: (id: string, currentStatus: boolean) => void;
  onEdit: (user: PersonalUser) => void;
  onDelete: (id: string) => void;
  onFilterChange: (filters: {
    isActive?: boolean;
    isEmailVerified?: boolean;
  }) => void;
  onFilterReset: () => void;
  onCreateClick: () => void;
  onBatchCreateSuccess?: () => void;
}

export default function PersonalUserList({
  users,
  loading,
  pagination,
  onSearch,
  onPageChange,
  onToggleActive,
  onEdit,
  onDelete,
  onFilterChange,
  onFilterReset,
  onCreateClick,
  onBatchCreateSuccess,
}: PersonalUserListProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [batchCreating, setBatchCreating] = useState(false);
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 });

  const validateBatchData = (data: unknown): data is BatchUserData[] => {
    if (!Array.isArray(data)) return false;
    return data.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof item.username === "string" &&
        item.username.trim() !== "" &&
        typeof item.email === "string" &&
        item.email.trim() !== ""
    );
  };

  const handleBatchCreate = async (usersData: BatchUserData[]) => {
    setBatchCreating(true);
    setBatchProgress({ current: 0, total: usersData.length });

    let successCount = 0;
    let failCount = 0;
    const errors: string[] = [];

    for (let i = 0; i < usersData.length; i++) {
      const userData = usersData[i];
      try {
        await personalUserApi.createUser({
          username: userData.username,
          email: userData.email,
          password: "abc123456",
        });
        successCount++;
      } catch (error) {
        failCount++;
        const errorMsg = error instanceof Error ? error.message : "未知错误";
        errors.push(`${userData.email}: ${errorMsg}`);
      }
      setBatchProgress({ current: i + 1, total: usersData.length });
    }

    setBatchCreating(false);

    if (failCount > 0) {
      Modal.warning({
        title: "批量创建完成",
        content: (
          <div>
            <p>成功: {successCount} 个</p>
            <p>失败: {failCount} 个</p>
            {errors.length > 0 && (
              <div style={{ maxHeight: 200, overflow: "auto", marginTop: 8 }}>
                <p>错误详情:</p>
                {errors.map((err, idx) => (
                  <p key={idx} style={{ fontSize: 12, color: "#ff4d4f" }}>
                    {err}
                  </p>
                ))}
              </div>
            )}
          </div>
        ),
      });
    } else {
      message.success(`成功创建 ${successCount} 个用户`);
    }

    if (successCount > 0) {
      onBatchCreateSuccess?.();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Reset input so the same file can be selected again
    event.target.value = "";

    if (!file.name.endsWith(".json")) {
      message.error("请选择 JSON 文件");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        if (!validateBatchData(data)) {
          message.error(
            "文件格式不正确，每条数据必须包含 username 和 email 字段"
          );
          return;
        }

        if (data.length === 0) {
          message.error("文件中没有用户数据");
          return;
        }

        Modal.confirm({
          title: "确认批量创建",
          content: `即将创建 ${data.length} 个用户，默认密码为 abc123456，是否继续？`,
          onOk: () => handleBatchCreate(data),
        });
      } catch {
        message.error("JSON 文件解析失败，请检查文件格式");
      }
    };
    reader.onerror = () => {
      message.error("文件读取失败");
    };
    reader.readAsText(file);
  };

  const handleBatchCreateClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        style={{ display: "none" }}
        onChange={handleFileSelect}
      />

      {/* Batch create progress modal */}
      <Modal
        open={batchCreating}
        title="批量创建中..."
        footer={null}
        closable={false}
      >
        <Progress
          percent={Math.round(
            (batchProgress.current / batchProgress.total) * 100
          )}
          status="active"
        />
        <p style={{ textAlign: "center", marginTop: 8 }}>
          {batchProgress.current} / {batchProgress.total}
        </p>
      </Modal>

      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">个人用户管理</h1>
        <div className="flex gap-2">
          <Button
            icon={<UploadOutlined />}
            onClick={handleBatchCreateClick}
            disabled={batchCreating}
          >
            批量创建
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={onCreateClick}>
            创建用户
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <PersonalUserFilters
          onFilterChange={onFilterChange}
          onReset={onFilterReset}
        />
      </div>

      <PersonalUserTable
        users={users}
        loading={loading}
        pagination={pagination}
        onSearch={onSearch}
        onPageChange={onPageChange}
        onToggleActive={onToggleActive}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </Card>
  );
}
