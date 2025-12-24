/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Category } from '../models/Category';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class CategoriesService {
    /**
     * Get all categories
     * @param expand Expand subcategories
     * @returns Category List of categories
     * @throws ApiError
     */
    public static getApiV1AdminCategories(
        expand?: boolean,
    ): CancelablePromise<Array<Category>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/admin/categories',
            query: {
                'expand': expand,
            },
        });
    }
    /**
     * Create a new category
     * @param requestBody
     * @returns any Category created successfully
     * @throws ApiError
     */
    public static postApiV1AdminCategories(
        requestBody: Category,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/admin/categories',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Validation error or category exists`,
                401: `Not authorized`,
            },
        });
    }
    /**
     * Import or sync categories from JSON
     * Bulk create or update categories using 'key' for matching.
     * @param requestBody
     * @returns any Categories imported successfully
     * @throws ApiError
     */
    public static postApiV1AdminCategoriesImport(
        requestBody: Array<Category>,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/admin/categories/import',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Invalid JSON format`,
                401: `Not authorized (Admin only)`,
            },
        });
    }
    /**
     * Delete all categories
     * @returns any All categories deleted successfully
     * @throws ApiError
     */
    public static deleteApiV1AdminCategoriesAll(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/admin/categories/all',
            errors: {
                401: `Not authorized (Admin only)`,
            },
        });
    }
    /**
     * Get a category by key
     * @param key Category Key
     * @returns any Category details
     * @throws ApiError
     */
    public static getApiV1AdminCategories1(
        key: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/admin/categories/{key}',
            path: {
                'key': key,
            },
            errors: {
                404: `Category not found`,
            },
        });
    }
    /**
     * Update a category by key
     * @param key Category Key
     * @param requestBody
     * @returns any Category updated successfully
     * @throws ApiError
     */
    public static putApiV1AdminCategories(
        key: string,
        requestBody: Category,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/admin/categories/{key}',
            path: {
                'key': key,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                401: `Not authorized`,
                404: `Category not found`,
            },
        });
    }
    /**
     * Delete a category by key
     * @param key Category Key
     * @returns any Category deleted successfully
     * @throws ApiError
     */
    public static deleteApiV1AdminCategories(
        key: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/admin/categories/{key}',
            path: {
                'key': key,
            },
            errors: {
                401: `Not authorized`,
                404: `Category not found`,
            },
        });
    }
}
