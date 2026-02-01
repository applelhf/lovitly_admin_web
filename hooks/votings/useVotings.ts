"use client";

import { useState, useEffect, useCallback } from "react";
import { votingApi } from "@/lib/voting-api";
import { VotingWithId } from "@/lib/types";
import { message } from "antd";

export interface GetVotingsParams {
    page?: number;
    limit?: number;
    categoryMain?: string;
    categorySub?: string;
    sort?: string;
    isActive?: boolean;
}

interface UseVotingsResult {
    votings: VotingWithId[];
    loading: boolean;
    pagination: {
        current: number;
        pageSize: number;
        total: number;
    };
    fetchVotings: (params?: GetVotingsParams) => Promise<void>;
    deleteVoting: (id: string) => Promise<void>;
}

export function useVotings(): UseVotingsResult {
    const [votings, setVotings] = useState<VotingWithId[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0,
    });

    const fetchVotings = useCallback(async (params: GetVotingsParams = {}) => {
        setLoading(true);
        try {
            const response = await votingApi.getVotings({
                page: params.page || 1,
                limit: params.limit || 10,
                ...params,
            });
            // Backend returns _id, swagger uses id - cast to VotingWithId for frontend use
            setVotings((response.data || []) as VotingWithId[]);
            setPagination({
                current: response.pagination?.page || 1,
                pageSize: response.pagination?.limit || 10,
                total: response.pagination?.total || 0,
            });
        } catch (error) {
            console.error("Failed to fetch votings:", error);
            message.error("获取投票列表失败");
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteVoting = useCallback(
        async (id: string) => {
            try {
                await votingApi.deleteVoting(id);
                message.success("删除成功");
                fetchVotings();
            } catch (error) {
                console.error("Failed to delete voting:", error);
                message.error("删除失败");
            }
        },
        [fetchVotings]
    );

    useEffect(() => {
        fetchVotings();
    }, [fetchVotings]);

    return {
        votings,
        loading,
        pagination,
        fetchVotings,
        deleteVoting,
    };
}
