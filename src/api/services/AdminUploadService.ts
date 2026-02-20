/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class AdminUploadService {
    /**
     * Upload an image (Admin only)
     * @param formData
     * @returns any Image uploaded successfully
     * @throws ApiError
     */
    public static postApiV1AdminUpload(
        formData: {
            image?: Blob;
        },
    ): CancelablePromise<{
        success?: boolean;
        url?: string;
    }> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/admin/upload',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Invalid file or request`,
                500: `Server error`,
            },
        });
    }
}
