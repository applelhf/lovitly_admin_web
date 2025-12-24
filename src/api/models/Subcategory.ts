/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Subcategory = {
    /**
     * Public unique identifier (slug)
     */
    key: string;
    /**
     * Display name
     */
    name: string;
    /**
     * Key of the parent MainCategory
     */
    parentKey: string;
    order?: number;
    isActive?: boolean;
};

