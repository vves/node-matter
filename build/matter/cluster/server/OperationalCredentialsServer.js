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
exports.OperationalCredentialsClusterHandler = void 0;
const Crypto_1 = require("../../../crypto/Crypto");
const OperationalCredentialsCluster_1 = require("../OperationalCredentialsCluster");
const FabricIndex_1 = require("../../common/FabricIndex");
const TryCatchHandler_1 = require("../../../error/TryCatchHandler");
const FabricManager_1 = require("../../fabric/FabricManager");
const Logger_1 = require("../../../log/Logger");
const logger = Logger_1.Logger.get("OperationalCredentialsServer");
function signWithDeviceKey(conf, session, data) {
    return Crypto_1.Crypto.sign(conf.devicePrivateKey, [data, session.getAttestationChallengeKey()]);
}
const OperationalCredentialsClusterHandler = (conf) => ({
    requestAttestation: ({ request: { attestationNonce }, session }) => __awaiter(void 0, void 0, void 0, function* () {
        const elements = OperationalCredentialsCluster_1.TlvAttestation.encode({ declaration: conf.certificateDeclaration, attestationNonce, timestamp: 0 });
        return { elements: elements, signature: signWithDeviceKey(conf, session, elements) };
    }),
    requestCertSigning: ({ request: { certSigningRequestNonce }, session }) => __awaiter(void 0, void 0, void 0, function* () {
        const certSigningRequest = session.getContext().getFabricBuilder().createCertificateSigningRequest();
        const elements = OperationalCredentialsCluster_1.TlvCertSigningRequest.encode({ certSigningRequest, certSigningRequestNonce });
        return { elements, signature: signWithDeviceKey(conf, session, elements) };
    }),
    requestCertChain: ({ request: { type } }) => __awaiter(void 0, void 0, void 0, function* () {
        switch (type) {
            case 1:
                return { certificate: conf.deviceCertificate };
            case 2:
                return { certificate: conf.deviceIntermediateCertificate };
            default:
                throw new Error(`Unsupported certificate type: ${type}`);
        }
    }),
    addOperationalCert: ({ request: { operationalCert, intermediateCaCert, identityProtectionKey, caseAdminNode, adminVendorId }, session }) => __awaiter(void 0, void 0, void 0, function* () {
        if (!session.isSecure())
            throw new Error("addOperationalCert should be called on a secure session.");
        const device = session.getContext();
        const fabricBuilder = device.getFabricBuilder();
        fabricBuilder.setOperationalCert(operationalCert);
        if (intermediateCaCert && intermediateCaCert.length > 0)
            fabricBuilder.setIntermediateCACert(intermediateCaCert);
        fabricBuilder.setRootVendorId(adminVendorId);
        fabricBuilder.setIdentityProtectionKey(identityProtectionKey);
        fabricBuilder.setRootNodeId(caseAdminNode);
        const fabric = yield fabricBuilder.build();
        const fabricIndex = device.addFabric(fabric);
        console.log("addOperationalCert success");
        return { status: 0, fabricIndex };
    }),
    getFabrics: (session) => {
        if (session === undefined || !session.isSecure())
            return [];
        return session.getContext().getFabrics().map(fabric => ({
            fabricId: fabric.fabricId,
            label: fabric.label,
            nodeId: fabric.nodeId,
            rootPublicKey: fabric.rootPublicKey,
            vendorId: fabric.rootVendorId,
            fabricIndex: fabric.fabricIndex,
        }));
    },
    getCurrentFabricIndex: (session) => {
        var _a, _b;
        if (session === undefined || !session.isSecure())
            return FabricIndex_1.FabricIndex.NO_FABRIC;
        return (_b = (_a = session.getFabric()) === null || _a === void 0 ? void 0 : _a.fabricIndex) !== null && _b !== void 0 ? _b : FabricIndex_1.FabricIndex.NO_FABRIC;
    },
    updateOperationalCert: ({ request: { operationalCert, intermediateCaCert, }, session }) => __awaiter(void 0, void 0, void 0, function* () {
        throw new Error("Not implemented");
    }),
    updateFabricLabel: ({ request: { label }, session }) => __awaiter(void 0, void 0, void 0, function* () {
        if (!session.isSecure())
            throw new Error("updateOperationalCert should be called on a secure session.");
        const secureSession = session;
        const fabric = secureSession.getFabric();
        if (fabric === undefined)
            throw new Error("updateOperationalCert on a session linked to a fabric.");
        fabric.label = label;
        return { status: 0 };
    }),
    removeFabric: ({ request: { fabricIndex }, session }) => __awaiter(void 0, void 0, void 0, function* () {
        const device = session.getContext();
        const status = (0, TryCatchHandler_1.tryCatch)(() => {
            device.removeFabric(fabricIndex);
            return 0;
        }, FabricManager_1.FabricNotFoundError, 11);
        return { status };
    }),
    addRootCert: ({ request: { certificate }, session }) => __awaiter(void 0, void 0, void 0, function* () {
        session.getContext().getFabricBuilder().setRootCert(certificate);
    }),
});
exports.OperationalCredentialsClusterHandler = OperationalCredentialsClusterHandler;
