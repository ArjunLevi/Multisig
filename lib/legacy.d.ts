/// <reference types="node" />
import { Account } from './types';
export declare const getSign: (chainId: string, txBody: root.cosmos.tx.v1beta1.TxBody, authInfo: root.cosmos.tx.v1beta1.AuthInfo, accountNumber: string | number, privKey: Buffer) => any;
export declare const submitTransaction: (url: string, chainId: string, msgAny: root.google.protobuf.Any, { publicKey, privateKey, account }: {
    publicKey: {
        type_url: string;
        value: Buffer;
    };
    privateKey: Buffer;
    account: Account;
}, org: string | undefined, chain: string | undefined, token: string | undefined) => Promise<import("axios").AxiosResponse<any, any>>;
