import { bech32 } from "bech32";
import bitcore from 'bitcore-lib';

type ClaimsObj = {
	Type:    string;
	Amount:  string;
	Address: string;
	Denom:   string;
}

export const stringToHex = (input: string) => {
    const buffer = Buffer.from(input, 'utf8');
    return buffer.toString('hex');
}

export const disburseMessageConstruction = (version: string, msg: string, dlpcId: string, claims: ClaimsObj[]) => {
    const versionNum = parseInt(version, 10);
    const hexVersion = versionNum.toString(16).padStart(4, "0");
    const hexMsg = stringToHex(msg)
    const claimsLength = claims.length;
    const hexClaimsLength = claimsLength.toString(16).padStart(2, "0");

    const arr: any[] = [];
    claims.forEach((obj: any) => {
        const address = bech32.decode(obj.Address);
        const amount = obj.Amount;
        arr.push(
            Buffer.from(bech32.fromWords(address.words)).toString("hex") +
            Buffer.from(amount, "utf8")
                .toString("hex")
                .padStart(16, "0")
        );
    });

    let concatenatedString = "";
    for (let i = 0; i < arr.length; i++) {
        concatenatedString += arr[i];
    }

    const messageObj = hexVersion + dlpcId + hexMsg + hexClaimsLength + concatenatedString;
    return messageObj;
}