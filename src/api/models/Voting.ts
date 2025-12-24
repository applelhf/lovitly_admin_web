/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BonusRules } from './BonusRules';
import type { VotingItem } from './VotingItem';
import type { VotingRules } from './VotingRules';
import type { VotingStats } from './VotingStats';
export type Voting = {
    /**
     * Unique identifier for the voting
     */
    readonly id?: string;
    /**
     * Title of the voting poll
     */
    title: string;
    /**
     * Main description/background of the voting
     */
    description?: string;
    category: {
        /**
         * Main category key (e.g. "electronics")
         */
        main: string;
        /**
         * Subcategory key (e.g. "headphones")
         */
        sub?: string;
    };
    /**
     * Tags for search and recommendation
     */
    tags?: Array<string>;
    /**
     * Start time of the voting
     */
    startTime?: string;
    /**
     * End time of the voting
     */
    endTime?: string;
    status?: Voting.status;
    /**
     * Whether reward mechanism is enabled
     */
    hasBonus?: boolean;
    /**
     * Description of the prize/bonus
     */
    bonusDescription?: string;
    bonusRules?: BonusRules;
    rules?: VotingRules;
    /**
     * Ordered list of parameter names for comparison (e.g. ["color", "material"])
     */
    parameters?: Array<string>;
    /**
     * List of items to vote on
     */
    items: Array<VotingItem>;
    readonly stats?: VotingStats;
    /**
     * ID of user who created the voting
     */
    readonly createdBy?: string;
    readonly createdAt?: string;
    readonly updatedAt?: string;
};
export namespace Voting {
    export enum status {
        DRAFT = 'draft',
        ACTIVE = 'active',
        CLOSED = 'closed',
    }
}

