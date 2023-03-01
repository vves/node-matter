"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnsecureSession = void 0;
const MessageCodec_1 = require("../../codec/MessageCodec");
const Session_1 = require("./Session");
const SessionManager_1 = require("./SessionManager");
const NodeId_1 = require("../common/NodeId");
class UnsecureSession {
    constructor(context) {
        this.context = context;
        this.initiatorNodeId = NodeId_1.NodeId.getRandomOperationalNodeId();
    }
    isSecure() {
        return false;
    }
    notifyActivity(messageReceived) {
    }
    isPeerActive() {
        return true;
    }
    decode(packet) {
        return MessageCodec_1.MessageCodec.decodePayload(packet);
    }
    encode(message) {
        return MessageCodec_1.MessageCodec.encodePayload(message);
    }
    getAttestationChallengeKey() {
        throw new Error("Not supported on an unsecure session");
    }
    setFabric(fabric) {
        throw new Error("Not supported on an unsecure session");
    }
    getName() {
        return "unsecure";
    }
    getMrpParameters() {
        return {
            idleRetransmissionTimeoutMs: Session_1.DEFAULT_IDLE_RETRANSMISSION_TIMEOUT_MS,
            activeRetransmissionTimeoutMs: Session_1.DEFAULT_ACTIVE_RETRANSMISSION_TIMEOUT_MS,
            retransmissionRetries: Session_1.DEFAULT_RETRANSMISSION_RETRIES,
        };
    }
    getContext() {
        return this.context;
    }
    getId() {
        return SessionManager_1.UNICAST_UNSECURE_SESSION_ID;
    }
    getPeerSessionId() {
        return SessionManager_1.UNICAST_UNSECURE_SESSION_ID;
    }
    getNodeId() {
        return this.initiatorNodeId;
    }
    getPeerNodeId() {
        return undefined;
    }
}
exports.UnsecureSession = UnsecureSession;
