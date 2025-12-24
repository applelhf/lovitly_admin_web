/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Subcategory } from './Subcategory';
export type Category = {
    /**
     * Public unique identifier (slug)
     */
    key: string;
    /**
     * Display name
     */
    name: string;
    order?: number;
    isActive?: boolean;
    subcategories?: Array<Subcategory>;
};

