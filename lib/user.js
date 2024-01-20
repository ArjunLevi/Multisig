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
exports.createMultisigUser = exports.addTokens = exports.createUser = void 0;
const generation_1 = require("./generation");
const address_1 = require("./address");
const axios_1 = __importDefault(require("axios"));
const createUser = (url, prefix = 'sku', tokens = "500skus") => __awaiter(void 0, void 0, void 0, function* () {
    const mnemonic = (0, generation_1.generateMnemonic)();
    const address = (0, address_1.getAddress)(mnemonic, prefix);
    const privKey = (0, address_1.getECPairPriv)(mnemonic);
    const pubKey = (0, address_1.getTendermintPubKey)(privKey);
    yield (0, exports.addTokens)(address, url, tokens);
    return {
        mnemonic: mnemonic,
        address: address,
        publicKey: pubKey
    };
});
exports.createUser = createUser;
const addTokens = (address, url, tokens) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO: Add support for orgspace URL
    const headers = {
        'Content-Type': 'application/json',
    };
    const reqBody = {
        'address': address,
        'coins': [tokens]
    };
    yield axios_1.default.post(`${url}`, reqBody, { headers });
});
exports.addTokens = addTokens;
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
const createMultisigUser = (users, threshold, url, prefix = 'sku', tokens = '500skus', chainId = 'sku') => __awaiter(void 0, void 0, void 0, function* () {
    // Create multisig account and add tokens to the address
    const publicKeys = users.map((user) => {
        const publicKey = user.publicKey;
        return publicKey;
    });
    const multiAccountInfo = yield (0, generation_1.getMultiAddressAndPubKeyFromPublicKeys)(publicKeys, threshold);
    yield (0, exports.addTokens)(multiAccountInfo.multiAddress, url, tokens);
    return {
        address: multiAccountInfo.multiAddress,
        publicKey: multiAccountInfo.multiPubKey
    };
});
exports.createMultisigUser = createMultisigUser;
