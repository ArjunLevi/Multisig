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
exports.SigningStargateClient = exports.defaultRegistryTypes = void 0;
const amino_1 = require("../amino");
const encoding_1 = require("../encoding");
const math_1 = require("../math");
const proto_signing_1 = require("../proto-signing");
const utils_1 = require("../utils");
const coin_1 = require("cosmjs-types/cosmos/base/v1beta1/coin");
const signing_1 = require("cosmjs-types/cosmos/tx/signing/v1beta1/signing");
const tx_1 = require("cosmjs-types/cosmos/tx/v1beta1/tx");
const aminotypes_1 = require("./aminotypes");
const modules_1 = require("./modules");
const modules_2 = require("./modules");
const stargateclient_1 = require("./stargateclient");
exports.defaultRegistryTypes = [
    ["/cosmos.base.v1beta1.Coin", coin_1.Coin],
    ...modules_1.authzTypes,
    ...modules_1.bankTypes,
    ...modules_1.distributionTypes,
    ...modules_1.feegrantTypes,
    ...modules_1.govTypes,
    ...modules_1.stakingTypes,
    ...modules_1.ibcTypes,
    ...modules_1.vestingTypes,
];
function createDefaultRegistry() {
    return new proto_signing_1.Registry(exports.defaultRegistryTypes);
}
function createDefaultTypes(prefix) {
    return Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, (0, modules_2.createAuthzAminoConverters)()), (0, modules_2.createBankAminoConverters)()), (0, modules_2.createDistributionAminoConverters)()), (0, modules_2.createGovAminoConverters)()), (0, modules_2.createStakingAminoConverters)(prefix)), (0, modules_2.createIbcAminoConverters)()), (0, modules_2.createFreegrantAminoConverters)()), (0, modules_2.createVestingAminoConverters)());
}
class SigningStargateClient extends stargateclient_1.StargateClient {
    /**
     * Creates a client in offline mode.
     *
     * This should only be used in niche cases where you know exactly what you're doing,
     * e.g. when building an offline signing application.
     *
     * When you try to use online functionality with such a signer, an
     * exception will be raised.
     */
    static offline(signer, options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return new SigningStargateClient(undefined, signer, options);
        });
    }
    constructor(tmClient, signer, options) {
        var _a;
        super(tmClient, options);
        // TODO: do we really want to set a default here? Ideally we could get it from the signer such that users only have to set it once.
        const prefix = (_a = options.prefix) !== null && _a !== void 0 ? _a : "cosmos";
        const { registry = createDefaultRegistry(), aminoTypes = new aminotypes_1.AminoTypes(createDefaultTypes(prefix)) } = options;
        this.registry = registry;
        this.aminoTypes = aminoTypes;
        this.signer = signer;
        this.broadcastTimeoutMs = options.broadcastTimeoutMs;
        this.broadcastPollIntervalMs = options.broadcastPollIntervalMs;
        this.gasPrice = options.gasPrice;
    }
    // public async simulate(
    //   signerAddress: string,
    //   messages: readonly EncodeObject[],
    //   memo: string | undefined,
    // ): Promise<number> {
    //   const anyMsgs = messages.map((m) => this.registry.encodeAsAny(m));
    //   const accountFromSigner = (await this.signer.getAccounts()).find(
    //     (account) => account.address === signerAddress,
    //   );
    //   if (!accountFromSigner) {
    //     throw new Error("Failed to retrieve account from signer");
    //   }
    //   const pubkey = encodeSecp256k1Pubkey(accountFromSigner.pubkey);
    //   const { sequence } = await this.getSequence(signerAddress);
    //   const { gasInfo } = await this.forceGetQueryClient().tx.simulate(anyMsgs, memo, pubkey, sequence);
    //   assertDefined(gasInfo);
    //   return Uint53.fromString(gasInfo.gasUsed.toString()).toNumber();
    // }
    // public async sendTokens(
    //   senderAddress: string,
    //   recipientAddress: string,
    //   amount: readonly Coin[],
    //   fee: StdFee | "auto" | number,
    //   memo = "",
    // ): Promise<DeliverTxResponse> {
    //   const sendMsg: MsgSendEncodeObject = {
    //     typeUrl: "/cosmos.bank.v1beta1.MsgSend",
    //     value: {
    //       fromAddress: senderAddress,
    //       toAddress: recipientAddress,
    //       amount: [...amount],
    //     },
    //   };
    //   return this.signAndBroadcast(senderAddress, [sendMsg], fee, memo);
    // }
    // public async delegateTokens(
    //   delegatorAddress: string,
    //   validatorAddress: string,
    //   amount: Coin,
    //   fee: StdFee | "auto" | number,
    //   memo = "",
    // ): Promise<DeliverTxResponse> {
    //   const delegateMsg: MsgDelegateEncodeObject = {
    //     typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
    //     value: MsgDelegate.fromPartial({
    //       delegatorAddress: delegatorAddress,
    //       validatorAddress: validatorAddress,
    //       amount: amount,
    //     }),
    //   };
    //   return this.signAndBroadcast(delegatorAddress, [delegateMsg], fee, memo);
    // }
    // public async undelegateTokens(
    //   delegatorAddress: string,
    //   validatorAddress: string,
    //   amount: Coin,
    //   fee: StdFee | "auto" | number,
    //   memo = "",
    // ): Promise<DeliverTxResponse> {
    //   const undelegateMsg: MsgUndelegateEncodeObject = {
    //     typeUrl: "/cosmos.staking.v1beta1.MsgUndelegate",
    //     value: MsgUndelegate.fromPartial({
    //       delegatorAddress: delegatorAddress,
    //       validatorAddress: validatorAddress,
    //       amount: amount,
    //     }),
    //   };
    //   return this.signAndBroadcast(delegatorAddress, [undelegateMsg], fee, memo);
    // }
    // public async withdrawRewards(
    //   delegatorAddress: string,
    //   validatorAddress: string,
    //   fee: StdFee | "auto" | number,
    //   memo = "",
    // ): Promise<DeliverTxResponse> {
    //   const withdrawMsg: MsgWithdrawDelegatorRewardEncodeObject = {
    //     typeUrl: "/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward",
    //     value: MsgWithdrawDelegatorReward.fromPartial({
    //       delegatorAddress: delegatorAddress,
    //       validatorAddress: validatorAddress,
    //     }),
    //   };
    //   return this.signAndBroadcast(delegatorAddress, [withdrawMsg], fee, memo);
    // }
    // public async sendIbcTokens(
    //   senderAddress: string,
    //   recipientAddress: string,
    //   transferAmount: Coin,
    //   sourcePort: string,
    //   sourceChannel: string,
    //   timeoutHeight: Height | undefined,
    //   /** timeout in seconds */
    //   timeoutTimestamp: number | undefined,
    //   fee: StdFee | "auto" | number,
    //   memo = "",
    // ): Promise<DeliverTxResponse> {
    //   const timeoutTimestampNanoseconds = timeoutTimestamp
    //     ? Long.fromNumber(timeoutTimestamp).multiply(1_000_000_000)
    //     : undefined;
    //   const transferMsg: MsgTransferEncodeObject = {
    //     typeUrl: "/ibc.applications.transfer.v1.MsgTransfer",
    //     value: MsgTransfer.fromPartial({
    //       sourcePort: sourcePort,
    //       sourceChannel: sourceChannel,
    //       sender: senderAddress,
    //       receiver: recipientAddress,
    //       token: transferAmount,
    //       timeoutHeight: timeoutHeight,
    //       timeoutTimestamp: timeoutTimestampNanoseconds,
    //     }),
    //   };
    //   return this.signAndBroadcast(senderAddress, [transferMsg], fee, memo);
    // }
    // public async signAndBroadcast(
    //   signerAddress: string,
    //   messages: readonly EncodeObject[],
    //   fee: StdFee | "auto" | number,
    //   memo = "",
    // ): Promise<DeliverTxResponse> {
    //   let usedFee: StdFee;
    //   if (fee == "auto" || typeof fee === "number") {
    //     assertDefined(this.gasPrice, "Gas price must be set in the client options when auto gas is used.");
    //     const gasEstimation = await this.simulate(signerAddress, messages, memo);
    //     const multiplier = typeof fee === "number" ? fee : 1.3;
    //     usedFee = calculateFee(Math.round(gasEstimation * multiplier), this.gasPrice);
    //   } else {
    //     usedFee = fee;
    //   }
    //   const txRaw = await this.sign(signerAddress, messages, usedFee, memo);
    //   const txBytes = TxRaw.encode(txRaw).finish();
    //   return this.broadcastTx(txBytes, this.broadcastTimeoutMs, this.broadcastPollIntervalMs);
    // }
    /**
     * Gets account number and sequence from the API, creates a sign doc,
     * creates a single signature and assembles the signed transaction.
     *
     * The sign mode (SIGN_MODE_DIRECT or SIGN_MODE_LEGACY_AMINO_JSON) is determined by this client's signer.
     *
     * You can pass signer data (account number, sequence and chain ID) explicitly instead of querying them
     * from the chain. This is needed when signing for a multisig account, but it also allows for offline signing
     * (See the SigningStargateClient.offline constructor).
     */
    sign(signerAddress, messages, fee, memo, explicitSignerData) {
        return __awaiter(this, void 0, void 0, function* () {
            let signerData;
            if (explicitSignerData) {
                signerData = explicitSignerData;
            }
            else {
                throw Error('signing in online mode is not allowed; explicit signer data needed');
                // const { accountNumber, sequence } = await this.getSequence(signerAddress);
                // const chainId = await this.getChainId();
                // signerData = {
                //   accountNumber: accountNumber,
                //   sequence: sequence,
                //   chainId: chainId,
                // };
            }
            return (0, proto_signing_1.isOfflineDirectSigner)(this.signer)
                ? this.signDirect(signerAddress, messages, fee, memo, signerData)
                : this.signAmino(signerAddress, messages, fee, memo, signerData);
        });
    }
    signAmino(signerAddress, messages, fee, memo, { accountNumber, sequence, chainId }) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, utils_1.assert)(!(0, proto_signing_1.isOfflineDirectSigner)(this.signer));
            const accountFromSigner = (yield this.signer.getAccounts()).find((account) => account.address === signerAddress);
            if (!accountFromSigner) {
                throw new Error("Failed to retrieve account from signer");
            }
            const pubkey = (0, proto_signing_1.encodePubkey)((0, amino_1.encodeSecp256k1Pubkey)(accountFromSigner.pubkey));
            const signMode = signing_1.SignMode.SIGN_MODE_LEGACY_AMINO_JSON;
            const msgs = messages.map((msg) => this.aminoTypes.toAmino(msg));
            const signDoc = (0, amino_1.makeSignDoc)(msgs, fee, chainId, memo, accountNumber, sequence);
            const { signature, signed } = yield this.signer.signAmino(signerAddress, signDoc);
            const signedTxBody = {
                messages: signed.msgs.map((msg) => this.aminoTypes.fromAmino(msg)),
                memo: signed.memo,
            };
            const signedTxBodyEncodeObject = {
                typeUrl: "/cosmos.tx.v1beta1.TxBody",
                value: signedTxBody,
            };
            const signedTxBodyBytes = this.registry.encode(signedTxBodyEncodeObject);
            const signedGasLimit = math_1.Int53.fromString(signed.fee.gas).toNumber();
            const signedSequence = math_1.Int53.fromString(signed.sequence).toNumber();
            const signedAuthInfoBytes = (0, proto_signing_1.makeAuthInfoBytes)([{ pubkey, sequence: signedSequence }], signed.fee.amount, signedGasLimit, signMode);
            return tx_1.TxRaw.fromPartial({
                bodyBytes: signedTxBodyBytes,
                authInfoBytes: signedAuthInfoBytes,
                signatures: [(0, encoding_1.fromBase64)(signature.signature)],
            });
        });
    }
    signDirect(signerAddress, messages, fee, memo, { accountNumber, sequence, chainId }) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, utils_1.assert)((0, proto_signing_1.isOfflineDirectSigner)(this.signer));
            const accountFromSigner = (yield this.signer.getAccounts()).find((account) => account.address === signerAddress);
            if (!accountFromSigner) {
                throw new Error("Failed to retrieve account from signer");
            }
            const pubkey = (0, proto_signing_1.encodePubkey)((0, amino_1.encodeSecp256k1Pubkey)(accountFromSigner.pubkey));
            const txBodyEncodeObject = {
                typeUrl: "/cosmos.tx.v1beta1.TxBody",
                value: {
                    messages: messages,
                    memo: memo,
                },
            };
            const txBodyBytes = this.registry.encode(txBodyEncodeObject);
            const gasLimit = math_1.Int53.fromString(fee.gas).toNumber();
            const authInfoBytes = (0, proto_signing_1.makeAuthInfoBytes)([{ pubkey, sequence }], fee.amount, gasLimit);
            const signDoc = (0, proto_signing_1.makeSignDoc)(txBodyBytes, authInfoBytes, chainId, accountNumber);
            const { signature, signed } = yield this.signer.signDirect(signerAddress, signDoc);
            return tx_1.TxRaw.fromPartial({
                bodyBytes: signed.bodyBytes,
                authInfoBytes: signed.authInfoBytes,
                signatures: [(0, encoding_1.fromBase64)(signature.signature)],
            });
        });
    }
}
exports.SigningStargateClient = SigningStargateClient;
