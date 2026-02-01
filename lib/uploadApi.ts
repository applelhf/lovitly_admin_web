import { OpenAPI } from "@/src/api/core/OpenAPI";
import { request as __request } from "@/src/api/core/request";

export const uploadApi = {
    uploadImage: async (file: File | Blob): Promise<string> => {
        // Try admin upload endpoint first, fallback to generic if needed
        // Assuming /api/v1/admin/upload for consistency, but standard app uses /api/v1/upload
        // Let's try /api/v1/upload as it might be shared
        const response = await __request(OpenAPI, {
            method: "POST",
            url: "/api/v1/admin/upload", // Admin specific upload endpoint
            formData: { image: file },
            errors: {
                400: "Invalid file or request",
                500: "Server error",
            },
            // @ts-ignore - Force unset Content-Type so browser sets it with boundary for FormData
            headers: {
                "Content-Type": undefined,
            },
        }) as unknown as { success: boolean; url: string };

        return response.url;
    },
};
