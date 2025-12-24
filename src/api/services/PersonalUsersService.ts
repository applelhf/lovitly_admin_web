/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class PersonalUsersService {
    /**
     * Create a new Personal User (accountType = personal1)
     * @param requestBody
     * @returns any Personal User created successfully
     * @throws ApiError
     */
    public static postApiV1AdminPersonalUsers(
        requestBody: {
            username: string;
            email: string;
            password: string;
            avatar?: string;
            bio?: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/admin/personalUsers',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error or user already exists`,
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Get list of Personal Users with pagination and filters
     * @param page Page number
     * @param limit Number of items per page
     * @param search Search by username or email
     * @param accountType Filter by account type (returns all types if not specified)
     * @param email Filter by exact email address
     * @param sortBy Sort users by field and direction
     * @param isActive Filter by active status
     * @param isEmailVerified Filter by email verification status
     * @returns any Personal Users list retrieved successfully
     * @throws ApiError
     */
    public static getApiV1AdminPersonalUsers(
        page: number = 1,
        limit: number = 10,
        search?: string,
        accountType?: 'personal' | 'personal1' | 'biz' | 'biz1' | 'admin',
        email?: string,
        sortBy: 'username_asc' | 'username_desc' | 'email_asc' | 'email_desc' | 'createdAt_asc' | 'createdAt_desc' | 'updatedAt_asc' | 'updatedAt_desc' = 'createdAt_desc',
        isActive?: boolean,
        isEmailVerified?: boolean,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/admin/personalUsers',
            query: {
                'page': page,
                'limit': limit,
                'search': search,
                'accountType': accountType,
                'email': email,
                'sortBy': sortBy,
                'isActive': isActive,
                'isEmailVerified': isEmailVerified,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }
    /**
     * Get a specific Personal User by ID
     * @param id User ID
     * @returns any Personal User retrieved successfully
     * @throws ApiError
     */
    public static getApiV1AdminPersonalUsers1(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/admin/personalUsers/{id}',
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
     * Update a Personal User (only username, email, avatar, bio, password can be edited)
     * @param id User ID
     * @param requestBody
     * @returns any Personal User updated successfully
     * @throws ApiError
     */
    public static putApiV1AdminPersonalUsers(
        id: string,
        requestBody: {
            username?: string;
            email?: string;
            avatar?: string;
            bio?: string;
            /**
             * Optional - only if password needs to be reset
             */
            password?: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/admin/personalUsers/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error`,
                401: `Unauthorized`,
                404: `User not found or not a personal1 user`,
            },
        });
    }
    /**
     * Delete a Personal User (only accountType = personal1 can be deleted)
     * @param id User ID
     * @returns any Personal User deleted successfully
     * @throws ApiError
     */
    public static deleteApiV1AdminPersonalUsers(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/admin/personalUsers/{id}',
            path: {
                'id': id,
            },
            errors: {
                401: `Unauthorized`,
                404: `User not found or not a personal1 user`,
            },
        });
    }
}
