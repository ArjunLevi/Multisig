export type HDKeys = {
    hdPrivateKey?: string;
    hdPublicKey?: string;
};
export declare const generateHDKeys: (mnemonic: string, hdPath: string, options: {
    hdPrivateKey?: boolean;
    hdPublicKey?: boolean;
}) => HDKeys;
