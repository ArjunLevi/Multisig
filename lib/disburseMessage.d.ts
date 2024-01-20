type ClaimsObj = {
    Type: string;
    Amount: string;
    Address: string;
    Denom: string;
};
export declare const stringToHex: (input: string) => string;
export declare const disburseMessageConstruction: (version: string, msg: string, dlpcId: string, claims: ClaimsObj[]) => string;
export {};
