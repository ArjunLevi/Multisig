import bitcore from "bitcore-lib";
import Mnemonic from "bitcore-mnemonic";
import * as bech32 from "bech32";
import secp256k1 from "secp256k1";
import { createHash } from 'crypto';
import * as base64 from 'base64-js';


const path = "m/44'/118'/0'/0/0";

export const getAddress = (mnemonic: string, prefix: string) : string => {
  const mn = new Mnemonic(mnemonic);
  const root = mn.toHDPrivateKey();
  const child = root.deriveChild(path);
  const hdPublicKey = new bitcore.HDPublicKey(child);
  const publicKey = hdPublicKey.publicKey;
  const identifier = bitcore.crypto.Hash.sha256ripemd160(publicKey.toBuffer());
  const words = bech32.bech32.toWords(identifier);
  return bech32.bech32.encode(prefix, words);
};


export const getAddressByPubKey = (pubKey: Buffer, prefix='sku' ) : string => {
  const identifier = bitcore.crypto.Hash.sha256ripemd160(pubKey);
  const words = bech32.bech32.toWords(identifier);
  return bech32.bech32.encode(prefix, words);
};


export const getECPairPriv = (mnemonic: string) : Buffer => {
  const mn = new Mnemonic(mnemonic);
  const root = mn.toHDPrivateKey();
  const child = root.deriveChild(path);
  return child.privateKey.toBuffer();
};

export const getPubKey = (privKey: Uint8Array) => {
  const pubKeyByte = secp256k1.publicKeyCreate(privKey);
  const buf1 = Buffer.from([10]);
  const buf2 = Buffer.from([pubKeyByte.length]);
  const buf3 = Buffer.from(pubKeyByte);
  const pubKey = Buffer.concat([buf1, buf2, buf3]);

  const pubKeyAny = {
    type_url: "/cosmos.crypto.secp256k1.PubKey",
    value: pubKey,
  };
  return pubKeyAny;
};

export const getTendermintPubKey = (privKey: Uint8Array) => {
  const pubKeyByte = secp256k1.publicKeyCreate(privKey); 
  const pubKey = {
      type: 'tendermint/PubKeySecp256k1',
      value: Buffer.from(pubKeyByte).toString('base64'),
  };
  return pubKey;
};

export const getHexAddress = (pubKey: Buffer) => {
   const address = bitcore.crypto.Hash.sha256ripemd160(pubKey);
   return address.toString('hex');
}

export const getSignerAddress = async(publicKey: string): Promise<string> => {
  try {
    // Decode the base64 public key
    const publicKeyBytes = base64.toByteArray(publicKey);

    // Compute SHA-256 hash
    const sha256Hash = createHash('sha256').update(Buffer.from(publicKeyBytes)).digest();

    // Compute RIPEMD-160 hash
    const ripemd160Hash = createHash('ripemd160').update(Buffer.from(sha256Hash)).digest();

    const words = bech32.bech32.toWords(Array.from(ripemd160Hash));

    // Convert to Bech32 address
    const bech32Addr = bech32.bech32.encode('sku', words);

    return bech32Addr;
  } catch (err) {
    throw err;
  }
}