/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type VotingItemSummary = {
    itemId?: string;
    name?: string;
    primaryImageUrl?: string;
    stats?: {
        /**
         * Number of votes for this item
         */
        votes?: number;
        votePercent?: number;
        /**
         * Total votes for the entire voting
         */
        totalVotes?: number;
    };
};

