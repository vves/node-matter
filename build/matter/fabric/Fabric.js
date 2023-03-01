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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FabricBuilder = exports.Fabric = void 0;
const Crypto_1 = require("../../crypto/Crypto");
const CertificateManager_1 = require("../certificate/CertificateManager");
const matter_js_1 = require("@project-chip/matter.js");
const FabricId_1 = require("../common/FabricId");
const COMPRESSED_FABRIC_ID_INFO = matter_js_1.ByteArray.fromString("CompressedFabric");
const GROUP_SECURITY_INFO = matter_js_1.ByteArray.fromString("GroupKey v1.0");
class Fabric {
    constructor(fabricIndex, fabricId, nodeId, rootNodeId, operationalId, rootPublicKey, keyPair, rootVendorId, rootCert, identityProtectionKey, operationalIdentityProtectionKey, intermediateCACert, operationalCert, label) {
        this.fabricIndex = fabricIndex;
        this.fabricId = fabricId;
        this.nodeId = nodeId;
        this.rootNodeId = rootNodeId;
        this.operationalId = operationalId;
        this.rootPublicKey = rootPublicKey;
        this.keyPair = keyPair;
        this.rootVendorId = rootVendorId;
        this.rootCert = rootCert;
        this.identityProtectionKey = identityProtectionKey;
        this.operationalIdentityProtectionKey = operationalIdentityProtectionKey;
        this.intermediateCACert = intermediateCACert;
        this.operationalCert = operationalCert;
        this.label = label;
    }
    getPublicKey() {
        return this.keyPair.publicKey;
    }
    sign(data) {
        return Crypto_1.Crypto.sign(this.keyPair.privateKey, data);
    }
    verifyCredentials(operationalCert, intermediateCACert) {
        return;
    }
    getDestinationId(nodeId, random) {
        const writer = new matter_js_1.DataWriter(matter_js_1.Endian.Little);
        writer.writeByteArray(random);
        writer.writeByteArray(this.rootPublicKey);
        writer.writeUInt64(this.fabricId.id);
        writer.writeUInt64(nodeId.id);
        return Crypto_1.Crypto.hmac(this.operationalIdentityProtectionKey, writer.toByteArray());
    }
}
exports.Fabric = Fabric;
class FabricBuilder {
    constructor(fabricIndex) {
        this.fabricIndex = fabricIndex;
        this.keyPair = Crypto_1.Crypto.createKeyPair();
    }
    getPublicKey() {
        return this.keyPair.publicKey;
    }
    createCertificateSigningRequest() {
        return CertificateManager_1.CertificateManager.createCertificateSigningRequest(this.keyPair);
    }
    setRootCert(rootCert) {
        this.rootCert = rootCert;
        this.rootPublicKey = CertificateManager_1.TlvRootCertificate.decode(rootCert).ellipticCurvePublicKey;
        return this;
    }
    setOperationalCert(operationalCert) {
        this.operationalCert = operationalCert;
        const { subject: { nodeId, fabricId } } = CertificateManager_1.TlvOperationalCertificate.decode(operationalCert);
        this.fabricId = new FabricId_1.FabricId((0, matter_js_1.toBigInt)(fabricId));
        this.nodeId = nodeId;
        return this;
    }
    setIntermediateCACert(certificate) {
        this.intermediateCACert = certificate;
        return this;
    }
    setRootVendorId(rootVendorId) {
        this.rootVendorId = rootVendorId;
        return this;
    }
    setRootNodeId(rootNodeId) {
        this.rootNodeId = rootNodeId;
        return this;
    }
    setIdentityProtectionKey(key) {
        this.identityProtectionKey = key;
        return this;
    }
    build() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.rootNodeId === undefined)
                throw new Error("rootNodeId needs to be set");
            if (this.rootVendorId === undefined)
                throw new Error("vendorId needs to be set");
            if (this.rootCert === undefined || this.rootPublicKey === undefined)
                throw new Error("rootCert needs to be set");
            if (this.identityProtectionKey === undefined)
                throw new Error("identityProtectionKey needs to be set");
            if (this.operationalCert === undefined || this.fabricId === undefined || this.nodeId === undefined)
                throw new Error("operationalCert needs to be set");
            const saltWriter = new matter_js_1.DataWriter(matter_js_1.Endian.Big);
            saltWriter.writeUInt64(this.fabricId.id);
            const operationalId = yield Crypto_1.Crypto.hkdf(this.rootPublicKey.slice(1), saltWriter.toByteArray(), COMPRESSED_FABRIC_ID_INFO, 8);
            return new Fabric(this.fabricIndex, this.fabricId, this.nodeId, this.rootNodeId, operationalId, this.rootPublicKey, this.keyPair, this.rootVendorId, this.rootCert, this.identityProtectionKey, yield Crypto_1.Crypto.hkdf(this.identityProtectionKey, operationalId, GROUP_SECURITY_INFO, 16), this.intermediateCACert, this.operationalCert, "");
        });
    }
}
exports.FabricBuilder = FabricBuilder;
