/// <reference types="node" />
import BN from "bn.js";
import crypto from "crypto";
import { ByteArray } from "@project-chip/matter.js";
export declare const CRYPTO_GROUP_SIZE_BITS = 256;
export declare const CRYPTO_GROUP_SIZE_BYTES = 32;
export declare const CRYPTO_PUBLIC_KEY_SIZE_BYTES: number;
export declare const CRYPTO_HASH_LEN_BYTES = 32;
export declare const CRYPTO_HASH_BLOCK_LEN_BYTES = 64;
export declare const CRYPTO_SYMMETRIC_KEY_LENGTH_BITS = 128;
export declare const CRYPTO_SYMMETRIC_KEY_LENGTH_BYTES = 16;
export declare const CRYPTO_AEAD_MIC_LENGTH_BITS = 128;
export declare const CRYPTO_AEAD_MIC_LENGTH_BYTES = 16;
export declare const CRYPTO_AEAD_NONCE_LENGTH_BYTES = 13;
export interface KeyPair {
    publicKey: ByteArray;
    privateKey: ByteArray;
}
export declare class Crypto {
    static encrypt(key: ByteArray, data: ByteArray, nonce: ByteArray, aad?: ByteArray): Uint8Array;
    static decrypt(key: ByteArray, data: ByteArray, nonce: ByteArray, aad?: ByteArray): Buffer;
    static getRandomData(length: number): ByteArray;
    static getRandom(): ByteArray;
    static getRandomUInt16(): number;
    static getRandomUInt32(): number;
    static getRandomBN(size: number, maxValue: BN): BN;
    static ecdhGeneratePublicKey(): {
        publicKey: Buffer;
        ecdh: crypto.ECDH;
    };
    static ecdhGeneratePublicKeyAndSecret(peerPublicKey: ByteArray): {
        publicKey: Buffer;
        sharedSecret: Buffer;
    };
    static ecdhGenerateSecret(peerPublicKey: ByteArray, ecdh: crypto.ECDH): Buffer;
    static hash(data: ByteArray | ByteArray[]): Buffer;
    static pbkdf2(secret: ByteArray, salt: ByteArray, iteration: number, keyLength: number): Promise<Uint8Array>;
    static hkdf(secret: ByteArray, salt: ByteArray, info: ByteArray, length?: number): Promise<Uint8Array>;
    static hmac(key: ByteArray, data: ByteArray): Buffer;
    static sign(privateKey: ByteArray, data: ByteArray | ByteArray[], dsaEncoding?: ("ieee-p1363" | "der")): Buffer;
    static verify(publicKey: ByteArray, data: ByteArray, signature: ByteArray, dsaEncoding?: ("ieee-p1363" | "der")): void;
    static createKeyPair(): KeyPair;
}
