import CryptoJS from "crypto-js";

const SECRET_KEY = "claim-your-page-2024";

export function encode(id: string): string {
    const ciphertext = CryptoJS.AES.encrypt(id, SECRET_KEY).toString();
    return ciphertext.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decode(ciphertext: string): string {
    const base64 = ciphertext.replace(/-/g, '+').replace(/_/g, '/');
    const decrypted = CryptoJS.AES.decrypt(base64, SECRET_KEY);
    return decrypted.toString(CryptoJS.enc.Utf8);
}
