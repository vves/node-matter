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
exports.CaseClient = void 0;
const CertificateManager_1 = require("../../certificate/CertificateManager");
const Crypto_1 = require("../../../crypto/Crypto");
const CaseMessages_1 = require("./CaseMessages");
const CaseMessenger_1 = require("./CaseMessenger");
const Logger_1 = require("../../../log/Logger");
const matter_js_1 = require("@project-chip/matter.js");
const logger = Logger_1.Logger.get("CaseClient");
class CaseClient {
    constructor() { }
    pair(client, exchange, fabric, peerNodeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const messenger = new CaseMessenger_1.CaseClientMessenger(exchange);
            const random = Crypto_1.Crypto.getRandom();
            const sessionId = client.getNextAvailableSessionId();
            const { operationalIdentityProtectionKey, operationalCert: nodeOpCert, intermediateCACert, nodeId } = fabric;
            const { publicKey: ecdhPublicKey, ecdh } = Crypto_1.Crypto.ecdhGeneratePublicKey();
            let sigma1Bytes;
            let resumptionRecord = client.findResumptionRecordByNodeId(peerNodeId);
            if (resumptionRecord !== undefined) {
                const { sharedSecret, resumptionId } = resumptionRecord;
                const resumeKey = yield Crypto_1.Crypto.hkdf(sharedSecret, matter_js_1.ByteArray.concat(random, resumptionId), CaseMessages_1.KDFSR1_KEY_INFO);
                const resumeMic = Crypto_1.Crypto.encrypt(resumeKey, new matter_js_1.ByteArray(0), CaseMessages_1.RESUME1_MIC_NONCE);
                sigma1Bytes = yield messenger.sendSigma1({ sessionId, destinationId: fabric.getDestinationId(peerNodeId, random), ecdhPublicKey, random, resumptionId, resumeMic });
            }
            else {
                sigma1Bytes = yield messenger.sendSigma1({ sessionId, destinationId: fabric.getDestinationId(peerNodeId, random), ecdhPublicKey, random });
            }
            let secureSession;
            const { sigma2Bytes, sigma2, sigma2Resume } = yield messenger.readSigma2();
            if (sigma2Resume !== undefined) {
                if (resumptionRecord === undefined)
                    throw new Error("Received an unexpected sigma2Resume");
                const { sharedSecret, fabric } = resumptionRecord;
                const { sessionId: peerSessionId, resumptionId, resumeMic } = sigma2Resume;
                const resumeSalt = matter_js_1.ByteArray.concat(random, resumptionId);
                const resumeKey = yield Crypto_1.Crypto.hkdf(sharedSecret, resumeSalt, CaseMessages_1.KDFSR2_KEY_INFO);
                Crypto_1.Crypto.decrypt(resumeKey, resumeMic, CaseMessages_1.RESUME2_MIC_NONCE);
                const secureSessionSalt = matter_js_1.ByteArray.concat(random, resumptionRecord.resumptionId);
                secureSession = yield client.createSecureSession(sessionId, fabric, peerNodeId, peerSessionId, sharedSecret, secureSessionSalt, true, true);
                yield messenger.sendSuccess();
                logger.info(`Case client: session resumed with ${messenger.getChannelName()}`);
                resumptionRecord.resumptionId = resumptionId;
            }
            else {
                const { ecdhPublicKey: peerEcdhPublicKey, encrypted: peerEncrypted, random: peerRandom, sessionId: peerSessionId } = sigma2;
                const sharedSecret = Crypto_1.Crypto.ecdhGenerateSecret(peerEcdhPublicKey, ecdh);
                const sigma2Salt = matter_js_1.ByteArray.concat(operationalIdentityProtectionKey, peerRandom, peerEcdhPublicKey, Crypto_1.Crypto.hash(sigma1Bytes));
                const sigma2Key = yield Crypto_1.Crypto.hkdf(sharedSecret, sigma2Salt, CaseMessages_1.KDFSR2_INFO);
                const peerEncryptedData = Crypto_1.Crypto.decrypt(sigma2Key, peerEncrypted, CaseMessages_1.TBE_DATA2_NONCE);
                const { nodeOpCert: peerNewOpCert, intermediateCACert: peerIntermediateCACert, signature: peerSignature, resumptionId: peerResumptionId } = CaseMessages_1.TlvEncryptedDataSigma2.decode(peerEncryptedData);
                const peerSignatureData = CaseMessages_1.TlvSignedData.encode({ nodeOpCert: peerNewOpCert, intermediateCACert: peerIntermediateCACert, ecdhPublicKey: peerEcdhPublicKey, peerEcdhPublicKey: ecdhPublicKey });
                const { ellipticCurvePublicKey: peerPublicKey, subject: { nodeId: peerNodeIdCert } } = CertificateManager_1.TlvOperationalCertificate.decode(peerNewOpCert);
                if (peerNodeIdCert.id !== peerNodeId.id)
                    throw new Error("The node ID in the peer certificate doesn't match the expected peer node ID");
                Crypto_1.Crypto.verify(peerPublicKey, peerSignatureData, peerSignature);
                const sigma3Salt = matter_js_1.ByteArray.concat(operationalIdentityProtectionKey, Crypto_1.Crypto.hash([sigma1Bytes, sigma2Bytes]));
                const sigma3Key = yield Crypto_1.Crypto.hkdf(sharedSecret, sigma3Salt, CaseMessages_1.KDFSR3_INFO);
                const signatureData = CaseMessages_1.TlvSignedData.encode({ nodeOpCert, intermediateCACert, ecdhPublicKey, peerEcdhPublicKey });
                const signature = fabric.sign(signatureData);
                const encryptedData = CaseMessages_1.TlvEncryptedDataSigma3.encode({ nodeOpCert, intermediateCACert, signature });
                const encrypted = Crypto_1.Crypto.encrypt(sigma3Key, encryptedData, CaseMessages_1.TBE_DATA3_NONCE);
                const sigma3Bytes = yield messenger.sendSigma3({ encrypted });
                yield messenger.waitForSuccess();
                const secureSessionSalt = matter_js_1.ByteArray.concat(operationalIdentityProtectionKey, Crypto_1.Crypto.hash([sigma1Bytes, sigma2Bytes, sigma3Bytes]));
                secureSession = yield client.createSecureSession(sessionId, fabric, peerNodeId, peerSessionId, sharedSecret, secureSessionSalt, true, false);
                logger.info(`Case client: Paired succesfully with ${messenger.getChannelName()}`);
                resumptionRecord = { fabric, peerNodeId, sharedSecret, resumptionId: peerResumptionId };
            }
            messenger.close();
            client.saveResumptionRecord(resumptionRecord);
            return secureSession;
        });
    }
}
exports.CaseClient = CaseClient;
