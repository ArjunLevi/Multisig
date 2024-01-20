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
exports.toHash = exports.keplrSign = exports.signMessage = exports.getSignedTxBytes = exports.getSigningClientByPrivKey = exports.getSigningClient = exports.partialSign = exports.directSign = void 0;
const amino_1 = require("./cosmjs/amino");
const stargate_1 = require("./cosmjs/stargate");
const proto_signing_1 = require("./cosmjs/proto-signing");
const tx_1 = require("cosmjs-types/cosmos/tx/v1beta1/tx");
const address_1 = require("./address");
const bitcore_lib_1 = __importDefault(require("bitcore-lib"));
const secp256k1_1 = __importDefault(require("secp256k1"));
// note: intend to deprecate directSign and partialSign and only use getSigningClient going forward
const directSign = (privKey, signingClientOptions, { msgs, fee, memo, signerData }) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const wallet = yield proto_signing_1.DirectSecp256k1Wallet.fromKey(privKey, (_a = signingClientOptions.prefix) !== null && _a !== void 0 ? _a : 'cosmos');
    const address = (yield wallet.getAccounts())[0].address;
    const signingClient = yield stargate_1.SigningStargateClient.offline(wallet, signingClientOptions);
    const signedTx = yield signingClient.sign(address, msgs, fee, memo, signerData);
    return signedTx;
});
exports.directSign = directSign;
const partialSign = (privKey, signingClientOptions, { msgs, fee, memo, signerData }) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const wallet = yield amino_1.Secp256k1Wallet.fromKey(privKey, (_b = signingClientOptions.prefix) !== null && _b !== void 0 ? _b : 'cosmos');
    const address = (yield wallet.getAccounts())[0].address;
    const signingClient = yield stargate_1.SigningStargateClient.offline(wallet, signingClientOptions);
    const partiallySignedTx = yield signingClient.sign(address, msgs, fee, memo, signerData);
    return partiallySignedTx;
});
exports.partialSign = partialSign;
const getSigningClient = (mnemonic, signingClientOptions, directOrPartial) => __awaiter(void 0, void 0, void 0, function* () {
    const privKey = (0, address_1.getECPairPriv)(mnemonic);
    const wallet = (directOrPartial === 'direct') ?
        yield proto_signing_1.DirectSecp256k1Wallet.fromKey(privKey, signingClientOptions.prefix) :
        yield amino_1.Secp256k1Wallet.fromKey(privKey, signingClientOptions.prefix);
    const signingClient = yield stargate_1.SigningStargateClient.offline(wallet, signingClientOptions);
    return signingClient;
});
exports.getSigningClient = getSigningClient;
const getSigningClientByPrivKey = (privKey, signingClientOptions, directOrPartial) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = (directOrPartial === 'direct') ?
        yield proto_signing_1.DirectSecp256k1Wallet.fromKey(privKey, signingClientOptions.prefix) :
        yield amino_1.Secp256k1Wallet.fromKey(privKey, signingClientOptions.prefix);
    const signingClient = yield stargate_1.SigningStargateClient.offline(wallet, signingClientOptions);
    return signingClient;
});
exports.getSigningClientByPrivKey = getSigningClientByPrivKey;
const getSignedTxBytes = (signedTx) => {
    return tx_1.TxRaw.encode(signedTx).finish();
};
exports.getSignedTxBytes = getSignedTxBytes;
const signMessage = (hash, privKey, encoding = 'hex', resultEncoding = 'hex') => __awaiter(void 0, void 0, void 0, function* () {
    const sig = secp256k1_1.default.ecdsaSign(Buffer.from(hash, 'hex'), Buffer.from(privKey, encoding));
    const publicKey = secp256k1_1.default.publicKeyCreate(Buffer.from(privKey, encoding));
    return {
        hash: hash,
        publicKey: Buffer.from(publicKey).toString(resultEncoding),
        signature: Buffer.from(sig.signature).toString(resultEncoding),
        recoveryId: sig.recid // By using this along with signature, it's possible to recover the public key
    };
});
exports.signMessage = signMessage;
const keplrSign = (conditionObj, signerAddress, privKey, encoding = 'base64', resultEncoding = 'base64') => __awaiter(void 0, void 0, void 0, function* () {
    const buffer = Buffer.from(conditionObj, 'utf-8');
    const encodedString = buffer.toString('base64');
    const keplrValue = {
        data: encodedString,
        signer: signerAddress,
    };
    const keplrMsg = {
        type: "sign/MsgSignData",
        value: keplrValue,
    };
    const keplrFee = {
        amount: [],
        gas: "0",
    };
    const keplrMessage = {
        account_number: "0",
        chain_id: "",
        fee: keplrFee,
        memo: "",
        msgs: [keplrMsg],
        sequence: "0",
    };
    const jsonString = JSON.stringify(keplrMessage);
    const messagehash = bitcore_lib_1.default.crypto.Hash.sha256(Buffer.from(jsonString));
    return (0, exports.signMessage)(messagehash.toString('hex'), Buffer.from(privKey, 'hex').toString(encoding), encoding, resultEncoding);
});
exports.keplrSign = keplrSign;
const toHash = (message, encoding = 'hex') => __awaiter(void 0, void 0, void 0, function* () {
    const hash = bitcore_lib_1.default.crypto.Hash.sha256(Buffer.from(message));
    return hash.toString(encoding);
});
exports.toHash = toHash;
