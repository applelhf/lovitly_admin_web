"use client";

import React, { useState } from "react";
import AiUserList from "@/components/users/AiUserList";
import AiUserFormModal from "@/components/users/AiUserFormModal";
import { useAiUsers, AiUser } from "@/hooks/users/useAiUsers";

export default function AiUsersPage() {
    const {
        users,
        loading,
        pagination,
        fetchUsers,
        toggleUserActive,
        deleteUser,
        createUser,
        updateUser,
    } = useAiUsers();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<AiUser | null>(null);
    const [filters, setFilters] = useState<{
        isActive?: boolean;
    }>({});

    const handleSearch = (value: string) => {
        fetchUsers({ search: value, page: 1, ...filters });
    };

    const handlePageChange = (page: number, pageSize: number) => {
        fetchUsers({ page, limit: pageSize, ...filters });
    };

    const handleFilterChange = (newFilters: {
        isActive?: boolean;
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

    const handleEdit = (user: AiUser) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleModalSubmit = async (values: Record<string, string | boolean | undefined>) => {
        if (editingUser) {
            // Edit mode
            const updateData: any = {
                username: values.username as string,
                email: values.email as string,
                avatar: values.avatar as string,
                bio: values.bio as string,
                isActive: values.isActive as boolean,
            };

            if (values.password) {
                updateData.password = values.password as string;
            }

            await updateUser(editingUser._id, updateData);
        } else {
            // Create mode
            await createUser(values as any);
        }
    };

    return (
        <div>
            <AiUserList
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

            <AiUserFormModal
                open={isModalOpen}
                editingUser={editingUser}
                onCancel={() => setIsModalOpen(false)}
                onSubmit={handleModalSubmit}
            />
        </div>
    );
}
