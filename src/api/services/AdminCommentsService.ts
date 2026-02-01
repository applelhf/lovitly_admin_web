/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminCommentsService {
    /**
     * Get comments for a voting item (Admin)
     * Admin can list comments, optionally filtered by votingId and itemId.
     * @param votingId
     * @param itemId
     * @param page
     * @param limit
     * @returns any Comments retrieved successfully
     * @throws ApiError
     */
    public static getApiV1AdminComments(
        votingId?: string,
        itemId?: string,
        page: number = 1,
        limit: number = 50,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/admin/comments',
            query: {
                'votingId': votingId,
                'itemId': itemId,
                'page': page,
                'limit': limit,
            },
            errors: {
                401: `Not authorized`,
            },
        });
    }
    /**
     * Create a comment on behalf of a user (Admin)
     * Admin can create a comment for a user. The user MUST have already loved (voted for) the item.
     * @param requestBody
     * @returns any Comment created successfully
     * @throws ApiError
     */
    public static postApiV1AdminComments(
        requestBody: {
            votingId: string;
            itemId: string;
            content: string;
            /**
             * The user ID to impersonate
             */
            userId: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/admin/comments',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid input or User has not voted`,
                401: `Not authorized`,
                404: `Voting or Item not found`,
            },
        });
    }
    /**
     * Delete a comment (Admin)
     * Admin can delete any comment. Voting stats will be updated automatically.
     * @param id Comment ID
     * @returns any Comment deleted successfully
     * @throws ApiError
     */
    public static deleteApiV1AdminComments(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/admin/comments/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Not authorized`,
                404: `Comment not found`,
            },
        });
    }
    /**
     * Batch like a comment for multiple users (Admin)
     * Admin can make multiple users like a specific comment.
     * @param requestBody
     * @returns any Batch like completed
     * @throws ApiError
     */
    public static postApiV1AdminCommentsBatchLike(
        requestBody: {
            commentId: string;
            userIds: Array<string>;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/admin/comments/batch-like',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid input`,
                401: `Not authorized`,
                404: `Comment not found`,
            },
        });
    }
}
