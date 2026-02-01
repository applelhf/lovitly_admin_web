"use client";

import React, { useMemo } from "react";
import { Card, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import VotingStats from "./VotingStats";
import VotingFilters from "./VotingFilters";
import VotingTable from "./VotingTable";
import { VotingWithId } from "@/lib/types";
import { GetVotingsParams } from "@/hooks/votings/useVotings";

interface VotingListProps {
    votings: VotingWithId[];
    loading: boolean;
    pagination: {
        current: number;
        pageSize: number;
        total: number;
    };
    onFetch: (params?: GetVotingsParams) => void;
    onDelete: (id: string) => void;
}

export default function VotingList({
    votings,
    loading,
    pagination,
    onFetch,
    onDelete,
}: VotingListProps) {
    const router = useRouter();

    // Calculate aggregate stats from votings
    const aggregateStats = useMemo(() => {
        return votings.reduce(
            (acc, voting) => ({
                totalVotings: acc.totalVotings + 1,
                totalVotes: acc.totalVotes + (voting.stats?.totalVotes || 0),
                totalComments: acc.totalComments + (voting.stats?.totalComments || 0),
                totalViews: acc.totalViews + (voting.stats?.views || 0),
            }),
            { totalVotings: pagination.total, totalVotes: 0, totalComments: 0, totalViews: 0 }
        );
    }, [votings, pagination.total]);

    const handleFilterChange = (filters: {
        search?: string;
        status?: string;
        categoryMain?: string;
    }) => {
        onFetch({ page: 1, ...filters });
    };

    const handleFilterReset = () => {
        onFetch({ page: 1 });
    };

    const handlePageChange = (page: number, pageSize: number) => {
        onFetch({ page, limit: pageSize });
    };

    const handleView = (voting: VotingWithId) => {
        router.push(`/dashboard/votings/${voting._id}`);
    };

    const handleEdit = (voting: VotingWithId) => {
        // TODO: Implement edit modal or page
        router.push(`/dashboard/votings/${voting._id}`);
    };

    return (
        <div>
            <VotingStats
                totalVotings={aggregateStats.totalVotings}
                totalVotes={aggregateStats.totalVotes}
                totalComments={aggregateStats.totalComments}
                totalViews={aggregateStats.totalViews}
            />

            <Card>
                <div className="mb-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">投票管理</h1>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => router.push("/dashboard/votings/create")}
                    >
                        添加投票
                    </Button>
                </div>

                <VotingFilters
                    onFilterChange={handleFilterChange}
                    onReset={handleFilterReset}
                />

                <VotingTable
                    votings={votings}
                    loading={loading}
                    pagination={pagination}
                    onPageChange={handlePageChange}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={onDelete}
                />
            </Card>
        </div>
    );
}
