import { PublicKey } from "cosmjs-types/tendermint/crypto/keys";
import { MultisigThresholdPubkey, SinglePubkey } from "./cosmjs/amino";

export type Account = {
    '@type': string;
    address: string;
    pub_key: {
        '@type': string;
        key: string;
    };
    account_number: string;
    sequence: string
}

export type Options = {
    tenant: string,
    chain: string,
    token?: string
}

export type User = {
    address: string;
    publicKey: SinglePubkey;
    mnemonic: string;
}

export type MultisigAccount = {
    address: string;
    publicKey: MultisigThresholdPubkey;
}

export interface DlpcDocument {
    amount: number;
    currency: string;
    dlpcid: string;
    originatorid: string;
    referenceid?: string;
    committee: string;
    committer: string;
    duedate: string;
    commitmentdate?: string;
    commitmentstate: string;
    dischargestate: string;
    dischargedate: string;
    applicablerules?: string;
}

export interface DLPCValidationError {
    amount: string;
    currency: string;
    dlpcid: string;
    originatorid: string;
    referenceid: string;
    committee: string;
    committer: string;
    duedate: string;
    commitmentdate: string;
    commitmentstate: string;
    dischargestate: string;
    dischargedate: string;
    applicablerules: string;
}

export interface DLPCValidationResult {
    validation: boolean,
    error: Partial<DLPCValidationError>
}

export interface Envelope {
    EventName: string;
    SenderOrg: string;
    ReceiverOrg: string;
    Metadata: string;
    ChainId: string;
    Port: string;
    ChannelID: string;
    TimeoutTimestamp: string;
}

export interface EnvelopeValidationError {
    EventName: string;
    EncryptFields: string;
    SenderOrg: string;
    ReceiverOrg: string;
    Metadata: string;
    ChainId: string;
    Port: string;
    ChannelID: string;
    TimeoutTimestamp: string;
}

export interface EnvelopeValidationResult {
    validation: boolean,
    error: Partial<EnvelopeValidationError>
}

export interface KeplrValue {
    signer: string, 
    data: string
}

export interface KeplrFee {
    gas: string,
    amount: string[]
}

export interface KeplrMsg {
    type: string,
    value: KeplrValue
}

export interface KeplrSignArbitraryDoc {
    chain_id: string, 
    account_number: string, 
    sequence: string,
    fee: KeplrFee,
    msgs: KeplrMsg[],
    memo: string
}