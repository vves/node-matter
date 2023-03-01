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
exports.SessionManager = exports.UNICAST_UNSECURE_SESSION_ID = exports.UNDEFINED_NODE_ID = void 0;
const Crypto_1 = require("../../crypto/Crypto");
const NodeId_1 = require("../common/NodeId");
const SecureSession_1 = require("./SecureSession");
const UnsecureSession_1 = require("./UnsecureSession");
exports.UNDEFINED_NODE_ID = new NodeId_1.NodeId(BigInt(0));
exports.UNICAST_UNSECURE_SESSION_ID = 0x0000;
class SessionManager {
    constructor(context) {
        this.context = context;
        this.sessions = new Map();
        this.nextSessionId = Crypto_1.Crypto.getRandomUInt16();
        this.resumptionRecords = new Map();
        this.unsecureSession = new UnsecureSession_1.UnsecureSession(context);
        this.sessions.set(exports.UNICAST_UNSECURE_SESSION_ID, this.unsecureSession);
    }
    createSecureSession(sessionId, fabric, peerNodeId, peerSessionId, sharedSecret, salt, isInitiator, isResumption, idleRetransTimeoutMs, activeRetransTimeoutMs) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield SecureSession_1.SecureSession.create(this.context, sessionId, fabric, peerNodeId, peerSessionId, sharedSecret, salt, isInitiator, isResumption, idleRetransTimeoutMs, activeRetransTimeoutMs);
            this.sessions.set(sessionId, session);
            return session;
        });
    }
    getNextAvailableSessionId() {
        while (true) {
            if (this.sessions.has(this.nextSessionId)) {
                this.nextSessionId = (this.nextSessionId + 1) & 0xFFFF;
                if (this.nextSessionId === 0)
                    this.nextSessionId++;
                continue;
            }
            return this.nextSessionId++;
        }
    }
    getSession(sessionId) {
        return this.sessions.get(sessionId);
    }
    getSessionForNode(fabric, nodeId) {
        return [...this.sessions.values()].find(session => {
            if (!session.isSecure())
                return false;
            const secureSession = session;
            return secureSession.getFabric() === fabric && secureSession.getPeerNodeId() === nodeId;
        });
    }
    getUnsecureSession() {
        return this.unsecureSession;
    }
    findResumptionRecordById(resumptionId) {
        return [...this.resumptionRecords.values()].find(record => record.resumptionId.equals(resumptionId));
    }
    findResumptionRecordByNodeId(nodeId) {
        return this.resumptionRecords.get(nodeId);
    }
    saveResumptionRecord(resumptionRecord) {
        this.resumptionRecords.set(resumptionRecord.peerNodeId, resumptionRecord);
    }
}
exports.SessionManager = SessionManager;
