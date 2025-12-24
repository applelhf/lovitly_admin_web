/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type BonusRules = {
    enabled?: boolean;
    type?: BonusRules.type;
    winnersCount?: number;
    endsAt?: string;
};
export namespace BonusRules {
    export enum type {
        TOP_COMMENTS = 'top_comments',
        RANDOM = 'random',
        CREATOR_PICK = 'creator_pick',
    }
}

