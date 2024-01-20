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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectSecp256k1Wallet = void 0;
const amino_1 = require("../amino");
const crypto_1 = require("../crypto");
const encoding_1 = require("../encoding");
const signing_1 = require("./signing");
/**
 * A wallet that holds a single secp256k1 keypair.
 *
 * If you want to work with BIP39 mnemonics and multiple accounts, use DirectSecp256k1HdWallet.
 */
class DirectSecp256k1Wallet {
    /**
     * Creates a DirectSecp256k1Wallet from the given private key
     *
     * @param privkey The private key.
     * @param prefix The bech32 address prefix (human readable part). Defaults to "cosmos".
     */
    static fromKey(privkey, prefix = "cosmos") {
        return __awaiter(this, void 0, void 0, function* () {
            const uncompressed = (yield crypto_1.Secp256k1.makeKeypair(privkey)).pubkey;
            return new DirectSecp256k1Wallet(privkey, crypto_1.Secp256k1.compressPubkey(uncompressed), prefix);
        });
    }
    constructor(privkey, pubkey, prefix) {
        this.privkey = privkey;
        this.pubkey = pubkey;
        this.prefix = prefix;
    }
    get address() {
        return (0, encoding_1.toBech32)(this.prefix, (0, amino_1.rawSecp256k1PubkeyToRawAddress)(this.pubkey));
    }
    getAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            return [
                {
                    algo: "secp256k1",
                    address: this.address,
                    pubkey: this.pubkey,
                },
            ];
        });
    }
    signDirect(address, signDoc) {
        return __awaiter(this, void 0, void 0, function* () {
            const signBytes = (0, signing_1.makeSignBytes)(signDoc);
            if (address !== this.address) {
                throw new Error(`Address ${address} not found in wallet`);
            }
            const hashedMessage = (0, crypto_1.sha256)(signBytes);
            const signature = yield crypto_1.Secp256k1.createSignature(hashedMessage, this.privkey);
            const signatureBytes = new Uint8Array([...signature.r(32), ...signature.s(32)]);
            const stdSignature = (0, amino_1.encodeSecp256k1Signature)(this.pubkey, signatureBytes);
            return {
                signed: signDoc,
                signature: stdSignature,
            };
        });
    }
}
exports.DirectSecp256k1Wallet = DirectSecp256k1Wallet;
