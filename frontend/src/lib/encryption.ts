import nacl from 'tweetnacl';
import { decodeUTF8, encodeUTF8, encodeBase64, decodeBase64 } from 'tweetnacl-util';

// key is a 32-byte Uint8Array derived from hex string
export function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(32);
  for (let i = 0; i < 32; i += 1) {
    bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

export function encryptMessage(text: string, keyHex: string): { encryptedText: string; nonce: string } {
  const key = hexToBytes(keyHex);
  const nonce = nacl.randomBytes(nacl.secretbox.nonceLength);
  const messageUint8 = decodeUTF8(text);
  const encrypted = nacl.secretbox(messageUint8, nonce, key);

  return {
    encryptedText: encodeBase64(encrypted),
    nonce: encodeBase64(nonce)
  };
}

export function decryptMessage(encryptedText: string, nonceStr: string, keyHex: string): string {
  try {
    const key = hexToBytes(keyHex);
    const nonce = decodeBase64(nonceStr);
    const ciphertext = decodeBase64(encryptedText);
    const decrypted = nacl.secretbox.open(ciphertext, nonce, key);

    if (!decrypted) {
      return '[Decryption failed]';
    }

    return encodeUTF8(decrypted);
  } catch {
    return '[Decryption error]';
  }
}
