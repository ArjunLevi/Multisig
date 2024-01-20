import Mnemonic from "bitcore-mnemonic";

export type HDKeys = {
    hdPrivateKey?: string;
    hdPublicKey?: string;
}

export const generateHDKeys = (mnemonic: string, hdPath: string, options: {
    hdPrivateKey?: boolean;
    hdPublicKey?: boolean;
  }): HDKeys => {
     let result: HDKeys = {};
     const bitcoreMnemonic = new Mnemonic(mnemonic);
     const hdPrivateKey = bitcoreMnemonic.toHDPrivateKey();
     const hdKeyAtPath = hdPrivateKey.deriveChild(hdPath);
     if (options.hdPrivateKey) {
        result.hdPrivateKey = hdKeyAtPath.toString();
     }
     if (options.hdPublicKey) {
        result.hdPublicKey = hdKeyAtPath.hdPublicKey.toString();
     }
     return result;
  }
  