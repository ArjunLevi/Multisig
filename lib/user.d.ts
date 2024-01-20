import { MultisigAccount, User } from "./types";
export declare const createUser: (url: string, prefix?: string, tokens?: string) => Promise<User>;
export declare const addTokens: (address: string, url: string, tokens: string) => Promise<void>;
/**
 * Create multisig user account
 *
 * @param users
 * @param threshold
 * @param url
 * @param prefix
 * @param tokens
 * @param chainId
 */
export declare const createMultisigUser: (users: User[], threshold: number, url: string, prefix?: string, tokens?: string, chainId?: string) => Promise<MultisigAccount>;
