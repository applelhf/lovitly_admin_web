/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Voting } from '../models/Voting';
import type { VotingInput } from '../models/VotingInput';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminVotingService {
    /**
     * Create a new voting (Admin)
     * @param requestBody
     * @returns Voting Voting created successfully
     * @throws ApiError
     */
    public static postApiV1AdminVotings(
        requestBody: VotingInput,
    ): CancelablePromise<Voting> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/admin/votings',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid input`,
                401: `Not authorized`,
            },
        });
    }
    /**
     * Get a list of votings (Admin)
     * @param page Page number
     * @param limit Items per page
     * @param categoryMain Filter by main category
     * @param categorySub Filter by subcategory
     * @param sort Sort field (e.g. -createdAt, stats.totalVotes)
     * @param isActive Filter by active status
     * @returns any List of votings
     * @throws ApiError
     */
    public static getApiV1AdminVotings(
        page: number = 1,
        limit: number = 10,
        categoryMain?: string,
        categorySub?: string,
        sort: string = '-createdAt',
        isActive?: boolean,
    ): CancelablePromise<{
        success?: boolean;
        length?: number;
        pagination?: Record<string, any>;
        data?: Array<Voting>;
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/admin/votings',
            query: {
                'page': page,
                'limit': limit,
                'categoryMain': categoryMain,
                'categorySub': categorySub,
                'sort': sort,
                'isActive': isActive,
            },
        });
    }
    /**
     * Get a voting by ID (Admin)
     * @param id Voting ID
     * @returns Voting Voting details
     * @throws ApiError
     */
    public static getApiV1AdminVotings1(
        id: string,
    ): CancelablePromise<Voting> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/admin/votings/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Voting not found`,
            },
        });
    }
    /**
     * Update a voting (Admin)
     * @param id Voting ID
     * @param requestBody
     * @returns Voting Voting updated successfully
     * @throws ApiError
     */
    public static putApiV1AdminVotings(
        id: string,
        requestBody: VotingInput,
    ): CancelablePromise<Voting> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/admin/votings/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Not authorized`,
                404: `Voting not found`,
            },
        });
    }
    /**
     * Delete a voting (Admin)
     * @param id Voting ID
     * @returns any Voting deleted successfully
     * @throws ApiError
     */
    public static deleteApiV1AdminVotings(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/admin/votings/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Not authorized`,
                404: `Voting not found`,
            },
        });
    }
    /**
     * Batch save votings for multiple users (Admin)
     * @param requestBody
     * @returns any Batch save completed
     * @throws ApiError
     */
    public static postApiV1AdminVotingsBatchToggleSave(
        requestBody: {
            votingIds: Array<string>;
            userIds: Array<string>;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/admin/votings/batch-toggle-save',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid input`,
                401: `Not authorized`,
            },
        });
    }
    /**
     * Batch unsave votings for multiple users (Admin)
     * @param requestBody
     * @returns any Batch unsave completed
     * @throws ApiError
     */
    public static postApiV1AdminVotingsBatchToggleUnsave(
        requestBody: {
            votingIds: Array<string>;
            userIds: Array<string>;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/admin/votings/batch-toggle-unsave',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid input`,
                401: `Not authorized`,
            },
        });
    }
    /**
     * Batch love voting items for multiple users (Admin)
     * @param requestBody
     * @returns any Batch love completed
     * @throws ApiError
     */
    public static postApiV1AdminVotingsBatchToggleLove(
        requestBody: {
            votingId: string;
            itemId: string;
            userIds: Array<string>;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/admin/votings/batch-toggle-love',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid input`,
                401: `Not authorized`,
            },
        });
    }
    /**
     * Batch unlove voting items for multiple users (Admin)
     * @param requestBody
     * @returns any Batch unlove completed
     * @throws ApiError
     */
    public static postApiV1AdminVotingsBatchToggleUnlove(
        requestBody: {
            votingId: string;
            itemId: string;
            userIds: Array<string>;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/admin/votings/batch-toggle-unlove',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid input`,
                401: `Not authorized`,
            },
        });
    }
}
