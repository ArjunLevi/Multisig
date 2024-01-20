import { DlpcDocument, DLPCValidationResult, Envelope, EnvelopeValidationResult } from "./types";
import BigNumber from 'bignumber.js';
import { crypto, HDPrivateKey, HDPublicKey } from 'bitcore-lib';
import { getMultiAddressAndPubKeyFromPublicKeys } from './generation';
import bitcore from "bitcore-lib";
import * as bech32 from "bech32";
import {ethers} from 'ethers'
import * as secp256k1 from 'secp256k1';

type GenerateDlpcSettlementWalletArgs = {
    extendedPublicKeyCommitter: string;
    extendedPublicKeyCommittee: string;
    dlpcId: string
};
  
type DlpcSettlementWallet = {
    address: string;
    extendedDlpcId: number;
    committerKey: string;
    committeeKey: string;
};

type GenerateDlpcKeysArgs = {
    extendedPublicKeyCommitter: string;
    extendedPublicKeyCommittee: string;
    dlpcId: string;
    extendedPublicKeyRas: string;
    extendedPublicKeyFinancier : string;
};
  
type DlpcKeys = {
    address: string;
    committerKey: string;
    committeeKey: string;
    rasKey: string;
    financierKey: string;
};

// TODO: Initialize this from the application instead of hardcoding here.
type DlpcRegistry = 'SKCD' | 'ETH'

type AddressOptions = {
    prefix?: string;
    registry?: DlpcRegistry;
}

function validateLEI(lei: string): boolean {
    // TODO: should verify LEI with skuchain registry
    if(lei === '') return false
    return true
}

function validateSYSTIME(systime: string): boolean {
    var ISO_8601 = new RegExp(/(\d{4}-\d{2}-\d{2})[A-Z]+(\d{2}:\d{2}:\d{2}).([0-9+-:]+)/gm);
    if (ISO_8601.test(systime)) return true
    return false
}

function validateDate(systime: string): boolean {
    const dateObj = new Date(systime)
    const today = new Date()
    if (dateObj > today) return true
    return false
}

export function validateDLPC(dlpc: DlpcDocument): DLPCValidationResult{
    let result: DLPCValidationResult = {
        validation: true,
        error: {}
    }

    // validate 'dlpcid':
    const dlpcid = dlpc.dlpcid
    const dlpcIdRegex = new RegExp("^[a-zA-Z0-9]{40}$")
    if (typeof dlpcid !== "string" || !dlpcIdRegex.test(dlpcid)) {
        result.validation = false;
        result.error.dlpcid = 'Please enter a valid dlpcId'
    }

    // validate 'commitmentstate':
    const commitmentstate = dlpc.commitmentstate
    const accpetedCommitmentState = ['INITIATED', 'CONTINGENT', 'EFFECTIVE', 'DISCHARGED']
    if (typeof commitmentstate !== "string" || accpetedCommitmentState.includes(commitmentstate) !== true) {
        result.validation = false;
        result.error.commitmentstate = 'The commitmentstate should be valid'
    }

    // validate 'amount':
    const amount = dlpc.amount
    if (typeof amount !== "number" || amount <= 0) {
        if (!(commitmentstate === 'INITIATED' && amount === undefined)) {
            result.validation = false;
            result.error.amount = 'The amount should be a positive number'
        }
    }

    const number = new BigNumber(amount);
    const fractionLength = number.decimalPlaces();
    let integerLength = number.precision(true)
    if (fractionLength) {
        integerLength = number.precision(true) - fractionLength;
    }
    if (integerLength >= 25 || (fractionLength && fractionLength >= 8)) {
        result.validation = false;
        result.error.amount = 'The amount can have 24 integer and 7 fractional number'
    }

    // validate 'currency':
    const acceptedCurrency = ['USD', 'EUR', 'GBP', 'INR', 'AUD', 'CAD', 'SGD', 'CHF', 'MYR', 'JPY', 'CNY'] // Add accepted ISO 4217 currency code
    const currency = dlpc.currency
    if (typeof currency !== "string" || acceptedCurrency.includes(currency) !== true) {
        if (amount !==  undefined) {
            result.validation = false;
            result.error.currency = 'The currency code is not accepted'
        }
    }

    // validate 'duedate':
    const duedate = dlpc.duedate
    if (typeof duedate !== "string" || !validateSYSTIME(duedate)) {
        if (duedate !== "" && duedate !== undefined) {
            result.validation = false;
            result.error.duedate = 'Please enter a valid duedate'
        }
    } else {
        if (!validateDate(duedate)) {
            result.validation = false;
            result.error.duedate = 'The duedate should be in the future'
        }
    }

    // validate 'commitmentdate':
    const commitmentdate = dlpc.commitmentdate
    if (typeof commitmentdate !== "string" || !validateSYSTIME(commitmentdate)) {
        if (commitmentdate !== "" && commitmentdate !== undefined) {
            result.validation = false;
            result.error.commitmentdate = 'Please enter a valid commitmentdate'
        }
    } else {
        if (!validateDate(commitmentdate)) {
            result.validation = false;
            result.error.commitmentdate = 'The commitmentdate should be in the future'
        }
    }

    // validate 'dischargestate':
    const dischargestate = dlpc.dischargestate
    const accpetedDischargestate = ['OPEN', 'PAID', 'PAST_DUE', 'CANCELLED']
    if (typeof dischargestate !== "string" || accpetedDischargestate.includes(dischargestate) !== true) {
        result.validation = false;
        result.error.dischargestate = 'The dischargestate should be valid'
    }

    // validate 'dischargedate':
    const dischargedate = dlpc.dischargedate
    if (typeof dischargedate !== "string" || !validateSYSTIME(dischargedate)) {
        if (dischargedate !== ""  && dischargedate !== undefined) {
            result.validation = false;
            result.error.dischargedate = 'Please enter a valid dischargedate'
        }
    } else {
        if (!validateDate(dischargedate)) {
            result.validation = false;
            result.error.dischargedate = 'The dischargedate should be in the future'
        }
    }

    // validate 'referenceid':
    const referenceid = dlpc.referenceid;
    if ( typeof referenceid !== "string") {
        if (!referenceid === undefined) {
            result.validation = false;
            result.error.referenceid = 'The referenceid is not valid'
        }
    }

    // validate 'originatorid':
    const originatorid = dlpc.originatorid;
    
    if (typeof originatorid !== "string") {
        if (!(commitmentstate === 'INITIATED' && originatorid === undefined) ) {
            result.validation = false;
            result.error.originatorid = 'The originatorid is not valid'
        }
    } else {
        if (!(validateLEI(originatorid))) {
            result.validation = false;
            result.error.originatorid = 'The originatorid is not valid'
        }
    }

    // validate 'committee':
    const committee = dlpc.committee
    
    if (typeof committee !== "string") {
        if (!(commitmentstate === 'INITIATED' && committee === undefined) ) {
            result.validation = false;
            result.error.committee = 'The committee is not valid'
        }
    } else {
        if (!(validateLEI(committee))) {
            result.validation = false;
            result.error.committee = 'The committee is not valid'
        }
    }

    // validate 'committer':
    const committer = dlpc.committer
    
    if (typeof committer !== "string") {
        if (!(commitmentstate === 'INITIATED' && committer === undefined)) {
            result.validation = false;
            result.error.committer = 'The committer is not valid'
        }
    } else {
        if (!(validateLEI(committer))) {
            result.validation = false;
            result.error.committer = 'The committer is not valid'
        }
    }
    // validate 'applicablerules':
    const applicablerules = dlpc.applicablerules 
    if (typeof applicablerules !== "string") {
        if (!applicablerules === undefined){
            result.validation = false;
            result.error.applicablerules = 'The applicablerules is not valid'
        }
    }

    return result;
}

export function validateEnvelope(envelope: Envelope): EnvelopeValidationResult {
    let result: EnvelopeValidationResult = {
        validation: true,
        error: {}
    }
    //validate 'eventName':
    const eventName = envelope.EventName
    const accpetedEventName = ['request_dlpc' ,'issue_dlpc', 'accept_dlpc', 'document_verification_request', 'document_verification_result', 'fulfill_condition', 'issue_cr', 'accept_change_status', 'disburse_dlpc'] // Add all handled events in TCP CMS
    if (typeof eventName !== "string" || accpetedEventName.includes(eventName) !== true) {
        result.validation = false;
        result.error.EventName = 'The eventName should be valid'
    }

    //validate 'senderOrg':
    const senderOrg = envelope.SenderOrg
    if(typeof senderOrg !== 'string') {
        result.validation = false;
        result.error.SenderOrg = 'The senderOrg should be valid'
    }

    //validate 'receiverOrg':
    const receiverOrg = envelope.ReceiverOrg
    if(typeof receiverOrg !== 'string') {
        result.validation = false;
        result.error.ReceiverOrg = 'The receiverOrg should be valid'
    }

    //validate 'metadata':
    const metadata = envelope.Metadata
    if(typeof metadata !== 'string') {
        result.validation = false;
        result.error.Metadata = 'The metadata should be valid'
    }

    //validate 'chainId':
    const chainId = envelope.ChainId
    if(typeof chainId !== 'string') {
        result.validation = false;
        result.error.ChainId = 'The chainId should be valid'
    }

    //validate 'port':
    const port = envelope.Port
    const accpetedPort = ['fi' ,'track', 'trade'] // Add all custom modules
    if (typeof port !== "string" || accpetedPort.includes(port) !== true) {
        result.validation = false;
        result.error.Port = 'The port should be valid'
    }

    //validate 'channelID':
    const channelID = envelope.ChannelID
    if(typeof channelID !== 'string') {
        result.validation = false;
        result.error.ChannelID = 'The channelID should be valid'
    }

    //validate 'timeoutTimestamp':
    const timeoutTimestamp = new BigNumber(envelope.TimeoutTimestamp)
    const currentTimestamp = new BigNumber(Date.now())
    const currentTimestampNano = currentTimestamp.multipliedBy(1000000)
    if (typeof timeoutTimestamp !== "number") {
        if (timeoutTimestamp.isLessThan(currentTimestampNano)) {
            result.validation = false;
            result.error.TimeoutTimestamp = 'The timeoutTimestamp should be valid and in the future.'
        }
    }

    return result;
}
const generateUserKeys = ({
    extendedPublicKeyCommitter, 
    extendedPublicKeyCommittee,
    extendedPublicKeyRas,
    extendedPublicKeyFinancier,
    dlpcId

  }: GenerateDlpcKeysArgs): DlpcKeys => {
  
    const extendedDlpcId = generateExtendedDlpcId(dlpcId);
    const committerHdKey = new HDPublicKey(extendedPublicKeyCommitter);
    const committeeHdKey = new HDPublicKey(extendedPublicKeyCommittee);
    const rasHdKey = new HDPublicKey(extendedPublicKeyRas);
    const financierHdKey = new HDPublicKey(extendedPublicKeyFinancier);
  
    const dlpcCommitterHdKey = committerHdKey.deriveChild(extendedDlpcId);
    const dlpcCommitteeHdKey = committeeHdKey.deriveChild(extendedDlpcId);
    const dlpcRasHdKey = rasHdKey.deriveChild(extendedDlpcId);
    const dlpcFinancierHdKey = financierHdKey.deriveChild(extendedDlpcId);
  
    const dlpcCommitterPublicKeyBase64 = dlpcCommitterHdKey.publicKey.toBuffer().toString('base64');
    const dlpcCommitteePublicKeyBase64 = dlpcCommitteeHdKey.publicKey.toBuffer().toString('base64');
    const dlpcRasPublicKeyBase64 = dlpcRasHdKey.publicKey.toBuffer().toString('base64');
    const dlpcFinancierPublicKeyBase64 = dlpcFinancierHdKey.publicKey.toBuffer().toString('base64');

    // The DLPC settlement wallet address is the multi account address of the committer and committee DLPC keys
    const { multiAddress: dlpcSettlementAddress } = getMultiAddressAndPubKeyFromPublicKeys([
        { type: 'tendermint/PubKeySecp256k1', value: dlpcCommitterPublicKeyBase64 },
        { type: 'tendermint/PubKeySecp256k1', value: dlpcCommitteePublicKeyBase64 }
      ]);

    return {
      address: dlpcSettlementAddress,
      committerKey: Buffer.from(dlpcCommitterPublicKeyBase64, 'base64').toString('hex'),
      committeeKey: Buffer.from(dlpcCommitteePublicKeyBase64, 'base64').toString('hex'),
      rasKey: Buffer.from(dlpcRasPublicKeyBase64, 'base64').toString('hex'),
      financierKey: Buffer.from(dlpcFinancierPublicKeyBase64, 'base64').toString('hex'),
    };
  };
  
  const generateDlpcSettlementWallet = ({
    extendedPublicKeyCommitter, 
    extendedPublicKeyCommittee,
    dlpcId
  }: GenerateDlpcSettlementWalletArgs): DlpcSettlementWallet => {
  
    const extendedDlpcId = generateExtendedDlpcId(dlpcId);
  
    const committerHdKey = new HDPublicKey(extendedPublicKeyCommitter);
    const committeeHdKey = new HDPublicKey(extendedPublicKeyCommittee);
  
    const dlpcCommitterHdKey = committerHdKey.deriveChild(extendedDlpcId);
    const dlpcCommitteeHdKey = committeeHdKey.deriveChild(extendedDlpcId);
  
    const dlpcCommitterPublicKeyBase64 = dlpcCommitterHdKey.publicKey.toBuffer().toString('base64');
    const dlpcCommitteePublicKeyBase64 = dlpcCommitteeHdKey.publicKey.toBuffer().toString('base64');
  
    // The DLPC settlement wallet address is the multi account address of the committer and committee DLPC keys
    const { multiAddress: dlpcSettlementAddress } = getMultiAddressAndPubKeyFromPublicKeys([
      { type: 'tendermint/PubKeySecp256k1', value: dlpcCommitterPublicKeyBase64 },
      { type: 'tendermint/PubKeySecp256k1', value: dlpcCommitteePublicKeyBase64 }
    ]);
  
    return {
      address: dlpcSettlementAddress,
      extendedDlpcId,
      committerKey: Buffer.from(dlpcCommitterPublicKeyBase64, 'base64').toString('hex'),
      committeeKey: Buffer.from(dlpcCommitteePublicKeyBase64, 'base64').toString('hex')
    };
  };
   
  
const generateExtendedDlpcId = (dlpcId: string): number => {

  const dlpcIdBuffer = Buffer.from(dlpcId);
  // Hash the dlpcId (an alphanumeric string) to a number between 0 and 2**31 - 1 (the maximum value for producing an unhardened path)
  const hashDlpcIdBuffer = crypto.Hash.sha256(dlpcIdBuffer);
  const hashDlpcIdHex = '0x' + hashDlpcIdBuffer.toString('hex');

  const extendedDlpcId = Number(BigInt(hashDlpcIdHex) % BigInt(2**31));
  return extendedDlpcId;
};

const deriveDlpcSigningKey = (extendedPrivateKey: string, dlpcId: string): string => {
   const extendedDlpcId = generateExtendedDlpcId(dlpcId);
   const hdKey = new HDPrivateKey(extendedPrivateKey);
   const child = hdKey.deriveChild(extendedDlpcId).toJSON() as {privateKey: string};
   hdKey.deriveChild(extendedDlpcId)
   return child.privateKey;
}

const derivePublicKey = (extendedPublicKey: string, dlpcId: string): string => {
    const extendedDlpcId = generateExtendedDlpcId(dlpcId);
    const hdKey = new HDPublicKey(extendedPublicKey);
    const child = hdKey.deriveChild(extendedDlpcId);
    return child.publicKey.toBuffer().toString('hex');
}

const getAddressForDlpc = (extendedPublicKey: string, dlpcId: string, options?: AddressOptions): { address: string, publicKey: string } => {
  const extendedDlpcId = generateExtendedDlpcId(dlpcId);

  const hdPublicKey = new HDPublicKey(extendedPublicKey);
  const childHdKey = hdPublicKey.deriveChild(extendedDlpcId);
  const publicKey = childHdKey.publicKey;
  
  let address = '';
  if (options?.registry === 'ETH') {
    const uncompressedKey = secp256k1.publicKeyConvert(publicKey.toBuffer(), false);
    address = ethers.utils.computeAddress('0x' + Buffer.from(uncompressedKey).toString('hex'));
  } else {
    const identifier = bitcore.crypto.Hash.sha256ripemd160(publicKey.toBuffer());
    const words = bech32.bech32.toWords(identifier);
    address = bech32.bech32.encode(options?.prefix || 'sku', words);
  }
 
  
  return { 
    address: address,
    publicKey: publicKey.toBuffer().toString('base64')
  };
} 

export { 
  generateDlpcSettlementWallet,
  generateUserKeys,
  deriveDlpcSigningKey,
  derivePublicKey,
  getAddressForDlpc,
  DlpcRegistry
};




