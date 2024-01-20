import Mnemonic from "bitcore-mnemonic";
import { createMultisigThresholdPubkey, pubkeyToAddress, SinglePubkey } from './cosmjs/amino';
import { getECPairPriv } from './address';
import secp256k1 from 'secp256k1';

export const generateMnemonic = () => {
    const mnemonic = new Mnemonic(256);
    return mnemonic.toString();
  };
  

export const getMultiAddressAndPubKey = async (mnemonics: string[], threshold=mnemonics.length, prefix='sku') => {
    if (threshold > mnemonics.length) {
        throw new Error('The threshold cannot be greater than the number of accounts');
    }
    const unresolvedPrivKeys = mnemonics.map(async (m) => await getECPairPriv(m));
    const privKeys = await Promise.all(unresolvedPrivKeys);
    const pubKeys = privKeys.map((privKey) => { 
        const pubKeyArrayBuffer = secp256k1.publicKeyCreate(privKey);
        return {type: "tendermint/PubKeySecp256k1", value: Buffer.from(pubKeyArrayBuffer).toString('base64')};
    });

    const { multiPubKey, multiAddress} =  await getMultiAddressAndPubKeyFromPublicKeys(pubKeys, threshold, prefix);
    return { multiPubKey, multiAddress };
}

export const getMultiAddressAndPubKeyFromPublicKeys = (pubKeys: SinglePubkey[], threshold=pubKeys.length, prefix='sku') => {
    
    // Cosmos sdk doesn't sort the pubkeys, using nosort = true	
    const multiPubKey = createMultisigThresholdPubkey(pubKeys, threshold, true);
    const multiAddress = pubkeyToAddress(multiPubKey, prefix);

    return { multiPubKey, multiAddress };
} 
