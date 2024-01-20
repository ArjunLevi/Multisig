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
exports.getMultiAddressAndPubKeyFromPublicKeys = exports.getMultiAddressAndPubKey = exports.generateMnemonic = void 0;
const bitcore_mnemonic_1 = __importDefault(require("bitcore-mnemonic"));
const amino_1 = require("./cosmjs/amino");
const address_1 = require("./address");
const secp256k1_1 = __importDefault(require("secp256k1"));
const generateMnemonic = () => {
    const mnemonic = new bitcore_mnemonic_1.default(256);
    return mnemonic.toString();
};
exports.generateMnemonic = generateMnemonic;
const getMultiAddressAndPubKey = (mnemonics, threshold = mnemonics.length, prefix = 'sku') => __awaiter(void 0, void 0, void 0, function* () {
    if (threshold > mnemonics.length) {
        throw new Error('The threshold cannot be greater than the number of accounts');
    }
    const unresolvedPrivKeys = mnemonics.map((m) => __awaiter(void 0, void 0, void 0, function* () { return yield (0, address_1.getECPairPriv)(m); }));
    const privKeys = yield Promise.all(unresolvedPrivKeys);
    const pubKeys = privKeys.map((privKey) => {
        const pubKeyArrayBuffer = secp256k1_1.default.publicKeyCreate(privKey);
        return { type: "tendermint/PubKeySecp256k1", value: Buffer.from(pubKeyArrayBuffer).toString('base64') };
    });
    const { multiPubKey, multiAddress } = yield (0, exports.getMultiAddressAndPubKeyFromPublicKeys)(pubKeys, threshold, prefix);
    return { multiPubKey, multiAddress };
});
exports.getMultiAddressAndPubKey = getMultiAddressAndPubKey;
const getMultiAddressAndPubKeyFromPublicKeys = (pubKeys, threshold = pubKeys.length, prefix = 'sku') => {
    // Cosmos sdk doesn't sort the pubkeys, using nosort = true	
    const multiPubKey = (0, amino_1.createMultisigThresholdPubkey)(pubKeys, threshold, true);
    const multiAddress = (0, amino_1.pubkeyToAddress)(multiPubKey, prefix);
    return { multiPubKey, multiAddress };
};
exports.getMultiAddressAndPubKeyFromPublicKeys = getMultiAddressAndPubKeyFromPublicKeys;
