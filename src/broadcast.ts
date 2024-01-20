import axios from 'axios';

export const broadcastTransaction = async (
  url: string,
  signedTxBytes: Uint8Array | string,
  org?: string,
  chainid?: string,
  token?: string,
  broadCastMode = 'BROADCAST_MODE_SYNC',
) => {
  const txBytesBuffer = typeof signedTxBytes === 'string' ? 
    Buffer.from(signedTxBytes, 'binary'): 
    Buffer.from(signedTxBytes);
  const txBytesBase64 = txBytesBuffer.toString('base64');
  if (org && chainid) {
    const chain = axios.create({
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
    return await chain.post('/submit', payload);
  } else {
    const chain = axios.create({
      baseURL: `${url}/cosmos/tx/v1beta1`,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    const payload = { tx_bytes: txBytesBase64, mode: broadCastMode };
    return await chain.post('/txs', payload);
  }
};

