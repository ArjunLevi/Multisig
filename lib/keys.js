"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHDKeys = void 0;
const bitcore_mnemonic_1 = __importDefault(require("bitcore-mnemonic"));
const generateHDKeys = (mnemonic, hdPath, options) => {
    let result = {};
    const bitcoreMnemonic = new bitcore_mnemonic_1.default(mnemonic);
    const hdPrivateKey = bitcoreMnemonic.toHDPrivateKey();
    const hdKeyAtPath = hdPrivateKey.deriveChild(hdPath);
    if (options.hdPrivateKey) {
        result.hdPrivateKey = hdKeyAtPath.toString();
    }
    if (options.hdPublicKey) {
        result.hdPublicKey = hdKeyAtPath.hdPublicKey.toString();
    }
    return result;
};
exports.generateHDKeys = generateHDKeys;
