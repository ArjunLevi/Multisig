import { SinglePubkey } from './cosmjs/amino';
export declare const generateMnemonic: () => any;
export declare const getMultiAddressAndPubKey: (mnemonics: string[], threshold?: number, prefix?: string) => Promise<{
    multiPubKey: import("./cosmjs/amino").MultisigThresholdPubkey;
    multiAddress: string;
}>;
export declare const getMultiAddressAndPubKeyFromPublicKeys: (pubKeys: SinglePubkey[], threshold?: number, prefix?: string) => {
    multiPubKey: import("./cosmjs/amino").MultisigThresholdPubkey;
    multiAddress: string;
};
