"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TlvEncryptedDataSigma3 = exports.TlvEncryptedDataSigma2 = exports.TlvSignedData = exports.TlvCaseSigma3 = exports.TlvCaseSigma2Resume = exports.TlvCaseSigma2 = exports.TlvCaseSigma1 = exports.TBE_DATA3_NONCE = exports.TBE_DATA2_NONCE = exports.KDFSR3_INFO = exports.KDFSR2_INFO = exports.RESUME2_MIC_NONCE = exports.RESUME1_MIC_NONCE = exports.KDFSR2_KEY_INFO = exports.KDFSR1_KEY_INFO = void 0;
const Crypto_1 = require("../../../crypto/Crypto");
const matter_js_1 = require("@project-chip/matter.js");
const CASE_SIGNATURE_LENGTH = Crypto_1.CRYPTO_GROUP_SIZE_BYTES * 2;
const CASE2_ENCRYPTED_LENGTH = 800 + Crypto_1.CRYPTO_AEAD_MIC_LENGTH_BYTES + CASE_SIGNATURE_LENGTH;
exports.KDFSR1_KEY_INFO = matter_js_1.ByteArray.fromString("Sigma1_Resume");
exports.KDFSR2_KEY_INFO = matter_js_1.ByteArray.fromString("Sigma2_Resume");
exports.RESUME1_MIC_NONCE = matter_js_1.ByteArray.fromString("NCASE_SigmaS1");
exports.RESUME2_MIC_NONCE = matter_js_1.ByteArray.fromString("NCASE_SigmaS2");
exports.KDFSR2_INFO = matter_js_1.ByteArray.fromString("Sigma2");
exports.KDFSR3_INFO = matter_js_1.ByteArray.fromString("Sigma3");
exports.TBE_DATA2_NONCE = matter_js_1.ByteArray.fromString("NCASE_Sigma2N");
exports.TBE_DATA3_NONCE = matter_js_1.ByteArray.fromString("NCASE_Sigma3N");
const TlvSedParameters = (0, matter_js_1.TlvObject)({
    idleRetransTimeoutMs: (0, matter_js_1.TlvOptionalField)(1, matter_js_1.TlvUInt32),
    activeRetransTimeoutMs: (0, matter_js_1.TlvOptionalField)(2, matter_js_1.TlvUInt32),
});
exports.TlvCaseSigma1 = (0, matter_js_1.TlvObject)({
    random: (0, matter_js_1.TlvField)(1, matter_js_1.TlvByteString.bound({ length: 32 })),
    sessionId: (0, matter_js_1.TlvField)(2, matter_js_1.TlvUInt16),
    destinationId: (0, matter_js_1.TlvField)(3, matter_js_1.TlvByteString.bound({ length: Crypto_1.CRYPTO_HASH_LEN_BYTES })),
    ecdhPublicKey: (0, matter_js_1.TlvField)(4, matter_js_1.TlvByteString.bound({ length: Crypto_1.CRYPTO_PUBLIC_KEY_SIZE_BYTES })),
    mrpParams: (0, matter_js_1.TlvOptionalField)(5, TlvSedParameters),
    resumptionId: (0, matter_js_1.TlvOptionalField)(6, matter_js_1.TlvByteString.bound({ length: 16 })),
    resumeMic: (0, matter_js_1.TlvOptionalField)(7, matter_js_1.TlvByteString.bound({ length: Crypto_1.CRYPTO_AEAD_MIC_LENGTH_BYTES })),
});
exports.TlvCaseSigma2 = (0, matter_js_1.TlvObject)({
    random: (0, matter_js_1.TlvField)(1, matter_js_1.TlvByteString.bound({ length: 32 })),
    sessionId: (0, matter_js_1.TlvField)(2, matter_js_1.TlvUInt16),
    ecdhPublicKey: (0, matter_js_1.TlvField)(3, matter_js_1.TlvByteString.bound({ length: Crypto_1.CRYPTO_PUBLIC_KEY_SIZE_BYTES })),
    encrypted: (0, matter_js_1.TlvField)(4, matter_js_1.TlvByteString.bound({ maxLength: CASE2_ENCRYPTED_LENGTH })),
    mrpParams: (0, matter_js_1.TlvOptionalField)(5, TlvSedParameters),
});
exports.TlvCaseSigma2Resume = (0, matter_js_1.TlvObject)({
    resumptionId: (0, matter_js_1.TlvField)(1, matter_js_1.TlvByteString.bound({ length: 16 })),
    resumeMic: (0, matter_js_1.TlvField)(2, matter_js_1.TlvByteString.bound({ length: 16 })),
    sessionId: (0, matter_js_1.TlvField)(3, matter_js_1.TlvUInt16),
});
exports.TlvCaseSigma3 = (0, matter_js_1.TlvObject)({
    encrypted: (0, matter_js_1.TlvField)(1, matter_js_1.TlvByteString),
});
exports.TlvSignedData = (0, matter_js_1.TlvObject)({
    nodeOpCert: (0, matter_js_1.TlvField)(1, matter_js_1.TlvByteString),
    intermediateCACert: (0, matter_js_1.TlvOptionalField)(2, matter_js_1.TlvByteString),
    ecdhPublicKey: (0, matter_js_1.TlvField)(3, matter_js_1.TlvByteString.bound({ length: Crypto_1.CRYPTO_PUBLIC_KEY_SIZE_BYTES })),
    peerEcdhPublicKey: (0, matter_js_1.TlvField)(4, matter_js_1.TlvByteString.bound({ length: Crypto_1.CRYPTO_PUBLIC_KEY_SIZE_BYTES })),
});
exports.TlvEncryptedDataSigma2 = (0, matter_js_1.TlvObject)({
    nodeOpCert: (0, matter_js_1.TlvField)(1, matter_js_1.TlvByteString),
    intermediateCACert: (0, matter_js_1.TlvOptionalField)(2, matter_js_1.TlvByteString),
    signature: (0, matter_js_1.TlvField)(3, matter_js_1.TlvByteString.bound({ length: CASE_SIGNATURE_LENGTH })),
    resumptionId: (0, matter_js_1.TlvField)(4, matter_js_1.TlvByteString.bound({ length: 16 })),
});
exports.TlvEncryptedDataSigma3 = (0, matter_js_1.TlvObject)({
    nodeOpCert: (0, matter_js_1.TlvField)(1, matter_js_1.TlvByteString),
    intermediateCACert: (0, matter_js_1.TlvOptionalField)(2, matter_js_1.TlvByteString),
    signature: (0, matter_js_1.TlvField)(3, matter_js_1.TlvByteString.bound({ length: CASE_SIGNATURE_LENGTH })),
});
