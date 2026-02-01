import { AdminVotingService, AdminCommentsService } from "@/src/api";
import "@/lib/api-config";

export const votingApi = {
    // 获取投票列表
    getVotings: (params: {
        page?: number;
        limit?: number;
        categoryMain?: string;
        categorySub?: string;
        sort?: string;
        isActive?: boolean;
    } = {}) => {
        return AdminVotingService.getApiV1AdminVotings(
            params.page || 1,
            params.limit || 10,
            params.categoryMain,
            params.categorySub,
            params.sort || "-createdAt",
            params.isActive
        );
    },

    // 获取单个投票详情
    getVoting: (id: string) => {
        return AdminVotingService.getApiV1AdminVotings1(id);
    },

    // 删除投票
    deleteVoting: (id: string) => {
        return AdminVotingService.deleteApiV1AdminVotings(id);
    },

    // 获取 item 评论列表
    getComments: (votingId: string, itemId: string, page = 1, limit = 50) => {
        return AdminCommentsService.getApiV1AdminComments(votingId, itemId, page, limit);
    },

    // 创建评论
    createComment: (data: { votingId: string; itemId: string; content: string; userId: string }) => {
        return AdminCommentsService.postApiV1AdminComments(data);
    },

    // 删除评论
    deleteComment: (id: string) => {
        return AdminCommentsService.deleteApiV1AdminComments(id);
    },

    // 批量点赞评论
    batchLikeComment: (commentId: string, userIds: string[]) => {
        return AdminCommentsService.postApiV1AdminCommentsBatchLike({ commentId, userIds });
    },
};
