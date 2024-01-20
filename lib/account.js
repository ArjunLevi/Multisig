"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignerDataWithChain = exports.getSignerData = exports.getAllAccountInfo = exports.getWalletBalance = exports.getAccount = void 0;
const axios_1 = __importDefault(require("axios"));
const address_1 = require("./address");
const CHAIN_ID = 'sku';
const getAccount = (url, address, options) => __awaiter(void 0, void 0, void 0, function* () {
    if (options) {
        const headers = {
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
        const response = yield axios_1.default.post(`${url}/api/chain/account/signer-data`, { address: address }, { headers: headers });
        const result = {
            account: {
                account_number: response.data.accountNumber,
                sequence: response.data.sequence,
                chainId: response.data.chainId
            }
        };
        return result;
    }
    else {
        // Assume it is the direct URL of the blockchain node.
        const fullUrl = `${url}/cosmos/auth/v1beta1/accounts/${address}`;
        const response = yield axios_1.default.get(fullUrl);
        return response.data;
    }
});
exports.getAccount = getAccount;
const getWalletBalance = (url, address, denom) => __awaiter(void 0, void 0, void 0, function* () {
    // Assume it is the direct URL of the blockchain node.
    const fullUrl = `${url}/cosmos/bank/v1beta1/balances/${address}/by_denom?denom=${denom}`;
    const response = yield axios_1.default.get(fullUrl);
    return response.data;
});
exports.getWalletBalance = getWalletBalance;
const getAllAccountInfo = (mnemonic, url, prefix, options) => __awaiter(void 0, void 0, void 0, function* () {
    const address = (0, address_1.getAddress)(mnemonic, prefix);
    const privateKey = (0, address_1.getECPairPriv)(mnemonic);
    const publicKey = (0, address_1.getPubKey)(privateKey);
    const accountData = yield (0, exports.getAccount)(url, address, options);
    let account = accountData;
    if (accountData && !Array.isArray(accountData) && accountData.collection) {
        account = accountData.collection.length > 0 ? accountData.collection[0].account : {};
    }
    else if (accountData && accountData.account) {
        account = accountData.account;
    }
    return { address, privateKey, publicKey, account };
});
exports.getAllAccountInfo = getAllAccountInfo;
// TBD: add error handling, implicit type any here 
const getSignerData = (url, address, options) => __awaiter(void 0, void 0, void 0, function* () {
    const accountWrapper = yield (0, exports.getAccount)(url, address, options);
    const account = accountWrapper.account;
    return {
        accountNumber: Number(account.account_number),
        sequence: Number(account.sequence),
        chainId: (options === null || options === void 0 ? void 0 : options.chain) || CHAIN_ID
    };
});
exports.getSignerData = getSignerData;
const getSignerDataWithChain = (url, address, chain, options) => __awaiter(void 0, void 0, void 0, function* () {
    const accountWrapper = yield (0, exports.getAccount)(url, address, options);
    const account = accountWrapper.account;
    return {
        accountNumber: Number(account.account_number),
        sequence: Number(account.sequence),
        chainId: chain || CHAIN_ID
    };
});
exports.getSignerDataWithChain = getSignerDataWithChain;
