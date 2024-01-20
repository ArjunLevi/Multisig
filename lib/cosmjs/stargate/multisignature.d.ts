import { MultisigThresholdPubkey, StdFee } from "../amino";
import { CompactBitArray } from "cosmjs-types/cosmos/crypto/multisig/v1beta1/multisig";
import { SignerInfo } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
export declare function makeCompactBitArray(bits: readonly boolean[]): CompactBitArray;
/**
 * Creates a signed transaction from signer info, transaction body and signatures.
 * The result can be broadcasted after serialization.
 *
 * Consider using `makeMultisignedTxBytes` instead if you want to broadcast the
 * transaction immediately.
 */
export declare function makeMultisignedTx(multisigPubkey: MultisigThresholdPubkey, sequence: number, fee: StdFee, bodyBytes: Uint8Array, signatures: Map<string, Uint8Array>, signerInfos?: Map<string, SignerInfo>): TxRaw;
/**
 * Creates a signed transaction from signer info, transaction body and signatures.
 * The result can be broadcasted.
 *
 * This is a wrapper around `makeMultisignedTx` that encodes the transaction for broadcasting.
 */
export declare function makeMultisignedTxBytes(multisigPubkey: MultisigThresholdPubkey, sequence: number, fee: StdFee, bodyBytes: Uint8Array, signatures: Map<string, Uint8Array>, signerInfos?: Map<string, SignerInfo>): Uint8Array;
