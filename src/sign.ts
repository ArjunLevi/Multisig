import { Secp256k1Wallet, StdFee } from './cosmjs/amino';
import { SignerData, SigningStargateClient, SigningStargateClientOptions } from './cosmjs/stargate';
import { DirectSecp256k1Wallet, EncodeObject } from './cosmjs/proto-signing';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { getECPairPriv } from './address';
import bitcore from 'bitcore-lib';
import secp256k1 from 'secp256k1';
import { KeplrFee, KeplrMsg, KeplrSignArbitraryDoc, KeplrValue } from './types';


// note: intend to deprecate directSign and partialSign and only use getSigningClient going forward

export const directSign = async ( 
    privKey: Uint8Array, 
    signingClientOptions: SigningStargateClientOptions, 
    { msgs, fee, memo, signerData } : {
        msgs: EncodeObject[],
        fee: StdFee,
        memo: string,
        signerData: SignerData
    }
) => {
    const wallet = await DirectSecp256k1Wallet.fromKey(privKey, signingClientOptions.prefix ?? 'cosmos');
    const address = (await wallet.getAccounts())[0].address;    
    const signingClient = await SigningStargateClient.offline(wallet, signingClientOptions);
    const signedTx = await signingClient.sign(
        address,
        msgs,
        fee,
        memo,
        signerData
    );

    return signedTx;
};

export const partialSign = async ( 
    privKey: Uint8Array, 
    signingClientOptions: SigningStargateClientOptions, 
    { msgs, fee, memo, signerData } : {
        msgs: EncodeObject[],
        fee: StdFee,
        memo: string,
        signerData: SignerData
    }
) => {
    const wallet = await Secp256k1Wallet.fromKey(privKey, signingClientOptions.prefix ?? 'cosmos');
    const address = (await wallet.getAccounts())[0].address;
    const signingClient = await SigningStargateClient.offline(wallet, signingClientOptions);
    const partiallySignedTx = await signingClient.sign(
        address,
        msgs,
        fee,
        memo,
        signerData
    );

    return partiallySignedTx;
};

export const getSigningClient = async (
    mnemonic: string,
    signingClientOptions: SigningStargateClientOptions,
    directOrPartial: 'direct' | 'partial'
): Promise<SigningStargateClient> => {
    const privKey = getECPairPriv(mnemonic);
    const wallet = (directOrPartial === 'direct') ? 
        await DirectSecp256k1Wallet.fromKey(privKey, signingClientOptions.prefix) : 
        await Secp256k1Wallet.fromKey(privKey, signingClientOptions.prefix);
    const signingClient = await SigningStargateClient.offline(wallet, signingClientOptions);
    return signingClient;
}

export const getSigningClientByPrivKey = async (
    privKey: Uint8Array,
    signingClientOptions: SigningStargateClientOptions,
    directOrPartial: 'direct' | 'partial'
): Promise<SigningStargateClient> => {
    const wallet = (directOrPartial === 'direct') ? 
        await DirectSecp256k1Wallet.fromKey(privKey, signingClientOptions.prefix) : 
        await Secp256k1Wallet.fromKey(privKey, signingClientOptions.prefix);
    const signingClient = await SigningStargateClient.offline(wallet, signingClientOptions);
    return signingClient;
}

export const getSignedTxBytes = (signedTx: TxRaw) => {
    return TxRaw.encode(signedTx).finish();
}

export const signMessage = async (hash: string, privKey: string, encoding: string = 'hex', resultEncoding: string = 'hex') => {
    const sig = secp256k1.ecdsaSign(Buffer.from(hash, 'hex'), Buffer.from(privKey, encoding as BufferEncoding));
    const publicKey = secp256k1.publicKeyCreate(Buffer.from(privKey, encoding as BufferEncoding));
    return {
        hash: hash,
        publicKey: Buffer.from(publicKey).toString(resultEncoding as BufferEncoding),
        signature: Buffer.from(sig.signature).toString(resultEncoding as BufferEncoding),
        recoveryId: sig.recid // By using this along with signature, it's possible to recover the public key
    }
}

export const keplrSign = async (conditionObj: string, signerAddress: string, privKey: string, encoding: string = 'base64', resultEncoding: string = 'base64') => {
    const buffer = Buffer.from(conditionObj, 'utf-8');
    const encodedString = buffer.toString('base64');
    const keplrValue: KeplrValue = {
        data: encodedString,
        signer: signerAddress,
    }
    const keplrMsg: KeplrMsg = {
        type: "sign/MsgSignData",
        value: keplrValue,
    }
    const keplrFee: KeplrFee = {
        amount: [],
        gas: "0",
    }
    const keplrMessage: KeplrSignArbitraryDoc = {
        account_number: "0",
        chain_id: "",
        fee: keplrFee,
        memo:"",
        msgs: [keplrMsg],
        sequence: "0",
    }
    const jsonString = JSON.stringify(keplrMessage);
    const messagehash = bitcore.crypto.Hash.sha256(Buffer.from(jsonString));
    return signMessage(messagehash.toString('hex'), Buffer.from(privKey, 'hex').toString(encoding as BufferEncoding), encoding, resultEncoding)
}

export const toHash = async (message: string, encoding: string = 'hex') => {
    const hash = bitcore.crypto.Hash.sha256(Buffer.from(message));
    return hash.toString(encoding as BufferEncoding)
}