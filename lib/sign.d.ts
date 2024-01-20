import { StdFee } from './cosmjs/amino';
import { SignerData, SigningStargateClient, SigningStargateClientOptions } from './cosmjs/stargate';
import { EncodeObject } from './cosmjs/proto-signing';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
export declare const directSign: (privKey: Uint8Array, signingClientOptions: SigningStargateClientOptions, { msgs, fee, memo, signerData }: {
    msgs: EncodeObject[];
    fee: StdFee;
    memo: string;
    signerData: SignerData;
}) => Promise<TxRaw>;
export declare const partialSign: (privKey: Uint8Array, signingClientOptions: SigningStargateClientOptions, { msgs, fee, memo, signerData }: {
    msgs: EncodeObject[];
    fee: StdFee;
    memo: string;
    signerData: SignerData;
}) => Promise<TxRaw>;
export declare const getSigningClient: (mnemonic: string, signingClientOptions: SigningStargateClientOptions, directOrPartial: 'direct' | 'partial') => Promise<SigningStargateClient>;
export declare const getSigningClientByPrivKey: (privKey: Uint8Array, signingClientOptions: SigningStargateClientOptions, directOrPartial: 'direct' | 'partial') => Promise<SigningStargateClient>;
export declare const getSignedTxBytes: (signedTx: TxRaw) => Uint8Array;
export declare const signMessage: (hash: string, privKey: string, encoding?: string, resultEncoding?: string) => Promise<{
    hash: string;
    publicKey: string;
    signature: string;
    recoveryId: number;
}>;
export declare const keplrSign: (conditionObj: string, signerAddress: string, privKey: string, encoding?: string, resultEncoding?: string) => Promise<{
    hash: string;
    publicKey: string;
    signature: string;
    recoveryId: number;
}>;
export declare const toHash: (message: string, encoding?: string) => Promise<string>;
