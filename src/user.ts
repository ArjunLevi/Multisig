import { generateMnemonic, getMultiAddressAndPubKeyFromPublicKeys } from "./generation";
import { getAddress, getECPairPriv, getTendermintPubKey } from './address';
import axios from 'axios';
import { MultisigAccount, User } from "./types";
import { SinglePubkey } from "./cosmjs/amino";

export const createUser = async(url: string, prefix='sku', tokens="500skus"): Promise<User>  => {
  const mnemonic = generateMnemonic();
  const address = getAddress(mnemonic, prefix);
  const privKey = getECPairPriv(mnemonic);
  const pubKey = getTendermintPubKey(privKey);
  await addTokens(address, url, tokens);
  return {
     mnemonic: mnemonic,
     address: address,
     publicKey: pubKey
  }
}

export const addTokens = async(address: string, url: string, tokens: string) => {
    // TODO: Add support for orgspace URL
    const headers: { [key: string]: string; } = {
        'Content-Type': 'application/json',
    };
    const reqBody: any = {
        'address': address,
        'coins': [tokens]
    }
    await axios.post(`${url}`, reqBody, { headers });
}


/**
 * Create multisig user account
 * 
 * @param users 
 * @param threshold 
 * @param url 
 * @param prefix 
 * @param tokens 
 * @param chainId 
 */
export const createMultisigUser = async (users: User[], threshold: number, url: string, prefix='sku', tokens='500skus', chainId='sku'): Promise<MultisigAccount> => {
    // Create multisig account and add tokens to the address

    const publicKeys: SinglePubkey[] = users.map((user) => {
        const publicKey = user.publicKey
        return publicKey;
    })

    const multiAccountInfo = await getMultiAddressAndPubKeyFromPublicKeys(publicKeys, threshold);

    await addTokens(multiAccountInfo.multiAddress, url, tokens);

    return {
        address: multiAccountInfo.multiAddress,
        publicKey: multiAccountInfo.multiPubKey
    }
}