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
exports.CaseServer = void 0;
const Crypto_1 = require("../../../crypto/Crypto");
const CaseMessenger_1 = require("./CaseMessenger");
const CaseMessages_1 = require("./CaseMessages");
const CertificateManager_1 = require("../../certificate/CertificateManager");
const SecureChannelMessages_1 = require("./SecureChannelMessages");
const Logger_1 = require("../../../log/Logger");
const matter_js_1 = require("@project-chip/matter.js");
const logger = Logger_1.Logger.get("CaseServer");
class CaseServer {
    onNewExchange(exchange) {
        return __awaiter(this, void 0, void 0, function* () {
            const messenger = new CaseMessenger_1.CaseServerMessenger(exchange);
            try {
                yield this.handleSigma1(exchange.session.getContext(), messenger);
            }
            catch (error) {
                logger.error("An error occurred during the commissioning", error);
                yield messenger.sendError();
            }
        });
    }
    getId() {
        return SecureChannelMessages_1.SECURE_CHANNEL_PROTOCOL_ID;
    }
    handleSigma1(server, messenger) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info(`Case server: Received pairing request from ${messenger.getChannelName()}`);
            const sessionId = server.getNextAvailableSessionId();
            const random = Crypto_1.Crypto.getRandom();
            const { sigma1Bytes, sigma1 } = yield messenger.readSigma1();
            const { sessionId: peerSessionId, resumptionId: peerResumptionId, resumeMic: peerResumeMic, destinationId, random: peerRandom, ecdhPublicKey: peerEcdhPublicKey, mrpParams } = sigma1;
            const resumptionId = Crypto_1.Crypto.getRandomData(16);
            let resumptionRecord;
            if (peerResumptionId !== undefined && peerResumeMic !== undefined && (resumptionRecord = server.findResumptionRecordById(peerResumptionId)) !== undefined) {
                const { sharedSecret, fabric, peerNodeId } = resumptionRecord;
                const peerResumeKey = yield Crypto_1.Crypto.hkdf(sharedSecret, matter_js_1.ByteArray.concat(peerRandom, peerResumptionId), CaseMessages_1.KDFSR1_KEY_INFO);
                Crypto_1.Crypto.decrypt(peerResumeKey, peerResumeMic, CaseMessages_1.RESUME1_MIC_NONCE);
                const resumeSalt = matter_js_1.ByteArray.concat(peerRandom, resumptionId);
                const resumeKey = yield Crypto_1.Crypto.hkdf(sharedSecret, resumeSalt, CaseMessages_1.KDFSR2_KEY_INFO);
                const resumeMic = Crypto_1.Crypto.encrypt(resumeKey, new matter_js_1.ByteArray(0), CaseMessages_1.RESUME2_MIC_NONCE);
                yield messenger.sendSigma2Resume({ resumptionId, resumeMic, sessionId });
                const secureSessionSalt = matter_js_1.ByteArray.concat(peerRandom, peerResumptionId);
                const secureSession = yield server.createSecureSession(sessionId, fabric, peerNodeId, peerSessionId, sharedSecret, secureSessionSalt, false, true, mrpParams === null || mrpParams === void 0 ? void 0 : mrpParams.idleRetransTimeoutMs, mrpParams === null || mrpParams === void 0 ? void 0 : mrpParams.activeRetransTimeoutMs);
                logger.info(`Case server: session ${secureSession.getId()} resumed with ${messenger.getChannelName()}`);
                resumptionRecord.resumptionId = resumptionId;
                yield messenger.waitForSuccess();
            }
            else {
                const fabric = server.findFabricFromDestinationId(destinationId, peerRandom);
                const { operationalCert: nodeOpCert, intermediateCACert, operationalIdentityProtectionKey } = fabric;
                const { publicKey: ecdhPublicKey, sharedSecret } = Crypto_1.Crypto.ecdhGeneratePublicKeyAndSecret(peerEcdhPublicKey);
                const sigma2Salt = matter_js_1.ByteArray.concat(operationalIdentityProtectionKey, random, ecdhPublicKey, Crypto_1.Crypto.hash(sigma1Bytes));
                const sigma2Key = yield Crypto_1.Crypto.hkdf(sharedSecret, sigma2Salt, CaseMessages_1.KDFSR2_INFO);
                const signatureData = CaseMessages_1.TlvSignedData.encode({ nodeOpCert, intermediateCACert, ecdhPublicKey, peerEcdhPublicKey });
                const signature = fabric.sign(signatureData);
                const encryptedData = CaseMessages_1.TlvEncryptedDataSigma2.encode({ nodeOpCert, intermediateCACert, signature, resumptionId });
                const encrypted = Crypto_1.Crypto.encrypt(sigma2Key, encryptedData, CaseMessages_1.TBE_DATA2_NONCE);
                const sigma2Bytes = yield messenger.sendSigma2({ random, sessionId, ecdhPublicKey, encrypted, mrpParams });
                const { sigma3Bytes, sigma3: { encrypted: peerEncrypted } } = yield messenger.readSigma3();
                const sigma3Salt = matter_js_1.ByteArray.concat(operationalIdentityProtectionKey, Crypto_1.Crypto.hash([sigma1Bytes, sigma2Bytes]));
                const sigma3Key = yield Crypto_1.Crypto.hkdf(sharedSecret, sigma3Salt, CaseMessages_1.KDFSR3_INFO);
                const peerEncryptedData = Crypto_1.Crypto.decrypt(sigma3Key, peerEncrypted, CaseMessages_1.TBE_DATA3_NONCE);
                const { nodeOpCert: peerNewOpCert, intermediateCACert: peerIntermediateCACert, signature: peerSignature } = CaseMessages_1.TlvEncryptedDataSigma3.decode(peerEncryptedData);
                fabric.verifyCredentials(peerNewOpCert, peerIntermediateCACert);
                const peerSignatureData = CaseMessages_1.TlvSignedData.encode({ nodeOpCert: peerNewOpCert, intermediateCACert: peerIntermediateCACert, ecdhPublicKey: peerEcdhPublicKey, peerEcdhPublicKey: ecdhPublicKey });
                const { ellipticCurvePublicKey: peerPublicKey, subject: { nodeId: peerNodeId } } = CertificateManager_1.TlvOperationalCertificate.decode(peerNewOpCert);
                Crypto_1.Crypto.verify(peerPublicKey, peerSignatureData, peerSignature);
                const secureSessionSalt = matter_js_1.ByteArray.concat(operationalIdentityProtectionKey, Crypto_1.Crypto.hash([sigma1Bytes, sigma2Bytes, sigma3Bytes]));
                yield server.createSecureSession(sessionId, fabric, peerNodeId, peerSessionId, sharedSecret, secureSessionSalt, false, false, mrpParams === null || mrpParams === void 0 ? void 0 : mrpParams.idleRetransTimeoutMs, mrpParams === null || mrpParams === void 0 ? void 0 : mrpParams.activeRetransTimeoutMs);
                logger.info(`Case server: session ${sessionId} created with ${messenger.getChannelName()}`);
                yield messenger.sendSuccess();
                resumptionRecord = { peerNodeId, fabric, sharedSecret, resumptionId };
            }
            messenger.close();
            server.saveResumptionRecord(resumptionRecord);
        });
    }
}
exports.CaseServer = CaseServer;
