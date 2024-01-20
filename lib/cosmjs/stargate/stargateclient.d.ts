import { MsgData } from "cosmjs-types/cosmos/base/abci/v1beta1/abci";
import { AccountParser } from "./accounts";
export declare class TimeoutError extends Error {
    readonly txId: string;
    constructor(message: string, txId: string);
}
export interface BlockHeader {
    readonly version: {
        readonly block: string;
        readonly app: string;
    };
    readonly height: number;
    readonly chainId: string;
    /** An RFC 3339 time string like e.g. '2020-02-15T10:39:10.4696305Z' */
    readonly time: string;
}
export interface Block {
    /** The ID is a hash of the block header (uppercase hex) */
    readonly id: string;
    readonly header: BlockHeader;
    /** Array of raw transactions */
    readonly txs: readonly Uint8Array[];
}
/** A transaction that is indexed as part of the transaction history */
export interface IndexedTx {
    readonly height: number;
    /** Transaction hash (might be used as transaction ID). Guaranteed to be non-empty upper-case hex */
    readonly hash: string;
    /** Transaction execution error code. 0 on success. */
    readonly code: number;
    readonly rawLog: string;
    /**
     * Raw transaction bytes stored in Tendermint.
     *
     * If you hash this, you get the transaction hash (= transaction ID):
     *
     * ```js
     * import { sha256 } from "@cosmjs/crypto";
     * import { toHex } from "@cosmjs/encoding";
     *
     * const transactionId = toHex(sha256(indexTx.tx)).toUpperCase();
     * ```
     *
     * Use `decodeTxRaw` from @cosmjs/proto-signing to decode this.
     */
    readonly tx: Uint8Array;
    readonly gasUsed: number;
    readonly gasWanted: number;
}
export interface SequenceResponse {
    readonly accountNumber: number;
    readonly sequence: number;
}
/**
 * The response after successfully broadcasting a transaction.
 * Success or failure refer to the execution result.
 */
export interface DeliverTxResponse {
    readonly height: number;
    /** Error code. The transaction suceeded iff code is 0. */
    readonly code: number;
    readonly transactionHash: string;
    readonly rawLog?: string;
    readonly data?: readonly MsgData[];
    readonly gasUsed: number;
    readonly gasWanted: number;
}
export declare function isDeliverTxFailure(result: DeliverTxResponse): boolean;
export declare function isDeliverTxSuccess(result: DeliverTxResponse): boolean;
/**
 * Ensures the given result is a success. Throws a detailed error message otherwise.
 */
export declare function assertIsDeliverTxSuccess(result: DeliverTxResponse): void;
/**
 * Ensures the given result is a failure. Throws a detailed error message otherwise.
 */
export declare function assertIsDeliverTxFailure(result: DeliverTxResponse): void;
/** Use for testing only */
export interface PrivateStargateClient {
    readonly tmClient: undefined;
}
export interface StargateClientOptions {
    readonly accountParser?: AccountParser;
}
export declare class StargateClient {
    private readonly tmClient;
    private readonly queryClient;
    private chainId;
    private readonly accountParser;
    protected constructor(tmClient: undefined, options: any);
}
