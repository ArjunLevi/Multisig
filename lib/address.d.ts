/// <reference types="node" />
export declare const getAddress: (mnemonic: string, prefix: string) => string;
export declare const getAddressByPubKey: (pubKey: Buffer, prefix?: string) => string;
export declare const getECPairPriv: (mnemonic: string) => Buffer;
export declare const getPubKey: (privKey: Uint8Array) => {
    type_url: string;
    value: Buffer;
};
export declare const getTendermintPubKey: (privKey: Uint8Array) => {
    type: string;
    value: string;
};
export declare const getHexAddress: (pubKey: Buffer) => string;
export declare const getSignerAddress: (publicKey: string) => Promise<string>;
