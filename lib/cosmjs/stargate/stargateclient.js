"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StargateClient = exports.assertIsDeliverTxFailure = exports.assertIsDeliverTxSuccess = exports.isDeliverTxSuccess = exports.isDeliverTxFailure = exports.TimeoutError = void 0;
const accounts_1 = require("./accounts");
// import { AnyNsRecord } from "node:dns";
// import {
//   AuthExtension,
//   BankExtension,
//   setupAuthExtension,
//   setupBankExtension,
//   setupStakingExtension,
//   setupTxExtension,
//   StakingExtension,
//   TxExtension,
// } from "./modules";
// import { QueryClient } from "./queryclient";
// import {
//   isSearchByHeightQuery,
//   isSearchBySentFromOrToQuery,
//   isSearchByTagsQuery,
//   SearchTxFilter,
//   SearchTxQuery,
// } from "./search";
class TimeoutError extends Error {
    constructor(message, txId) {
        super(message);
        this.txId = txId;
    }
}
exports.TimeoutError = TimeoutError;
function isDeliverTxFailure(result) {
    return !!result.code;
}
exports.isDeliverTxFailure = isDeliverTxFailure;
function isDeliverTxSuccess(result) {
    return !isDeliverTxFailure(result);
}
exports.isDeliverTxSuccess = isDeliverTxSuccess;
/**
 * Ensures the given result is a success. Throws a detailed error message otherwise.
 */
function assertIsDeliverTxSuccess(result) {
    if (isDeliverTxFailure(result)) {
        throw new Error(`Error when broadcasting tx ${result.transactionHash} at height ${result.height}. Code: ${result.code}; Raw log: ${result.rawLog}`);
    }
}
exports.assertIsDeliverTxSuccess = assertIsDeliverTxSuccess;
/**
 * Ensures the given result is a failure. Throws a detailed error message otherwise.
 */
function assertIsDeliverTxFailure(result) {
    if (isDeliverTxSuccess(result)) {
        throw new Error(`Transaction ${result.transactionHash} did not fail at height ${result.height}. Code: ${result.code}; Raw log: ${result.rawLog}`);
    }
}
exports.assertIsDeliverTxFailure = assertIsDeliverTxFailure;
class StargateClient {
    // public static async connect(
    //   endpoint: string,
    //   options: StargateClientOptions = {},
    // ): Promise<StargateClient> {
    //   const tmClient = await Tendermint34Client.connect(endpoint);
    //   return new StargateClient(tmClient, options);
    // }
    constructor(tmClient, options) {
        // if (tmClient) {
        //   this.tmClient = tmClient;
        //   this.queryClient = QueryClient.withExtensions(
        //     tmClient,
        //     setupAuthExtension,
        //     setupBankExtension,
        //     setupStakingExtension,
        //     setupTxExtension,
        //   );
        // }
        const { accountParser = accounts_1.accountFromAny } = options;
        this.accountParser = accountParser;
    }
}
exports.StargateClient = StargateClient;
