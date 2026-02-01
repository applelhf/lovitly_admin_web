/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminAuthService {
    /**
     * Create a new admin (Protected)
     * @param requestBody
     * @returns any Admin created successfully
     * @throws ApiError
     */
    public static postApiV1AdminAuthCreateAdmin(
        requestBody: {
            email: string;
            password: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/admin/auth/createAdmin',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid input or admin already exists`,
                401: `Not authorized`,
            },
        });
    }
    /**
     * Login admin
     * @param requestBody
     * @returns any Login successful
     * @throws ApiError
     */
    public static postApiV1AdminAuthLogin(
        requestBody: {
            email: string;
            password: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/admin/auth/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Invalid credentials`,
            },
        });
    }
    /**
     * Get current admin
     * @returns any Admin profile
     * @throws ApiError
     */
    public static getApiV1AdminAuthMe(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/admin/auth/me',
            errors: {
                401: `Not authorized`,
            },
        });
    }
    /**
     * Update admin profile
     * @param requestBody
     * @returns any Profile updated
     * @throws ApiError
     */
    public static putApiV1AdminAuthUpdateProfile(
        requestBody?: {
            email?: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/admin/auth/updateProfile',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Not authorized`,
            },
        });
    }
    /**
     * Refresh access token using refresh token
     * @param requestBody
     * @returns any New access token generated
     * @throws ApiError
     */
    public static postApiV1AdminAuthRefresh(
        requestBody: {
            /**
             * Refresh token received from login
             */
            refreshToken: string;
        },
    ): CancelablePromise<{
        success?: boolean;
        code?: string;
        data?: {
            /**
             * New access token
             */
            token?: string;
            /**
             * Same refresh token
             */
            refreshToken?: string;
        };
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/admin/auth/refresh',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Missing refresh token`,
                401: `Invalid or expired refresh token`,
                404: `Admin not found`,
            },
        });
    }
}
