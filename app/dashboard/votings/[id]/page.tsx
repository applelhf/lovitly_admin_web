"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, Button, Spin, message } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { votingApi } from "@/lib/voting-api";
import { VotingWithId } from "@/lib/types";
import {
    VotingStatsCard,
    VotingCreatorCard,
    VotingInfoCard,
    VotingItemCard,
} from "@/components/votings/detail";

import { Modal, Input } from "antd";
import UserBatchSelector from "@/components/votings/common/UserBatchSelector";
import { AdminVotingService } from "@/src/api/services/AdminVotingService";
import { AdminCommentsService } from "@/src/api/services/AdminCommentsService";

export default function VotingDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [voting, setVoting] = useState<VotingWithId | null>(null);
    const [loading, setLoading] = useState(true);

    // Batch Save State
    const [batchSaveVisible, setBatchSaveVisible] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);

    // Batch Love State
    const [batchLoveVisible, setBatchLoveVisible] = useState(false);
    const [targetItemId, setTargetItemId] = useState<string | null>(null);
    const [selectedLoveUsers, setSelectedLoveUsers] = useState<string[]>([]);
    const [loveSaving, setLoveSaving] = useState(false);

    // Comment State
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [selectedCommentUser, setSelectedCommentUser] = useState<string[]>([]);
    const [commentContent, setCommentContent] = useState("");
    const [commentSaving, setCommentSaving] = useState(false);

    // Batch Like Comment State
    const [likeCommentModalVisible, setLikeCommentModalVisible] = useState(false);
    const [targetCommentId, setTargetCommentId] = useState<string | null>(null);
    const [selectedLikeCommentUsers, setSelectedLikeCommentUsers] = useState<string[]>([]);
    const [likeCommentSaving, setLikeCommentSaving] = useState(false);

    useEffect(() => {
        const fetchVoting = async () => {
            try {
                const response = await votingApi.getVoting(params.id as string);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const votingData = (response as any)?.data || response;
                setVoting(votingData as VotingWithId);
            } catch (error) {
                console.error("Failed to fetch voting:", error);
                message.error("获取投票详情失败");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchVoting();
        }
    }, [params.id]);

    const handleBatchSave = async () => {
        if (selectedUsers.length === 0) {
            message.warning("请至少选择一个用户");
            return;
        }

        setSaving(true);
        try {
            await AdminVotingService.postApiV1AdminVotingsBatchToggleSave({
                votingIds: [voting?._id || ""],
                userIds: selectedUsers,
            });
            message.success("批量收藏操作成功");
            setBatchSaveVisible(false);
            setSelectedUsers([]);
            window.location.reload();
        } catch (error) {
            console.error("Batch save failed:", error);
            message.error("操作失败，请重试");
        } finally {
            setSaving(false);
        }
    };

    const handleBatchLoveClick = (itemId: string) => {
        setTargetItemId(itemId);
        setBatchLoveVisible(true);
    };

    const handleBatchLoveSubmit = async () => {
        if (selectedLoveUsers.length === 0) {
            message.warning("请至少选择一个用户");
            return;
        }
        if (!targetItemId) return;

        setLoveSaving(true);
        try {
            await AdminVotingService.postApiV1AdminVotingsBatchToggleLove({
                votingId: voting?._id || "",
                itemId: targetItemId,
                userIds: selectedLoveUsers,
            });
            message.success("批量点赞操作成功");
            setBatchLoveVisible(false);
            setSelectedLoveUsers([]);
            setTargetItemId(null);
            window.location.reload();
        } catch (error) {
            console.error("Batch love failed:", error);
            message.error("操作失败，请重试");
        } finally {
            setLoveSaving(false);
        }
    };

    const handleCommentClick = (itemId: string) => {
        setTargetItemId(itemId);
        setCommentModalVisible(true);
        setSelectedCommentUser([]);
        setCommentContent("");
    };

    const handleCommentSubmit = async () => {
        if (selectedCommentUser.length === 0) {
            message.warning("请选择一个用户");
            return;
        }
        if (!commentContent.trim()) {
            message.warning("请输入评论内容");
            return;
        }
        if (!targetItemId) return;

        setCommentSaving(true);
        try {
            await AdminCommentsService.postApiV1AdminComments({
                votingId: voting?._id || "",
                itemId: targetItemId,
                userId: selectedCommentUser[0],
                content: commentContent
            });
            message.success("评论发表成功");
            setCommentModalVisible(false);
            // reset logic
            setSelectedCommentUser([]);
            setCommentContent("");
            setTargetItemId(null);
            window.location.reload();
        } catch (error: any) {
            console.error("Comment failed:", error);
            const msg = error.body?.message || "操作失败";
            message.error(msg);
        } finally {
            setCommentSaving(false);
        }
    };

    const handleBatchLikeCommentClick = (commentId: string) => {
        setTargetCommentId(commentId);
        setLikeCommentModalVisible(true);
        setSelectedLikeCommentUsers([]);
    };

    const handleBatchLikeCommentSubmit = async () => {
        if (selectedLikeCommentUsers.length === 0) {
            message.warning("请选择至少一个用户");
            return;
        }
        if (!targetCommentId) return;

        setLikeCommentSaving(true);
        try {
            await AdminCommentsService.postApiV1AdminCommentsBatchLike({
                commentId: targetCommentId,
                userIds: selectedLikeCommentUsers
            });
            message.success("批量点赞评论成功");
            setLikeCommentModalVisible(false);
            setSelectedLikeCommentUsers([]);
            setTargetCommentId(null);
            window.location.reload();
        } catch (error: any) {
            console.error("Batch Like Comment failed:", error);
            message.error(error.body?.message || "操作失败");
        } finally {
            setLikeCommentSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" />
            </div>
        );
    }

    if (!voting) {
        return (
            <Card>
                <div className="text-center py-8">
                    <p>投票不存在</p>
                    <Button onClick={() => router.back()}>返回</Button>
                </div>
            </Card>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.back()}
                >
                    返回列表
                </Button>

                <Button
                    type="primary"
                    onClick={() => setBatchSaveVisible(true)}
                    className="bg-rose-500 hover:bg-rose-600 border-none"
                >
                    批量收藏
                </Button>
            </div>

            {/* Stats Summary */}
            <VotingStatsCard stats={voting.stats} />

            {/* Creator Info */}
            <VotingCreatorCard
                creator={voting.creator}
                createdBy={voting.createdBy}
                creatorAccountType={voting.creatorAccountType}
            />

            {/* Voting Info */}
            <VotingInfoCard voting={voting} />

            {/* Voting Items - Horizontal scroll layout */}
            <Card title={`投票选项 (${voting.items?.length ?? 0})`}>
                <div
                    style={{
                        display: "flex",
                        gap: 16,
                        overflowX: "auto",
                        paddingBottom: 16,
                        scrollSnapType: "x mandatory",
                    }}
                >
                    {(voting.items || []).map((item, index) => (
                        <VotingItemCard
                            key={item.itemId || index}
                            item={item}
                            votingId={voting._id}
                            onBatchLove={() => handleBatchLoveClick(item._id || item.itemId)}
                            onAddComment={() => handleCommentClick(item._id || item.itemId)}
                            onBatchLikeComment={(commentId) => handleBatchLikeCommentClick(commentId)}
                        />
                    ))}
                </div>
            </Card>

            {/* Batch Save Modal */}
            <Modal
                title="批量收藏"
                open={batchSaveVisible}
                onOk={handleBatchSave}
                onCancel={() => setBatchSaveVisible(false)}
                confirmLoading={saving}
                okText="确认收藏"
                cancelText="取消"
                width={1000}
            >
                <div className="py-4">
                    <p className="mb-4 text-gray-500">
                        请选择要对当前投票进行收藏的用户（跨页选择有效）：
                    </p>
                    <UserBatchSelector
                        value={selectedUsers}
                        onChange={(val) => setSelectedUsers(val)}
                    />
                </div>
            </Modal>

            {/* Batch Love Modal */}
            <Modal
                title="批量点赞"
                open={batchLoveVisible}
                onOk={handleBatchLoveSubmit}
                onCancel={() => setBatchLoveVisible(false)}
                confirmLoading={loveSaving}
                okText="确认点赞"
                cancelText="取消"
                width={1000}
            >
                <div className="py-4">
                    <p className="mb-4 text-gray-500">
                        请选择要对当前选项进行点赞的用户（跨页选择有效）：
                    </p>
                    <UserBatchSelector
                        value={selectedLoveUsers}
                        onChange={(val) => setSelectedLoveUsers(val)}
                    />
                </div>
            </Modal>

            {/* Comment Modal */}
            <Modal
                title="添加评论 (Admin)"
                open={commentModalVisible}
                onOk={handleCommentSubmit}
                onCancel={() => setCommentModalVisible(false)}
                confirmLoading={commentSaving}
                okText="发表评论"
                cancelText="取消"
                width={1000}
            >
                <div className="py-4 flex flex-col gap-2">
                    <div>
                        <p className="mb-2 font-medium">1. 选择用户 (单选):</p>
                        <UserBatchSelector
                            selectionType="radio"
                            value={selectedCommentUser}
                            onChange={(val) => setSelectedCommentUser(val)}
                        />
                    </div>

                    <div>
                        <p className="mb-2 font-medium">2. 输入评论内容:</p>
                        <Input.TextArea
                            rows={4}
                            placeholder="请输入评论内容..."
                            value={commentContent}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCommentContent(e.target.value)}
                        />
                        <p className="text-xs text-gray-400 mt-1">
                            提示: 提交时若该用户未点赞，系统将自动为其点赞。若已投其他选项，将报错。
                        </p>
                    </div>
                </div>
            </Modal>

            {/* Batch Like Comment Modal */}
            <Modal
                title="评论批量点赞"
                open={likeCommentModalVisible}
                onOk={handleBatchLikeCommentSubmit}
                onCancel={() => setLikeCommentModalVisible(false)}
                confirmLoading={likeCommentSaving}
                okText="确认点赞"
                cancelText="取消"
                width={1000}
            >
                <div className="py-4">
                    <p className="mb-4 text-gray-500">
                        请选择要对该评论进行点赞的用户：
                    </p>
                    <UserBatchSelector
                        value={selectedLikeCommentUsers}
                        onChange={(val) => setSelectedLikeCommentUsers(val)}
                    />
                </div>
            </Modal>
        </div>
    );
}
