import { DlpcDocument, DLPCValidationResult, Envelope, EnvelopeValidationResult } from "./types";
type GenerateDlpcSettlementWalletArgs = {
    extendedPublicKeyCommitter: string;
    extendedPublicKeyCommittee: string;
    dlpcId: string;
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
    extendedPublicKeyFinancier: string;
};
type DlpcKeys = {
    address: string;
    committerKey: string;
    committeeKey: string;
    rasKey: string;
    financierKey: string;
};
type DlpcRegistry = 'SKCD' | 'ETH';
type AddressOptions = {
    prefix?: string;
    registry?: DlpcRegistry;
};
export declare function validateDLPC(dlpc: DlpcDocument): DLPCValidationResult;
export declare function validateEnvelope(envelope: Envelope): EnvelopeValidationResult;
declare const generateUserKeys: ({ extendedPublicKeyCommitter, extendedPublicKeyCommittee, extendedPublicKeyRas, extendedPublicKeyFinancier, dlpcId }: GenerateDlpcKeysArgs) => DlpcKeys;
declare const generateDlpcSettlementWallet: ({ extendedPublicKeyCommitter, extendedPublicKeyCommittee, dlpcId }: GenerateDlpcSettlementWalletArgs) => DlpcSettlementWallet;
declare const deriveDlpcSigningKey: (extendedPrivateKey: string, dlpcId: string) => string;
declare const derivePublicKey: (extendedPublicKey: string, dlpcId: string) => string;
declare const getAddressForDlpc: (extendedPublicKey: string, dlpcId: string, options?: AddressOptions) => {
    address: string;
    publicKey: string;
};
export { generateDlpcSettlementWallet, generateUserKeys, deriveDlpcSigningKey, derivePublicKey, getAddressForDlpc, DlpcRegistry };
