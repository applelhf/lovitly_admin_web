/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { VotingItemSummary } from './VotingItemSummary';
import type { VotingStats } from './VotingStats';
/**
 * Simplified voting object for list views and popups
 */
export type VotingSummary = {
    id?: string;
    title?: string;
    /**
     * Truncated description for preview
     */
    description?: string;
    category?: {
        /**
         * Main category key
         */
        main?: string;
        /**
         * Subcategory key
         */
        sub?: string;
    };
    tags?: Array<string>;
    endTime?: string;
    hasBonus?: boolean;
    /**
     * Simplified list of items (just for display)
     */
    items?: Array<VotingItemSummary>;
    stats?: VotingStats;
    /**
     * User-specific data (if userId provided)
     */
    userInteraction?: {
        hasVoted?: boolean;
        votedItemId?: string;
        isSaved?: boolean;
    };
    createdAt?: string;
};

