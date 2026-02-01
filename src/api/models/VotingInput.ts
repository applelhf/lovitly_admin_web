/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BonusRules } from './BonusRules';
import type { VotingItem } from './VotingItem';
import type { VotingRules } from './VotingRules';
export type VotingInput = {
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
    status?: VotingInput.status;
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
    allowGuestVotes?: boolean;
    /**
     * Optional User ID (PersonalUser or BizUser) to create voting on behalf of. If provided, createdBy will be set to this user.
     */
    createUserId?: string;
};
export namespace VotingInput {
    export enum status {
        DRAFT = 'draft',
        ACTIVE = 'active',
        CLOSED = 'closed',
    }
}

