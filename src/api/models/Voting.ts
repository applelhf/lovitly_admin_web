/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Creator } from './Creator';
import type { VotingInput } from './VotingInput';
import type { VotingStats } from './VotingStats';
export type Voting = (VotingInput & {
    /**
     * Unique identifier for the voting
     */
    readonly id?: string;
    readonly stats?: VotingStats;
    /**
     * Creator information (populated from User or BizUser)
     */
    readonly creator?: Creator;
    /**
     * Account type of the creator (denormalized for filtering)
     */
    readonly creatorAccountType?: Voting.creatorAccountType;
    /**
     * ID of user who created the voting
     */
    readonly createdBy?: string;
    readonly createdAt?: string;
    readonly updatedAt?: string;
    /**
     * Whether the current user has saved this voting (only present when user is authenticated)
     */
    readonly isSaved?: boolean;
});
export namespace Voting {
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

