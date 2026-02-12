"use client";

import { useState, useEffect, useCallback } from "react";
import { votingApi } from "@/lib/voting-api";
import { VotingWithId } from "@/lib/types";
import { message } from "antd";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export interface GetVotingsParams {
    page?: number;
    limit?: number;
    categoryMain?: string;
    categorySub?: string;
    sort?: string;
    isActive?: boolean;
    search?: string;
    status?: string;
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
    updateUrlParams: (params?: GetVotingsParams) => void;
}

export function useVotings(): UseVotingsResult {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const [votings, setVotings] = useState<VotingWithId[]>([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: Number(searchParams.get("page")) || 1,
        pageSize: Number(searchParams.get("limit")) || 10,
        total: 0,
    });

    const fetchVotings = useCallback(async (params: GetVotingsParams = {}) => {
        setLoading(true);
        try {
            const page = params.page || Number(searchParams.get("page")) || 1;
            const limit = params.limit || Number(searchParams.get("limit")) || 10;
            const categoryMain = params.categoryMain || searchParams.get("categoryMain") || undefined;
            const categorySub = params.categorySub || searchParams.get("categorySub") || undefined;
            const sort = params.sort || searchParams.get("sort") || undefined;
            const isActive = params.isActive !== undefined ? params.isActive : (searchParams.get("isActive") === "true" ? true : undefined);

            // Filter out params not supported by votingApi
            const apiParams = {
                page,
                limit,
                categoryMain,
                categorySub,
                sort,
                isActive,
            };

            const response = await votingApi.getVotings(apiParams);
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
    }, [searchParams]);

    const updateUrlParams = useCallback((params: GetVotingsParams = {}) => {
        const urlParams = new URLSearchParams(searchParams.toString());

        if (params.page) urlParams.set("page", params.page.toString());
        urlParams.delete("limit"); // Always remove limit from URL to keep it clean (default 10)

        if (params.categoryMain) urlParams.set("categoryMain", params.categoryMain);
        else if (params.categoryMain === "") urlParams.delete("categoryMain");

        if (params.categorySub) urlParams.set("categorySub", params.categorySub);
        else if (params.categorySub === "") urlParams.delete("categorySub");

        if (params.sort) urlParams.set("sort", params.sort);
        if (params.isActive !== undefined) urlParams.set("isActive", params.isActive.toString());

        if (params.search) urlParams.set("search", params.search);
        else if (params.search === "") urlParams.delete("search");

        if (params.status) urlParams.set("status", params.status);
        else if (params.status === "") urlParams.delete("status");

        router.push(`${pathname}?${urlParams.toString()}`);
    }, [searchParams, pathname, router]);

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
        updateUrlParams,
    };
}
