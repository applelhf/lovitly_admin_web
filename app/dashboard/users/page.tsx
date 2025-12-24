"use client";

import React, { useState } from "react";
import PersonalUserList from "@/components/users/PersonalUserList";
import PersonalUserFormModal from "@/components/users/PersonalUserFormModal";
import { usePersonalUsers, PersonalUser } from "@/hooks/users/usePersonalUsers";

export default function UsersPage() {
  const {
    users,
    loading,
    pagination,
    fetchUsers,
    toggleUserActive,
    deleteUser,
    createUser,
    updateUser,
  } = usePersonalUsers();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<PersonalUser | null>(null);
  const [filters, setFilters] = useState<{
    isActive?: boolean;
    isEmailVerified?: boolean;
  }>({});

  const handleSearch = (value: string) => {
    fetchUsers({ search: value, page: 1, ...filters });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    fetchUsers({ page, limit: pageSize, ...filters });
  };

  const handleFilterChange = (newFilters: {
    isActive?: boolean;
    isEmailVerified?: boolean;
  }) => {
    setFilters(newFilters);
    fetchUsers({ page: 1, ...newFilters });
  };

  const handleFilterReset = () => {
    setFilters({});
    fetchUsers({ page: 1 });
  };

  const handleCreateClick = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: PersonalUser) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (values: {
    username: string;
    email: string;
    password?: string;
    avatar?: string;
    bio?: string;
  }) => {
    if (editingUser) {
      // 编辑模式
      const updateData: {
        username?: string;
        email?: string;
        password?: string;
        avatar?: string;
        bio?: string;
      } = {
        username: values.username,
        avatar: values.avatar,
        bio: values.bio,
      };

      // 只在密码有值时才更新密码
      if (values.password) {
        updateData.password = values.password;
      }

      await updateUser(editingUser._id, updateData);
    } else {
      // 创建模式
      await createUser(
        values as {
          username: string;
          email: string;
          password: string;
          avatar?: string;
          bio?: string;
        }
      );
    }
  };

  return (
    <div>
      <PersonalUserList
        users={users}
        loading={loading}
        pagination={pagination}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        onToggleActive={toggleUserActive}
        onEdit={handleEdit}
        onDelete={deleteUser}
        onFilterChange={handleFilterChange}
        onFilterReset={handleFilterReset}
        onCreateClick={handleCreateClick}
      />

      <PersonalUserFormModal
        open={isModalOpen}
        editingUser={editingUser}
        onCancel={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}
