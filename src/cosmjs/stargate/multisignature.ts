import { MultisigThresholdPubkey, pubkeyToAddress, StdFee } from "../amino";
import { fromBech32 } from "../encoding";
import { encodePubkey } from "../proto-signing";
import { CompactBitArray, MultiSignature } from "cosmjs-types/cosmos/crypto/multisig/v1beta1/multisig";
import { SignMode } from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
import { AuthInfo, SignerInfo, ModeInfo } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx";
import Long from "long";

export function makeCompactBitArray(bits: readonly boolean[]): CompactBitArray {
  const byteCount = Math.ceil(bits.length / 8);
  const extraBits = bits.length - Math.floor(bits.length / 8) * 8;
  const bytes = new Uint8Array(byteCount); // zero-filled

  bits.forEach((value, index) => {
    const bytePos = Math.floor(index / 8);
    const bitPos = index % 8;
    // eslint-disable-next-line no-bitwise
    if (value) bytes[bytePos] |= 0b1 << (8 - 1 - bitPos);
  });

  return CompactBitArray.fromPartial({ elems: bytes, extraBitsStored: extraBits });
}

/**
 * Creates a signed transaction from signer info, transaction body and signatures.
 * The result can be broadcasted after serialization.
 *
 * Consider using `makeMultisignedTxBytes` instead if you want to broadcast the
 * transaction immediately.
 */
export function makeMultisignedTx(
  multisigPubkey: MultisigThresholdPubkey,
  sequence: number,
  fee: StdFee,
  bodyBytes: Uint8Array,
  signatures: Map<string, Uint8Array>,
  signerInfos?: Map<string, SignerInfo>
): TxRaw {
  if (signerInfos && signerInfos.size != signatures.size) {
     throw Error("SignerInfo and Signatures size doesn't match");
  }
  const addresses = Array.from(signatures.keys());
  const prefix = fromBech32(addresses[0]).prefix;

  const signers: boolean[] = Array(multisigPubkey.value.pubkeys.length).fill(false);
  const signaturesList = new Array<Uint8Array>();
  const modeInfosList = new Array<ModeInfo>();
  for (let i = 0; i < multisigPubkey.value.pubkeys.length; i++) {
    const signerAddress = pubkeyToAddress(multisigPubkey.value.pubkeys[i], prefix);
    const signature = signatures.get(signerAddress);
    if (signature) {
      signers[i] = true;
      signaturesList.push(signature);
      const signerInfo = signerInfos?.get(signerAddress);
      if (signerInfo?.modeInfo) {
        modeInfosList.push(signerInfo.modeInfo);
      } else {
        modeInfosList.push({ single: { mode: SignMode.SIGN_MODE_LEGACY_AMINO_JSON } });
      }
    }
  }

  const signerInfo: SignerInfo = {
    publicKey: encodePubkey(multisigPubkey),
    modeInfo: {
      multi: {
        bitarray: makeCompactBitArray(signers),
        modeInfos: modeInfosList
      },
    },
    sequence: Long.fromNumber(sequence),
  };

  const authInfo = AuthInfo.fromPartial({
    signerInfos: [signerInfo],
    fee: {
      amount: [...fee.amount],
      gasLimit: Long.fromString(fee.gas),
    },
  });

  const authInfoBytes = AuthInfo.encode(authInfo).finish();
  const signedTx = TxRaw.fromPartial({
    bodyBytes: bodyBytes,
    authInfoBytes: authInfoBytes,
    signatures: [MultiSignature.encode(MultiSignature.fromPartial({ signatures: signaturesList })).finish()],
  });
  return signedTx;
}

/**
 * Creates a signed transaction from signer info, transaction body and signatures.
 * The result can be broadcasted.
 *
 * This is a wrapper around `makeMultisignedTx` that encodes the transaction for broadcasting.
 */
export function makeMultisignedTxBytes(
  multisigPubkey: MultisigThresholdPubkey,
  sequence: number,
  fee: StdFee,
  bodyBytes: Uint8Array,
  signatures: Map<string, Uint8Array>,
  signerInfos?: Map<string, SignerInfo>
): Uint8Array {
  const signedTx = makeMultisignedTx(multisigPubkey, sequence, fee, bodyBytes, signatures, signerInfos);
  return Uint8Array.from(TxRaw.encode(signedTx).finish());
}
