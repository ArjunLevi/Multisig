import { Coin } from "cosmjs-types/cosmos/base/v1beta1/coin";
import { SignMode } from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
import { SignDoc, SignerInfo } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { Any } from "cosmjs-types/google/protobuf/any";
/**
 * Create signer infos from the provided signers.
 *
 * This implementation does not support different signing modes for the different signers.
 */
export declare function makeSignerInfos(signers: ReadonlyArray<{
    readonly pubkey: Any;
    readonly sequence: number;
}>, signMode: SignMode): SignerInfo[];
/**
 * Creates and serializes an AuthInfo document.
 *
 * This implementation does not support different signing modes for the different signers.
 */
export declare function makeAuthInfoBytes(signers: ReadonlyArray<{
    readonly pubkey: Any;
    readonly sequence: number;
}>, feeAmount: readonly Coin[], gasLimit: number, signMode?: SignMode): Uint8Array;
export declare function makeSignDoc(bodyBytes: Uint8Array, authInfoBytes: Uint8Array, chainId: string, accountNumber: number): SignDoc;
export declare function makeSignBytes({ accountNumber, authInfoBytes, bodyBytes, chainId }: SignDoc): Uint8Array;
