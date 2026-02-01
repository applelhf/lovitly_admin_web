/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Creator information (can be User or BizUser)
 */
export type Creator = {
    /**
     * Creator's unique identifier
     */
    _id?: string;
    /**
     * Creator's display name
     */
    userName?: string;
    /**
     * Creator's avatar URL
     */
    avatar?: string;
    /**
     * Creator's bio
     */
    bio?: string;
    /**
     * Creator's account type
     */
    accountType?: Creator.accountType;
    /**
     * Company name (only present for biz/biz1 account types)
     */
    companyName?: string;
};
export namespace Creator {
    /**
     * Creator's account type
     */
    export enum accountType {
        PERSONAL = 'personal',
        PERSONAL1 = 'personal1',
        BIZ = 'biz',
        BIZ1 = 'biz1',
        ADMIN = 'admin',
    }
}

