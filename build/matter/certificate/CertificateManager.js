"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateManager = exports.TlvOperationalCertificate = exports.TlvRootCertificate = exports.RcacId_Matter = exports.NodeId_Matter = exports.FabricId_Matter = exports.jsToMatterDate = exports.matterToJsDate = void 0;
const DerCodec_1 = require("../../codec/DerCodec");
const Crypto_1 = require("../../crypto/Crypto");
const NodeId_1 = require("../common/NodeId");
const matter_js_1 = require("@project-chip/matter.js");
const YEAR_S = 365 * 24 * 60 * 60;
const EPOCH_OFFSET_S = 10957 * 24 * 60 * 60;
function matterToJsDate(date) {
    return new Date((date + EPOCH_OFFSET_S) * 1000);
}
exports.matterToJsDate = matterToJsDate;
function jsToMatterDate(date, addYears = 0) {
    return Math.floor(date.getTime() / 1000) - EPOCH_OFFSET_S + addYears * YEAR_S;
}
exports.jsToMatterDate = jsToMatterDate;
function intTo16Chars(value) {
    const byteArray = new matter_js_1.ByteArray(8);
    const dataView = byteArray.getDataView();
    dataView.setBigUint64(0, typeof value === "bigint" ? value : BigInt(value));
    return byteArray.toHex().toUpperCase();
}
const FabricId_Matter = (id) => [(0, DerCodec_1.DerObject)("2b0601040182a27c0105", { value: intTo16Chars(id) })];
exports.FabricId_Matter = FabricId_Matter;
const NodeId_Matter = (nodeId) => [(0, DerCodec_1.DerObject)("2b0601040182a27c0101", { value: intTo16Chars(nodeId.id) })];
exports.NodeId_Matter = NodeId_Matter;
const RcacId_Matter = (id) => [(0, DerCodec_1.DerObject)("2b0601040182a27c0104", { value: intTo16Chars(id) })];
exports.RcacId_Matter = RcacId_Matter;
exports.TlvRootCertificate = (0, matter_js_1.TlvObject)({
    serialNumber: (0, matter_js_1.TlvField)(1, matter_js_1.TlvByteString.bound({ maxLength: 20 })),
    signatureAlgorithm: (0, matter_js_1.TlvField)(2, matter_js_1.TlvUInt8),
    issuer: (0, matter_js_1.TlvField)(3, (0, matter_js_1.TlvList)({
        issuerRcacId: (0, matter_js_1.TlvOptionalField)(20, matter_js_1.TlvUInt64),
    })),
    notBefore: (0, matter_js_1.TlvField)(4, matter_js_1.TlvUInt32),
    notAfter: (0, matter_js_1.TlvField)(5, matter_js_1.TlvUInt32),
    subject: (0, matter_js_1.TlvField)(6, (0, matter_js_1.TlvList)({
        rcacId: (0, matter_js_1.TlvField)(20, matter_js_1.TlvUInt64),
    })),
    publicKeyAlgorithm: (0, matter_js_1.TlvField)(7, matter_js_1.TlvUInt8),
    ellipticCurveIdentifier: (0, matter_js_1.TlvField)(8, matter_js_1.TlvUInt8),
    ellipticCurvePublicKey: (0, matter_js_1.TlvField)(9, matter_js_1.TlvByteString),
    extensions: (0, matter_js_1.TlvField)(10, (0, matter_js_1.TlvList)({
        basicConstraints: (0, matter_js_1.TlvField)(1, (0, matter_js_1.TlvObject)({
            isCa: (0, matter_js_1.TlvField)(1, matter_js_1.TlvBoolean),
            pathLen: (0, matter_js_1.TlvOptionalField)(2, matter_js_1.TlvUInt8),
        })),
        keyUsage: (0, matter_js_1.TlvField)(2, matter_js_1.TlvUInt16),
        extendedKeyUsage: (0, matter_js_1.TlvOptionalField)(3, (0, matter_js_1.TlvArray)(matter_js_1.TlvUInt8)),
        subjectKeyIdentifier: (0, matter_js_1.TlvField)(4, matter_js_1.TlvByteString.bound({ length: 20 })),
        authorityKeyIdentifier: (0, matter_js_1.TlvField)(5, matter_js_1.TlvByteString.bound({ length: 20 })),
        futureExtension: (0, matter_js_1.TlvOptionalField)(6, matter_js_1.TlvByteString),
    })),
    signature: (0, matter_js_1.TlvField)(11, matter_js_1.TlvByteString),
});
exports.TlvOperationalCertificate = (0, matter_js_1.TlvObject)({
    serialNumber: (0, matter_js_1.TlvField)(1, matter_js_1.TlvByteString.bound({ maxLength: 20 })),
    signatureAlgorithm: (0, matter_js_1.TlvField)(2, matter_js_1.TlvUInt8),
    issuer: (0, matter_js_1.TlvField)(3, (0, matter_js_1.TlvList)({
        issuerRcacId: (0, matter_js_1.TlvOptionalField)(20, matter_js_1.TlvUInt64),
    })),
    notBefore: (0, matter_js_1.TlvField)(4, matter_js_1.TlvUInt32),
    notAfter: (0, matter_js_1.TlvField)(5, matter_js_1.TlvUInt32),
    subject: (0, matter_js_1.TlvField)(6, (0, matter_js_1.TlvList)({
        fabricId: (0, matter_js_1.TlvField)(21, matter_js_1.TlvUInt64),
        nodeId: (0, matter_js_1.TlvField)(17, NodeId_1.TlvNodeId),
    })),
    publicKeyAlgorithm: (0, matter_js_1.TlvField)(7, matter_js_1.TlvUInt8),
    ellipticCurveIdentifier: (0, matter_js_1.TlvField)(8, matter_js_1.TlvUInt8),
    ellipticCurvePublicKey: (0, matter_js_1.TlvField)(9, matter_js_1.TlvByteString),
    extensions: (0, matter_js_1.TlvField)(10, (0, matter_js_1.TlvList)({
        basicConstraints: (0, matter_js_1.TlvField)(1, (0, matter_js_1.TlvObject)({
            isCa: (0, matter_js_1.TlvField)(1, matter_js_1.TlvBoolean),
            pathLen: (0, matter_js_1.TlvOptionalField)(2, matter_js_1.TlvUInt8),
        })),
        keyUsage: (0, matter_js_1.TlvField)(2, matter_js_1.TlvUInt16),
        extendedKeyUsage: (0, matter_js_1.TlvOptionalField)(3, (0, matter_js_1.TlvArray)(matter_js_1.TlvUInt8)),
        subjectKeyIdentifier: (0, matter_js_1.TlvField)(4, matter_js_1.TlvByteString.bound({ length: 20 })),
        authorityKeyIdentifier: (0, matter_js_1.TlvField)(5, matter_js_1.TlvByteString.bound({ length: 20 })),
        futureExtension: (0, matter_js_1.TlvOptionalField)(6, matter_js_1.TlvByteString),
    })),
    signature: (0, matter_js_1.TlvField)(11, matter_js_1.TlvByteString),
});
class CertificateManager {
    static rootCertToAsn1({ serialNumber, notBefore, notAfter, issuer: { issuerRcacId }, subject: { rcacId }, ellipticCurvePublicKey, extensions: { subjectKeyIdentifier, authorityKeyIdentifier } }) {
        return DerCodec_1.DerCodec.encode({
            version: (0, DerCodec_1.ContextTagged)(0, 2),
            serialNumber: serialNumber[0],
            signatureAlgorithm: DerCodec_1.EcdsaWithSHA256_X962,
            issuer: {
                issuerRcacId: issuerRcacId === undefined ? undefined : (0, exports.RcacId_Matter)(issuerRcacId),
            },
            validity: {
                notBefore: matterToJsDate(notBefore),
                notAfter: matterToJsDate(notAfter),
            },
            subject: {
                rcacId: (0, exports.RcacId_Matter)(rcacId),
            },
            publicKey: (0, DerCodec_1.PublicKeyEcPrime256v1_X962)(ellipticCurvePublicKey),
            extensions: (0, DerCodec_1.ContextTagged)(3, {
                basicConstraints: (0, DerCodec_1.BasicConstraints_X509)({ isCa: true }),
                keyUsage: DerCodec_1.KeyUsage_Signature_ContentCommited_X509,
                subjectKeyIdentifier: (0, DerCodec_1.SubjectKeyIdentifier_X509)(subjectKeyIdentifier),
                authorityKeyIdentifier: (0, DerCodec_1.AuthorityKeyIdentifier_X509)(authorityKeyIdentifier),
            }),
        });
    }
    static nocCertToAsn1({ serialNumber, notBefore, notAfter, issuer: { issuerRcacId }, subject: { fabricId, nodeId }, ellipticCurvePublicKey, extensions: { subjectKeyIdentifier, authorityKeyIdentifier } }) {
        return DerCodec_1.DerCodec.encode({
            version: (0, DerCodec_1.ContextTagged)(0, 2),
            serialNumber: serialNumber[0],
            signatureAlgorithm: DerCodec_1.EcdsaWithSHA256_X962,
            issuer: {
                issuerRcacId: issuerRcacId === undefined ? undefined : (0, exports.RcacId_Matter)(issuerRcacId),
            },
            validity: {
                notBefore: matterToJsDate(notBefore),
                notAfter: matterToJsDate(notAfter),
            },
            subject: {
                fabricId: (0, exports.FabricId_Matter)(fabricId),
                nodeId: (0, exports.NodeId_Matter)(nodeId),
            },
            publicKey: (0, DerCodec_1.PublicKeyEcPrime256v1_X962)(ellipticCurvePublicKey),
            extensions: (0, DerCodec_1.ContextTagged)(3, {
                basicConstraints: (0, DerCodec_1.BasicConstraints_X509)({}),
                keyUsage: DerCodec_1.KeyUsage_Signature_X509,
                extendedKeyUsage: (0, DerCodec_1.ExtendedKeyUsage_X509)({ serverAuth: true, clientAuth: true }),
                subjectKeyIdentifier: (0, DerCodec_1.SubjectKeyIdentifier_X509)(subjectKeyIdentifier),
                authorityKeyIdentifier: (0, DerCodec_1.AuthorityKeyIdentifier_X509)(authorityKeyIdentifier),
            }),
        });
    }
    static validateRootCertificate(rootCert) {
        Crypto_1.Crypto.verify(rootCert.ellipticCurvePublicKey, this.rootCertToAsn1(rootCert), rootCert.signature);
    }
    static validateNocCertificate(rootCert, nocCert) {
        Crypto_1.Crypto.verify(rootCert.ellipticCurvePublicKey, this.nocCertToAsn1(nocCert), nocCert.signature);
    }
    static createCertificateSigningRequest(keys) {
        const request = {
            version: 0,
            subject: { organization: (0, DerCodec_1.OrganisationName_X520)("CSR") },
            publicKey: (0, DerCodec_1.PublicKeyEcPrime256v1_X962)(keys.publicKey),
            endSignedBytes: (0, DerCodec_1.ContextTagged)(0),
        };
        return DerCodec_1.DerCodec.encode({
            request,
            signAlgorithm: DerCodec_1.EcdsaWithSHA256_X962,
            signature: (0, DerCodec_1.BitByteArray)(Crypto_1.Crypto.sign(keys.privateKey, DerCodec_1.DerCodec.encode(request), "der")),
        });
    }
    static getPublicKeyFromCsr(csr) {
        var _a, _b;
        const { [DerCodec_1.ELEMENTS_KEY]: rootElements } = DerCodec_1.DerCodec.decode(csr);
        if ((rootElements === null || rootElements === void 0 ? void 0 : rootElements.length) !== 3)
            throw new Error("Invalid CSR data");
        const [requestNode, signAlgorithmNode, signatureNode] = rootElements;
        const { [DerCodec_1.ELEMENTS_KEY]: requestElements } = requestNode;
        if ((requestElements === null || requestElements === void 0 ? void 0 : requestElements.length) !== 4)
            throw new Error("Invalid CSR data");
        const [versionNode, subjectNode, publicKeyNode] = requestElements;
        const requestVersion = versionNode[DerCodec_1.BYTES_KEY][0];
        if (requestVersion !== 0)
            throw new Error(`Unsupported request version${requestVersion}`);
        const { [DerCodec_1.ELEMENTS_KEY]: publicKeyElements } = publicKeyNode;
        if ((publicKeyElements === null || publicKeyElements === void 0 ? void 0 : publicKeyElements.length) !== 2)
            throw new Error("Invalid CSR data");
        const [publicKeyTypeNode, publicKeyBytesNode] = publicKeyElements;
        const publicKey = publicKeyBytesNode[DerCodec_1.BYTES_KEY];
        if (!DerCodec_1.EcdsaWithSHA256_X962[DerCodec_1.OBJECT_ID_KEY][DerCodec_1.BYTES_KEY].equals((_b = (_a = signAlgorithmNode[DerCodec_1.ELEMENTS_KEY]) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b[DerCodec_1.BYTES_KEY]))
            throw new Error("Unsupported signature type");
        Crypto_1.Crypto.verify(publicKey, DerCodec_1.DerCodec.encode(requestNode), signatureNode[DerCodec_1.BYTES_KEY], "der");
        return publicKey;
    }
}
exports.CertificateManager = CertificateManager;
