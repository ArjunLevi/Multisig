"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.submitTransaction = exports.getSign = void 0;
const secp256k1_1 = __importDefault(require("secp256k1"));
const bitcore_lib_1 = __importDefault(require("bitcore-lib"));
const broadcast_1 = require("./broadcast");
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const root = __importStar(require("./generated/messages.cjs"));
const getSign = (chainId, txBody, authInfo, accountNumber, privKey) => {
    const bodyBytes = root.cosmos.tx.v1beta1.TxBody.encode(txBody).finish();
    const authInfoBytes = root.cosmos.tx.v1beta1.AuthInfo.encode(authInfo).finish();
    const signDoc = new root.cosmos.tx.v1beta1.SignDoc({
        body_bytes: bodyBytes,
        auth_info_bytes: authInfoBytes,
        chain_id: chainId,
        account_number: Number(accountNumber),
    });
    const signMessage = root.cosmos.tx.v1beta1.SignDoc.encode(signDoc).finish();
    const hash = bitcore_lib_1.default.crypto.Hash.sha256(signMessage);
    const sig = secp256k1_1.default.ecdsaSign(hash, Buffer.from(privKey));
    const txRaw = new root.cosmos.tx.v1beta1.TxRaw({
        body_bytes: bodyBytes,
        auth_info_bytes: authInfoBytes,
        signatures: [sig.signature],
    });
    const txBytes = root.cosmos.tx.v1beta1.TxRaw.encode(txRaw).finish();
    return txBytes;
};
exports.getSign = getSign;
const submitTransaction = (url, chainId, msgAny, { publicKey, privateKey, account }, org, chain, token) => __awaiter(void 0, void 0, void 0, function* () {
    const txBody = new root.cosmos.tx.v1beta1.TxBody({ messages: [msgAny], memo: '' });
    const signerInfo = new root.cosmos.tx.v1beta1.SignerInfo({
        public_key: publicKey,
        mode_info: {
            single: {
                mode: root.cosmos.tx.signing.v1beta1.SignMode.SIGN_MODE_DIRECT
            },
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
    const signedTxBytes = (0, exports.getSign)(chainId, txBody, authInfo, account.account_number, privateKey);
    return yield (0, broadcast_1.broadcastTransaction)(url, signedTxBytes, org, chain, token);
});
exports.submitTransaction = submitTransaction;
