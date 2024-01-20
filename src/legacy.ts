import secp256k1 from 'secp256k1';
import bitcore from 'bitcore-lib';
import { broadcastTransaction } from './broadcast';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as root from './generated/messages.cjs';
import { Account } from './types';


export const getSign = (
    chainId: string, 
    txBody: root.cosmos.tx.v1beta1.TxBody, 
    authInfo: root.cosmos.tx.v1beta1.AuthInfo, 
    accountNumber: string | number, 
    privKey: Buffer
) => {
    const bodyBytes = root.cosmos.tx.v1beta1.TxBody.encode(txBody).finish();
    const authInfoBytes = root.cosmos.tx.v1beta1.AuthInfo.encode(authInfo).finish();
    const signDoc = new root.cosmos.tx.v1beta1.SignDoc({
      body_bytes: bodyBytes,
      auth_info_bytes: authInfoBytes,
      chain_id: chainId,
      account_number: Number(accountNumber),
    });
    const signMessage = root.cosmos.tx.v1beta1.SignDoc.encode(signDoc).finish();
    const hash = bitcore.crypto.Hash.sha256(signMessage);
    const sig = secp256k1.ecdsaSign(hash, Buffer.from(privKey));
    const txRaw = new root.cosmos.tx.v1beta1.TxRaw({
      body_bytes: bodyBytes,
      auth_info_bytes: authInfoBytes,
      signatures: [sig.signature],
    });
    const txBytes = root.cosmos.tx.v1beta1.TxRaw.encode(txRaw).finish();
    return txBytes;
};

export const submitTransaction = async (
    url: string,
    chainId: string,
    msgAny: root.google.protobuf.Any,
    { publicKey, privateKey, account } : { 
        publicKey: {
            type_url: string,
            value: Buffer
        }, 
        privateKey: Buffer, 
        account: Account
    },
    org: string | undefined,
    chain: string | undefined,
    token: string | undefined
  ) => {
    const txBody = new root.cosmos.tx.v1beta1.TxBody({ messages: [msgAny], memo: '' });
  
    const signerInfo = new root.cosmos.tx.v1beta1.SignerInfo({
        public_key: publicKey,
        mode_info: {
        single: { 
            mode: root.cosmos.tx.signing.v1beta1.SignMode.SIGN_MODE_DIRECT },
        },
        sequence: account.sequence,
    });
    const feeValue = new root.cosmos.tx.v1beta1.Fee({
        amount: [{ denom: 'umuon', amount: String(0) }],
        gas_limit: 200000,
    });
    const authInfo = new root.cosmos.tx.v1beta1.AuthInfo({
        signer_infos: [signerInfo],
        fee: feeValue,
    });
  
    const signedTxBytes = getSign(
        chainId,
        txBody,
        authInfo,
        account.account_number,
        privateKey,
    );
    return await broadcastTransaction(url, signedTxBytes, org, chain, token);
};
  
