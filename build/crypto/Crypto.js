"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Crypto = exports.CRYPTO_AEAD_NONCE_LENGTH_BYTES = exports.CRYPTO_AEAD_MIC_LENGTH_BYTES = exports.CRYPTO_AEAD_MIC_LENGTH_BITS = exports.CRYPTO_SYMMETRIC_KEY_LENGTH_BYTES = exports.CRYPTO_SYMMETRIC_KEY_LENGTH_BITS = exports.CRYPTO_HASH_BLOCK_LEN_BYTES = exports.CRYPTO_HASH_LEN_BYTES = exports.CRYPTO_PUBLIC_KEY_SIZE_BYTES = exports.CRYPTO_GROUP_SIZE_BYTES = exports.CRYPTO_GROUP_SIZE_BITS = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const crypto_1 = __importDefault(require("crypto"));
const matter_js_1 = require("@project-chip/matter.js");
const ENCRYPT_ALGORITHM = "aes-128-ccm";
const HASH_ALGORITHM = "sha256";
const EC_CURVE = "prime256v1";
const AUTH_TAG_LENGTH = 16;
const RANDOM_LENGTH = 32;
const SYMMETRIC_KEY_LENGTH = 16;
const EC_PRIVATE_KEY_PKCS8_HEADER = matter_js_1.ByteArray.fromHex("308141020100301306072a8648ce3d020106082a8648ce3d030107042730250201010420");
const EC_PUBLIC_KEY_SPKI_HEADER = matter_js_1.ByteArray.fromHex("3059301306072a8648ce3d020106082a8648ce3d030107034200");
exports.CRYPTO_GROUP_SIZE_BITS = 256;
exports.CRYPTO_GROUP_SIZE_BYTES = 32;
exports.CRYPTO_PUBLIC_KEY_SIZE_BYTES = (2 * exports.CRYPTO_GROUP_SIZE_BYTES) + 1;
exports.CRYPTO_HASH_LEN_BYTES = 32;
exports.CRYPTO_HASH_BLOCK_LEN_BYTES = 64;
exports.CRYPTO_SYMMETRIC_KEY_LENGTH_BITS = 128;
exports.CRYPTO_SYMMETRIC_KEY_LENGTH_BYTES = 16;
exports.CRYPTO_AEAD_MIC_LENGTH_BITS = 128;
exports.CRYPTO_AEAD_MIC_LENGTH_BYTES = 16;
exports.CRYPTO_AEAD_NONCE_LENGTH_BYTES = 13;
class Crypto {
    static encrypt(key, data, nonce, aad) {
        const cipher = crypto_1.default.createCipheriv(ENCRYPT_ALGORITHM, key, nonce, { authTagLength: AUTH_TAG_LENGTH });
        if (aad !== undefined) {
            cipher.setAAD(aad, { plaintextLength: data.length });
        }
        ;
        const encrypted = cipher.update(data);
        cipher.final();
        return matter_js_1.ByteArray.concat(encrypted, cipher.getAuthTag());
    }
    static decrypt(key, data, nonce, aad) {
        const cipher = crypto_1.default.createDecipheriv(ENCRYPT_ALGORITHM, key, nonce, { authTagLength: AUTH_TAG_LENGTH });
        const plaintextLength = data.length - AUTH_TAG_LENGTH;
        if (aad !== undefined) {
            cipher.setAAD(aad, { plaintextLength });
        }
        ;
        cipher.setAuthTag(data.slice(plaintextLength));
        const result = cipher.update(data.slice(0, plaintextLength));
        cipher.final();
        return result;
    }
    static getRandomData(length) {
        return crypto_1.default.randomBytes(length);
    }
    static getRandom() {
        return this.getRandomData(RANDOM_LENGTH);
    }
    static getRandomUInt16() {
        return crypto_1.default.randomBytes(2).readUInt16LE();
    }
    static getRandomUInt32() {
        return crypto_1.default.randomBytes(4).readUInt32LE();
    }
    static getRandomBN(size, maxValue) {
        while (true) {
            const random = new bn_js_1.default(crypto_1.default.randomBytes(size));
            if (random < maxValue)
                return random;
        }
    }
    static ecdhGeneratePublicKey() {
        const ecdh = crypto_1.default.createECDH(EC_CURVE);
        ecdh.generateKeys();
        return { publicKey: ecdh.getPublicKey(), ecdh: ecdh };
    }
    static ecdhGeneratePublicKeyAndSecret(peerPublicKey) {
        const ecdh = crypto_1.default.createECDH(EC_CURVE);
        ecdh.generateKeys();
        return { publicKey: ecdh.getPublicKey(), sharedSecret: ecdh.computeSecret(peerPublicKey) };
    }
    static ecdhGenerateSecret(peerPublicKey, ecdh) {
        return ecdh.computeSecret(peerPublicKey);
    }
    static hash(data) {
        const hasher = crypto_1.default.createHash(HASH_ALGORITHM);
        if (Array.isArray(data)) {
            data.forEach(chunk => hasher.update(chunk));
        }
        else {
            hasher.update(data);
        }
        return hasher.digest();
    }
    static pbkdf2(secret, salt, iteration, keyLength) {
        return new Promise((resolver, rejecter) => {
            crypto_1.default.pbkdf2(secret, salt, iteration, keyLength, HASH_ALGORITHM, (error, key) => {
                if (error !== null)
                    rejecter(error);
                resolver(key);
            });
        });
    }
    static hkdf(secret, salt, info, length = SYMMETRIC_KEY_LENGTH) {
        return new Promise((resolver, rejecter) => {
            crypto_1.default.hkdf(HASH_ALGORITHM, secret, salt, info, length, (error, key) => {
                if (error !== null)
                    rejecter(error);
                resolver(new matter_js_1.ByteArray(key));
            });
        });
    }
    static hmac(key, data) {
        const hmac = crypto_1.default.createHmac(HASH_ALGORITHM, key);
        hmac.update(data);
        return hmac.digest();
    }
    static sign(privateKey, data, dsaEncoding = "ieee-p1363") {
        const signer = crypto_1.default.createSign(HASH_ALGORITHM);
        if (Array.isArray(data)) {
            data.forEach(chunk => signer.update(chunk));
        }
        else {
            signer.update(data);
        }
        return signer.sign({
            key: Buffer.concat([EC_PRIVATE_KEY_PKCS8_HEADER, privateKey]),
            format: "der",
            type: "pkcs8",
            dsaEncoding,
        });
    }
    static verify(publicKey, data, signature, dsaEncoding = "ieee-p1363") {
        const verifier = crypto_1.default.createVerify(HASH_ALGORITHM);
        verifier.update(data);
        const success = verifier.verify({
            key: Buffer.concat([EC_PUBLIC_KEY_SPKI_HEADER, publicKey]),
            format: "der",
            type: "spki",
            dsaEncoding,
        }, signature);
        if (!success)
            throw new Error("Signature verification failed");
    }
    static createKeyPair() {
        const ecdh = crypto_1.default.createECDH(EC_CURVE);
        ecdh.generateKeys();
        return { publicKey: ecdh.getPublicKey(), privateKey: ecdh.getPrivateKey() };
    }
}
exports.Crypto = Crypto;
