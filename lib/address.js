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
exports.getSignerAddress = exports.getHexAddress = exports.getTendermintPubKey = exports.getPubKey = exports.getECPairPriv = exports.getAddressByPubKey = exports.getAddress = void 0;
const bitcore_lib_1 = __importDefault(require("bitcore-lib"));
const bitcore_mnemonic_1 = __importDefault(require("bitcore-mnemonic"));
const bech32 = __importStar(require("bech32"));
const secp256k1_1 = __importDefault(require("secp256k1"));
const crypto_1 = require("crypto");
const base64 = __importStar(require("base64-js"));
const path = "m/44'/118'/0'/0/0";
const getAddress = (mnemonic, prefix) => {
    const mn = new bitcore_mnemonic_1.default(mnemonic);
    const root = mn.toHDPrivateKey();
    const child = root.deriveChild(path);
    const hdPublicKey = new bitcore_lib_1.default.HDPublicKey(child);
    const publicKey = hdPublicKey.publicKey;
    const identifier = bitcore_lib_1.default.crypto.Hash.sha256ripemd160(publicKey.toBuffer());
    const words = bech32.bech32.toWords(identifier);
    return bech32.bech32.encode(prefix, words);
};
exports.getAddress = getAddress;
const getAddressByPubKey = (pubKey, prefix = 'sku') => {
    const identifier = bitcore_lib_1.default.crypto.Hash.sha256ripemd160(pubKey);
    const words = bech32.bech32.toWords(identifier);
    return bech32.bech32.encode(prefix, words);
};
exports.getAddressByPubKey = getAddressByPubKey;
const getECPairPriv = (mnemonic) => {
    const mn = new bitcore_mnemonic_1.default(mnemonic);
    const root = mn.toHDPrivateKey();
    const child = root.deriveChild(path);
    return child.privateKey.toBuffer();
};
exports.getECPairPriv = getECPairPriv;
const getPubKey = (privKey) => {
    const pubKeyByte = secp256k1_1.default.publicKeyCreate(privKey);
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
exports.getPubKey = getPubKey;
const getTendermintPubKey = (privKey) => {
    const pubKeyByte = secp256k1_1.default.publicKeyCreate(privKey);
    const pubKey = {
        type: 'tendermint/PubKeySecp256k1',
        value: Buffer.from(pubKeyByte).toString('base64'),
    };
    return pubKey;
};
exports.getTendermintPubKey = getTendermintPubKey;
const getHexAddress = (pubKey) => {
    const address = bitcore_lib_1.default.crypto.Hash.sha256ripemd160(pubKey);
    return address.toString('hex');
};
exports.getHexAddress = getHexAddress;
const getSignerAddress = (publicKey) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Decode the base64 public key
        const publicKeyBytes = base64.toByteArray(publicKey);
        // Compute SHA-256 hash
        const sha256Hash = (0, crypto_1.createHash)('sha256').update(Buffer.from(publicKeyBytes)).digest();
        // Compute RIPEMD-160 hash
        const ripemd160Hash = (0, crypto_1.createHash)('ripemd160').update(Buffer.from(sha256Hash)).digest();
        const words = bech32.bech32.toWords(Array.from(ripemd160Hash));
        // Convert to Bech32 address
        const bech32Addr = bech32.bech32.encode('sku', words);
        return bech32Addr;
    }
    catch (err) {
        throw err;
    }
});
exports.getSignerAddress = getSignerAddress;
