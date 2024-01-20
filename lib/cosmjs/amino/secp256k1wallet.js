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
exports.Secp256k1Wallet = void 0;
const crypto_1 = require("../crypto");
const encoding_1 = require("../encoding");
const addresses_1 = require("./addresses");
const signature_1 = require("./signature");
const signdoc_1 = require("./signdoc");
/**
 * A wallet that holds a single secp256k1 keypair.
 *
 * If you want to work with BIP39 mnemonics and multiple accounts, use Secp256k1HdWallet.
 */
class Secp256k1Wallet {
    /**
     * Creates a Secp256k1Wallet from the given private key
     *
     * @param privkey The private key.
     * @param prefix The bech32 address prefix (human readable part). Defaults to "cosmos".
     */
    static fromKey(privkey, prefix = "cosmos") {
        return __awaiter(this, void 0, void 0, function* () {
            const uncompressed = (yield crypto_1.Secp256k1.makeKeypair(privkey)).pubkey;
            return new Secp256k1Wallet(privkey, crypto_1.Secp256k1.compressPubkey(uncompressed), prefix);
        });
    }
    constructor(privkey, pubkey, prefix) {
        this.privkey = privkey;
        this.pubkey = pubkey;
        this.prefix = prefix;
    }
    get address() {
        return (0, encoding_1.toBech32)(this.prefix, (0, addresses_1.rawSecp256k1PubkeyToRawAddress)(this.pubkey));
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
    signAmino(signerAddress, signDoc) {
        return __awaiter(this, void 0, void 0, function* () {
            if (signerAddress !== this.address) {
                throw new Error(`Address ${signerAddress} not found in wallet`);
            }
            const message = new crypto_1.Sha256((0, signdoc_1.serializeSignDoc)(signDoc)).digest();
            const signature = yield crypto_1.Secp256k1.createSignature(message, this.privkey);
            const signatureBytes = new Uint8Array([...signature.r(32), ...signature.s(32)]);
            return {
                signed: signDoc,
                signature: (0, signature_1.encodeSecp256k1Signature)(this.pubkey, signatureBytes),
            };
        });
    }
}
exports.Secp256k1Wallet = Secp256k1Wallet;
