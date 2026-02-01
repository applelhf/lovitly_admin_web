/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Creator } from './Creator';
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
    /**
     * Whether bonus is enabled (derived from bonusRules.enabled)
     */
    hasBonus?: boolean;
    /**
     * Text description of the bonus/prize
     */
    bonusDescription?: string;
    creator?: Creator;
    /**
     * Account type of the creator (denormalized for filtering)
     */
    creatorAccountType?: VotingSummary.creatorAccountType;
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
    /**
     * Whether the current user has saved this voting (only present when user is authenticated)
     */
    readonly isSaved?: boolean;
    createdAt?: string;
};
export namespace VotingSummary {
    /**
     * Account type of the creator (denormalized for filtering)
     */
    export enum creatorAccountType {
        PERSONAL = 'personal',
        PERSONAL1 = 'personal1',
        BIZ = 'biz',
        BIZ1 = 'biz1',
        ADMIN = 'admin',
    }
}

