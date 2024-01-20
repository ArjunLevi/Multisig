/// <reference types="node" />
import { Options } from './types';
export declare const getAccount: (url: string, address: string, options?: Options) => Promise<any>;
export declare const getWalletBalance: (url: string, address: string, denom: string) => Promise<any>;
export declare const getAllAccountInfo: (mnemonic: string, url: string, prefix: string, options?: Options) => Promise<{
    address: string;
    privateKey: Buffer;
    publicKey: {
        type_url: string;
        value: Buffer;
    };
    account: any;
}>;
export declare const getSignerData: (url: string, address: string, options?: Options) => Promise<{
    accountNumber: number;
    sequence: number;
    chainId: string;
}>;
export declare const getSignerDataWithChain: (url: string, address: string, chain: string, options?: Options) => Promise<{
    accountNumber: number;
    sequence: number;
    chainId: string;
}>;
