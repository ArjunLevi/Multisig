"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disburseMessageConstruction = exports.stringToHex = void 0;
const bech32_1 = require("bech32");
const stringToHex = (input) => {
    const buffer = Buffer.from(input, 'utf8');
    return buffer.toString('hex');
};
exports.stringToHex = stringToHex;
const disburseMessageConstruction = (version, msg, dlpcId, claims) => {
    const versionNum = parseInt(version, 10);
    const hexVersion = versionNum.toString(16).padStart(4, "0");
    const hexMsg = (0, exports.stringToHex)(msg);
    const claimsLength = claims.length;
    const hexClaimsLength = claimsLength.toString(16).padStart(2, "0");
    const arr = [];
    claims.forEach((obj) => {
        const address = bech32_1.bech32.decode(obj.Address);
        const amount = obj.Amount;
        arr.push(Buffer.from(bech32_1.bech32.fromWords(address.words)).toString("hex") +
            Buffer.from(amount, "utf8")
                .toString("hex")
                .padStart(16, "0"));
    });
    let concatenatedString = "";
    for (let i = 0; i < arr.length; i++) {
        concatenatedString += arr[i];
    }
    const messageObj = hexVersion + dlpcId + hexMsg + hexClaimsLength + concatenatedString;
    return messageObj;
};
exports.disburseMessageConstruction = disburseMessageConstruction;
