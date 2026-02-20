/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AiUsersService {
    /**
     * Create a new AI User
     * @param requestBody
     * @returns any AI User created successfully
     * @throws ApiError
     */
    public static postApiV1AdminAiUsers(
        requestBody: {
            username: string;
            email?: string;
            password?: string;
            avatar?: string;
            bio?: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/admin/aiUsers',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error or user already exists`,
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Get list of AI Users with pagination and filters
     * @param page Page number
     * @param limit Number of items per page
     * @param search Search by username
     * @param sortBy Sort users by field and direction
     * @param isActive Filter by active status
     * @returns any AI Users list retrieved successfully
     * @throws ApiError
     */
    public static getApiV1AdminAiUsers(
        page: number = 1,
        limit: number = 10,
        search?: string,
        sortBy: 'username_asc' | 'username_desc' | 'createdAt_asc' | 'createdAt_desc' | 'updatedAt_asc' | 'updatedAt_desc' = 'createdAt_desc',
        isActive?: boolean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/admin/aiUsers',
            query: {
                'page': page,
                'limit': limit,
                'search': search,
                'sortBy': sortBy,
                'isActive': isActive,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Get a specific AI User by ID
     * @param id AI User ID
     * @returns any AI User retrieved successfully
     * @throws ApiError
     */
    public static getApiV1AdminAiUsers1(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/admin/aiUsers/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                404: `User not found`,
            },
        });
    }
    /**
     * Update an AI User
     * @param id AI User ID
     * @param requestBody
     * @returns any AI User updated successfully
     * @throws ApiError
     */
    public static putApiV1AdminAiUsers(
        id: string,
        requestBody: {
            username?: string;
            email?: string;
            avatar?: string;
            bio?: string;
            isActive?: boolean;
            /**
             * Optional
             */
            password?: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/admin/aiUsers/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                401: `Unauthorized`,
                404: `User not found`,
            },
        });
    }
    /**
     * Delete an AI User
     * @param id AI User ID
     * @returns any AI User deleted successfully
     * @throws ApiError
     */
    public static deleteApiV1AdminAiUsers(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/admin/aiUsers/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                404: `User not found`,
            },
        });
    }
}
