/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Voting } from '../models/Voting';
import type { VotingSummary } from '../models/VotingSummary';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class VotingService {
    /**
     * Create a new voting
     * @param requestBody
     * @returns Voting Voting created successfully
     * @throws ApiError
     */
    public static postApiV1Votings(
        requestBody: Voting,
    ): CancelablePromise<Voting> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/votings',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid input`,
                401: `Not authorized`,
            },
        });
    }
    /**
     * Get a list of votings (Simplified for Feed/List UI)
     * Returns a list of voting cards. If userId is provided, the list is personalized (recommendations + user interaction status).
     * @param userId Optional User ID for personalized recommendations and interaction status (liked/voted)
     * @param page Page number
     * @param limit Items per page
     * @param categoryMain Filter by main category key
     * @param categorySub Filter by subcategory key
     * @param status Filter by status
     * @param sort Sort order. 'recommended' is valid only when userId is provided.
     * @returns any List of voting summaries
     * @throws ApiError
     */
    public static getApiV1Votings(
        userId?: string,
        page: number = 1,
        limit: number = 10,
        categoryMain?: string,
        categorySub?: string,
        status: 'active' | 'closed' | 'draft' | 'all' = 'active',
        sort: 'latest' | 'popular' | 'ending' | 'recommended' = 'latest',
    ): CancelablePromise<{
        data?: Array<VotingSummary>;
        pagination?: {
            page?: number;
            limit?: number;
            total?: number;
            pages?: number;
        };
    }> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/votings',
            query: {
                'userId': userId,
                'page': page,
                'limit': limit,
                'categoryMain': categoryMain,
                'categorySub': categorySub,
                'status': status,
                'sort': sort,
            },
        });
    }
    /**
     * Get a voting by ID
     * @param id Voting ID
     * @returns Voting Voting details
     * @throws ApiError
     */
    public static getApiV1Votings1(
        id: string,
    ): CancelablePromise<Voting> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/votings/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Voting not found`,
            },
        });
    }
    /**
     * Update a voting
     * @param id Voting ID
     * @param requestBody
     * @returns Voting Voting updated successfully
     * @throws ApiError
     */
    public static putApiV1Votings(
        id: string,
        requestBody: Voting,
    ): CancelablePromise<Voting> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/votings/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Not authorized`,
                403: `Not authorized to update this voting`,
                404: `Voting not found`,
            },
        });
    }
    /**
     * Delete a voting
     * @param id Voting ID
     * @returns any Voting deleted successfully
     * @throws ApiError
     */
    public static deleteApiV1Votings(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/votings/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Not authorized`,
                403: `Not authorized to delete this voting`,
                404: `Voting not found`,
            },
        });
    }
}
