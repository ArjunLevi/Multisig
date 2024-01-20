import axios from 'axios';
import { getAddress, getECPairPriv, getPubKey } from "./address";
import { Options } from './types';

const CHAIN_ID = 'sku';

export const getAccount = async (
    url: string, 
    address: string, 
    options?: Options
) => {
    if (options) {
        const headers: { [key: string]: string; } = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };
        if (options.tenant) {
            // TODO: See if this is still valid/needed in case we deploy this within apple infrastructure
            headers['x-tenant'] = options.tenant;
        }
        if (options.chain) {
            headers['x-chain'] = options.chain;
        }
        headers['Authorization'] = `${options.token}`;
        
        //timestamp added so that not cache result
        const t = new Date().valueOf();
        const response = await axios.post(
            `${url}/api/chain/account/signer-data`,
            {address: address},
            {headers: headers}
        )
        const result = {
            account: {
                account_number: response.data.accountNumber,
                sequence: response.data.sequence,
                chainId: response.data.chainId
            }
        };
        return result;
    } else {
      // Assume it is the direct URL of the blockchain node.
      const fullUrl = `${url}/cosmos/auth/v1beta1/accounts/${address}`;
      const response = await axios.get(fullUrl);
      return response.data;
    }
};

export const getWalletBalance = async (
    url: string, 
    address: string, 
    denom: string,
) => {
      // Assume it is the direct URL of the blockchain node.
      const fullUrl = `${url}/cosmos/bank/v1beta1/balances/${address}/by_denom?denom=${denom}`;
      const response = await axios.get(fullUrl);
      return response.data;
};

export const getAllAccountInfo = async (mnemonic: string, url: string, prefix: string, options?: Options) => {
    const address = getAddress(mnemonic, prefix);
    const privateKey = getECPairPriv(mnemonic);
    const publicKey = getPubKey(privateKey);
    const accountData = await getAccount(url, address, options);
    let account = accountData;
    if (accountData && !Array.isArray(accountData) && accountData.collection) {
        account = accountData.collection.length > 0 ? accountData.collection[0].account : {};
    } else if (accountData && accountData.account) {
        account = accountData.account;
    }
    return { address, privateKey, publicKey, account};
};

// TBD: add error handling, implicit type any here 
export const getSignerData = async (
    url: string, 
    address: string, 
    options?: Options
) => {
    const accountWrapper = await getAccount(url, address, options);
    const account = accountWrapper.account;
    return {
        accountNumber: Number(account.account_number),
        sequence: Number(account.sequence),
        chainId: options?.chain || CHAIN_ID
    };
}

export const getSignerDataWithChain = async (
    url: string, 
    address: string,
    chain : string, 
    options?: Options
) => {
    const accountWrapper = await getAccount(url, address, options);
    const account = accountWrapper.account;
    return {
        accountNumber: Number(account.account_number),
        sequence: Number(account.sequence),
        chainId: chain || CHAIN_ID
    };
}