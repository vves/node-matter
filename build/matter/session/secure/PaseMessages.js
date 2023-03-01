"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TlvPasePake3 = exports.TlvPasePake2 = exports.TlvPasePake1 = exports.TlvPbkdfParamResponse = exports.TlvPbkdfParamRequest = void 0;
const Crypto_1 = require("../../../crypto/Crypto");
const matter_js_1 = require("@project-chip/matter.js");
const TlvSedParameters = (0, matter_js_1.TlvObject)({
    idleRetransTimeoutMs: (0, matter_js_1.TlvOptionalField)(1, matter_js_1.TlvUInt32),
    activeRetransTimeoutMs: (0, matter_js_1.TlvOptionalField)(2, matter_js_1.TlvUInt32),
});
exports.TlvPbkdfParamRequest = (0, matter_js_1.TlvObject)({
    random: (0, matter_js_1.TlvField)(1, matter_js_1.TlvByteString.bound({ length: 32 })),
    sessionId: (0, matter_js_1.TlvField)(2, matter_js_1.TlvUInt16),
    passcodeId: (0, matter_js_1.TlvField)(3, matter_js_1.TlvUInt16),
    hasPbkdfParameters: (0, matter_js_1.TlvField)(4, matter_js_1.TlvBoolean),
    mrpParameters: (0, matter_js_1.TlvOptionalField)(5, TlvSedParameters),
});
exports.TlvPbkdfParamResponse = (0, matter_js_1.TlvObject)({
    peerRandom: (0, matter_js_1.TlvField)(1, matter_js_1.TlvByteString.bound({ length: 32 })),
    random: (0, matter_js_1.TlvField)(2, matter_js_1.TlvByteString.bound({ length: 32 })),
    sessionId: (0, matter_js_1.TlvField)(3, matter_js_1.TlvUInt16),
    pbkdfParameters: (0, matter_js_1.TlvOptionalField)(4, (0, matter_js_1.TlvObject)({
        iterations: (0, matter_js_1.TlvField)(1, matter_js_1.TlvUInt32),
        salt: (0, matter_js_1.TlvField)(2, matter_js_1.TlvByteString.bound({ minLength: 16, maxLength: 32 })),
    })),
    mrpParameters: (0, matter_js_1.TlvOptionalField)(5, TlvSedParameters),
});
exports.TlvPasePake1 = (0, matter_js_1.TlvObject)({
    x: (0, matter_js_1.TlvField)(1, matter_js_1.TlvByteString.bound({ length: Crypto_1.CRYPTO_PUBLIC_KEY_SIZE_BYTES })),
});
exports.TlvPasePake2 = (0, matter_js_1.TlvObject)({
    y: (0, matter_js_1.TlvField)(1, matter_js_1.TlvByteString.bound({ length: Crypto_1.CRYPTO_PUBLIC_KEY_SIZE_BYTES })),
    verifier: (0, matter_js_1.TlvField)(2, matter_js_1.TlvByteString.bound({ length: Crypto_1.CRYPTO_HASH_LEN_BYTES })),
});
exports.TlvPasePake3 = (0, matter_js_1.TlvObject)({
    verifier: (0, matter_js_1.TlvField)(1, matter_js_1.TlvByteString.bound({ length: Crypto_1.CRYPTO_HASH_LEN_BYTES })),
});
