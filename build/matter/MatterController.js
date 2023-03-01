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
exports.MatterController = void 0;
const SecureChannelMessages_1 = require("./session/secure/SecureChannelMessages");
const SessionManager_1 = require("./session/SessionManager");
const ExchangeManager_1 = require("./common/ExchangeManager");
const PaseClient_1 = require("./session/secure/PaseClient");
const InteractionClient_1 = require("./interaction/InteractionClient");
const BasicInformationCluster_1 = require("./cluster/BasicInformationCluster");
const GeneralCommissioningCluster_1 = require("./cluster/GeneralCommissioningCluster");
const OperationalCredentialsCluster_1 = require("./cluster/OperationalCredentialsCluster");
const Crypto_1 = require("../crypto/Crypto");
const CertificateManager_1 = require("./certificate/CertificateManager");
const Fabric_1 = require("./fabric/Fabric");
const CaseClient_1 = require("./session/secure/CaseClient");
const Node_1 = require("../util/Node");
const ChannelManager_1 = require("./common/ChannelManager");
const Logger_1 = require("../log/Logger");
const Time_1 = require("../time/Time");
const NodeId_1 = require("./common/NodeId");
const VendorId_1 = require("./common/VendorId");
const matter_js_1 = require("@project-chip/matter.js");
const FabricIndex_1 = require("./common/FabricIndex");
const Ip_1 = require("../util/Ip");
(0, Node_1.requireMinNodeVersion)(16);
const FABRIC_INDEX = new FabricIndex_1.FabricIndex(1);
const FABRIC_ID = BigInt(1);
const CONTROLLER_NODE_ID = new NodeId_1.NodeId(BigInt(1));
const ADMIN_VENDOR_ID = new VendorId_1.VendorId(752);
const logger = Logger_1.Logger.get("MatterController");
class MatterController {
    constructor(scanner, netInterfaceIpv4, netInterfaceIpv6, certificateManager, fabric) {
        this.scanner = scanner;
        this.netInterfaceIpv4 = netInterfaceIpv4;
        this.netInterfaceIpv6 = netInterfaceIpv6;
        this.certificateManager = certificateManager;
        this.fabric = fabric;
        this.sessionManager = new SessionManager_1.SessionManager(this);
        this.channelManager = new ChannelManager_1.ChannelManager();
        this.exchangeManager = new ExchangeManager_1.ExchangeManager(this.sessionManager, this.channelManager);
        this.paseClient = new PaseClient_1.PaseClient();
        this.caseClient = new CaseClient_1.CaseClient();
        this.exchangeManager.addNetInterface(netInterfaceIpv4);
        this.exchangeManager.addNetInterface(netInterfaceIpv6);
    }
    static create(scanner, netInterfaceIpv4, netInterfaceIpv6) {
        return __awaiter(this, void 0, void 0, function* () {
            const certificateManager = new RootCertificateManager();
            const ipkValue = Crypto_1.Crypto.getRandomData(16);
            const fabricBuilder = new Fabric_1.FabricBuilder(FABRIC_INDEX)
                .setRootCert(certificateManager.getRootCert())
                .setRootNodeId(CONTROLLER_NODE_ID)
                .setIdentityProtectionKey(ipkValue)
                .setRootVendorId(ADMIN_VENDOR_ID);
            fabricBuilder.setOperationalCert(certificateManager.generateNoc(fabricBuilder.getPublicKey(), FABRIC_ID, CONTROLLER_NODE_ID));
            const fabric = yield fabricBuilder.build();
            return new MatterController(scanner, netInterfaceIpv4, netInterfaceIpv6, certificateManager, fabric);
        });
    }
    commission(commissionAddress, commissionPort, discriminator, setupPin) {
        return __awaiter(this, void 0, void 0, function* () {
            const paseInterface = (0, Ip_1.isIPv6)(commissionAddress) ? this.netInterfaceIpv6 : this.netInterfaceIpv4;
            const paseChannel = yield paseInterface.openChannel(commissionAddress, commissionPort);
            const paseUnsecureMessageChannel = new ExchangeManager_1.MessageChannel(paseChannel, this.sessionManager.getUnsecureSession());
            const paseSecureSession = yield this.paseClient.pair(this, this.exchangeManager.initiateExchangeWithChannel(paseUnsecureMessageChannel, SecureChannelMessages_1.SECURE_CHANNEL_PROTOCOL_ID), setupPin);
            const paseSecureMessageChannel = new ExchangeManager_1.MessageChannel(paseChannel, paseSecureSession);
            let interactionClient = new InteractionClient_1.InteractionClient(this.exchangeManager, paseSecureMessageChannel);
            const basicClusterClient = (0, InteractionClient_1.ClusterClient)(interactionClient, 0, BasicInformationCluster_1.BasicInformationCluster);
            const productName = yield basicClusterClient.getProductName();
            logger.info("Paired with device:", productName);
            let generalCommissioningClusterClient = (0, InteractionClient_1.ClusterClient)(interactionClient, 0, GeneralCommissioningCluster_1.GeneralCommissioningCluster);
            this.ensureSuccess(yield generalCommissioningClusterClient.armFailSafe({ breadcrumbStep: BigInt(1), expiryLengthSeconds: 60 }));
            this.ensureSuccess(yield generalCommissioningClusterClient.setRegulatoryConfig({ breadcrumbStep: BigInt(2), newRegulatoryConfig: 2, countryCode: "US" }));
            const operationalCredentialsClusterClient = (0, InteractionClient_1.ClusterClient)(interactionClient, 0, OperationalCredentialsCluster_1.OperationalCredentialsCluster);
            const { certificate: deviceAttestation } = yield operationalCredentialsClusterClient.requestCertChain({ type: 1 });
            const { certificate: productAttestation } = yield operationalCredentialsClusterClient.requestCertChain({ type: 2 });
            const { elements: attestationElements, signature: attestationSignature } = yield operationalCredentialsClusterClient.requestAttestation({ attestationNonce: Crypto_1.Crypto.getRandomData(32) });
            const { elements: csrElements, signature: csrSignature } = yield operationalCredentialsClusterClient.requestCertSigning({ certSigningRequestNonce: Crypto_1.Crypto.getRandomData(32) });
            const { certSigningRequest } = OperationalCredentialsCluster_1.TlvCertSigningRequest.decode(csrElements);
            const operationalPublicKey = CertificateManager_1.CertificateManager.getPublicKeyFromCsr(certSigningRequest);
            yield operationalCredentialsClusterClient.addRootCert({ certificate: this.certificateManager.getRootCert() });
            const peerNodeId = new NodeId_1.NodeId(BigInt(1));
            const peerOperationalCert = this.certificateManager.generateNoc(operationalPublicKey, FABRIC_ID, peerNodeId);
            yield operationalCredentialsClusterClient.addOperationalCert({
                operationalCert: peerOperationalCert,
                intermediateCaCert: new matter_js_1.ByteArray(0),
                identityProtectionKey: this.fabric.identityProtectionKey,
                adminVendorId: ADMIN_VENDOR_ID,
                caseAdminNode: CONTROLLER_NODE_ID,
            });
            const scanResult = yield this.scanner.findDevice(this.fabric, peerNodeId);
            if (scanResult === undefined)
                throw new Error("The device being commissioned cannot be found on the network");
            const { ip: operationalIp, port: operationalPort } = scanResult;
            const operationalInterface = (0, Ip_1.isIPv6)(operationalIp) ? this.netInterfaceIpv6 : this.netInterfaceIpv4;
            const operationalChannel = yield operationalInterface.openChannel(operationalIp, operationalPort);
            const operationalUnsecureMessageExchange = new ExchangeManager_1.MessageChannel(operationalChannel, this.sessionManager.getUnsecureSession());
            const operationalSecureSession = yield this.caseClient.pair(this, this.exchangeManager.initiateExchangeWithChannel(operationalUnsecureMessageExchange, SecureChannelMessages_1.SECURE_CHANNEL_PROTOCOL_ID), this.fabric, peerNodeId);
            this.channelManager.setChannel(this.fabric, peerNodeId, new ExchangeManager_1.MessageChannel(operationalChannel, operationalSecureSession));
            interactionClient = new InteractionClient_1.InteractionClient(this.exchangeManager, this.channelManager.getChannel(this.fabric, peerNodeId));
            generalCommissioningClusterClient = (0, InteractionClient_1.ClusterClient)(interactionClient, 0, GeneralCommissioningCluster_1.GeneralCommissioningCluster);
            this.ensureSuccess(yield generalCommissioningClusterClient.commissioningComplete({}));
            return peerNodeId;
        });
    }
    connect(nodeId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new InteractionClient_1.InteractionClient(this.exchangeManager, this.channelManager.getChannel(this.fabric, nodeId));
        });
    }
    ensureSuccess({ errorCode, debugText }) {
        if (errorCode === 0)
            return;
        throw new Error(`Commission error: ${errorCode}, ${debugText}`);
    }
    getNextAvailableSessionId() {
        return this.sessionManager.getNextAvailableSessionId();
    }
    createSecureSession(sessionId, fabric, peerNodeId, peerSessionId, sharedSecret, salt, isInitiator, isResumption, idleRetransTimeoutMs, activeRetransTimeoutMs) {
        return this.sessionManager.createSecureSession(sessionId, fabric, peerNodeId, peerSessionId, sharedSecret, salt, isInitiator, isResumption, idleRetransTimeoutMs, activeRetransTimeoutMs);
    }
    getResumptionRecord(resumptionId) {
        return this.sessionManager.findResumptionRecordById(resumptionId);
    }
    findResumptionRecordByNodeId(nodeId) {
        return this.sessionManager.findResumptionRecordByNodeId(nodeId);
    }
    saveResumptionRecord(resumptionRecord) {
        return this.sessionManager.saveResumptionRecord(resumptionRecord);
    }
    close() {
        this.scanner.close();
        this.exchangeManager.close();
    }
}
exports.MatterController = MatterController;
class RootCertificateManager {
    constructor() {
        this.rootCertId = BigInt(0);
        this.rootKeyPair = Crypto_1.Crypto.createKeyPair();
        this.rootKeyIdentifier = Crypto_1.Crypto.hash(this.rootKeyPair.publicKey).slice(0, 20);
        this.rootCertBytes = this.generateRootCert();
        this.nextCertificateId = 1;
    }
    getRootCert() {
        return this.rootCertBytes;
    }
    generateRootCert() {
        const now = Time_1.Time.get().now();
        const unsignedCertificate = {
            serialNumber: matter_js_1.ByteArray.of(Number(this.rootCertId)),
            signatureAlgorithm: 1,
            publicKeyAlgorithm: 1,
            ellipticCurveIdentifier: 1,
            issuer: { issuerRcacId: this.rootCertId },
            notBefore: (0, CertificateManager_1.jsToMatterDate)(now, -1),
            notAfter: (0, CertificateManager_1.jsToMatterDate)(now, 10),
            subject: { rcacId: this.rootCertId },
            ellipticCurvePublicKey: this.rootKeyPair.publicKey,
            extensions: {
                basicConstraints: { isCa: true },
                keyUsage: 96,
                subjectKeyIdentifier: this.rootKeyIdentifier,
                authorityKeyIdentifier: this.rootKeyIdentifier,
            },
        };
        const signature = Crypto_1.Crypto.sign(this.rootKeyPair.privateKey, CertificateManager_1.CertificateManager.rootCertToAsn1(unsignedCertificate));
        return CertificateManager_1.TlvRootCertificate.encode(Object.assign(Object.assign({}, unsignedCertificate), { signature }));
    }
    generateNoc(publicKey, fabricId, nodeId) {
        const now = Time_1.Time.get().now();
        const certId = this.nextCertificateId++;
        const unsignedCertificate = {
            serialNumber: matter_js_1.ByteArray.of(certId),
            signatureAlgorithm: 1,
            publicKeyAlgorithm: 1,
            ellipticCurveIdentifier: 1,
            issuer: { issuerRcacId: this.rootCertId },
            notBefore: (0, CertificateManager_1.jsToMatterDate)(now, -1),
            notAfter: (0, CertificateManager_1.jsToMatterDate)(now, 10),
            subject: { fabricId, nodeId },
            ellipticCurvePublicKey: publicKey,
            extensions: {
                basicConstraints: { isCa: false },
                keyUsage: 1,
                extendedKeyUsage: [2, 1],
                subjectKeyIdentifier: Crypto_1.Crypto.hash(publicKey).slice(0, 20),
                authorityKeyIdentifier: this.rootKeyIdentifier,
            },
        };
        const signature = Crypto_1.Crypto.sign(this.rootKeyPair.privateKey, CertificateManager_1.CertificateManager.nocCertToAsn1(unsignedCertificate));
        return CertificateManager_1.TlvOperationalCertificate.encode(Object.assign(Object.assign({}, unsignedCertificate), { signature }));
    }
}
