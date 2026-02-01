/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ItemStats } from './ItemStats';
export type VotingItem = {
    /**
     * Unique identifier for the item
     */
    itemId: string;
    /**
     * Name of the product or item
     */
    name: string;
    /**
     * Detailed description of the item
     */
    description?: string;
    /**
     * List of image URLs
     */
    images: Array<string>;
    /**
     * Primary image URL (defaults to first image if not provided)
     */
    primaryImageUrl?: string;
    /**
     * Key-value pairs matching the comparison parameters (e.g. {"color": "Black"})
     */
    specs?: Record<string, string>;
    readonly stats?: ItemStats;
    /**
     * Whether the current user has loved this item (only present when user is authenticated)
     */
    readonly isLoved?: boolean;
    /**
     * Whether the current user has already commented on this item (only present when user is authenticated)
     */
    readonly hasCommented?: boolean;
};

