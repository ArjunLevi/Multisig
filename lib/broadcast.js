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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastTransaction = void 0;
const axios_1 = __importDefault(require("axios"));
const broadcastTransaction = (url, signedTxBytes, org, chainid, token, broadCastMode = 'BROADCAST_MODE_SYNC') => __awaiter(void 0, void 0, void 0, function* () {
    const txBytesBuffer = typeof signedTxBytes === 'string' ?
        Buffer.from(signedTxBytes, 'binary') :
        Buffer.from(signedTxBytes);
    const txBytesBase64 = txBytesBuffer.toString('base64');
    if (org && chainid) {
        const chain = axios_1.default.create({
            baseURL: `${url}/api/v2/chain`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'x-tenant': org,
                'Authorization': `Bearer ${token}`
            },
        });
        const payloadStringify = JSON.stringify({ tx_bytes: txBytesBase64, mode: broadCastMode });
        const payload = { chainid: chainid, org: org, payload: payloadStringify };
        return yield chain.post('/submit', payload);
    }
    else {
        const chain = axios_1.default.create({
            baseURL: `${url}/cosmos/tx/v1beta1`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
        });
        const payload = { tx_bytes: txBytesBase64, mode: broadCastMode };
        return yield chain.post('/txs', payload);
    }
});
exports.broadcastTransaction = broadcastTransaction;
