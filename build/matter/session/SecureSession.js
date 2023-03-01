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
exports.SecureSession = void 0;
const MessageCodec_1 = require("../../codec/MessageCodec");
const Crypto_1 = require("../../crypto/Crypto");
const Session_1 = require("./Session");
const SessionManager_1 = require("./SessionManager");
const matter_js_1 = require("@project-chip/matter.js");
const Time_1 = require("../../time/Time");
const Logger_1 = require("../../log/Logger");
const logger = Logger_1.Logger.get("SecureSession");
const SESSION_KEYS_INFO = matter_js_1.ByteArray.fromString("SessionKeys");
const SESSION_RESUMPTION_KEYS_INFO = matter_js_1.ByteArray.fromString("SessionResumptionKeys");
class SecureSession {
    constructor(context, id, fabric, peerNodeId, peerSessionId, sharedSecret, decryptKey, encryptKey, attestationKey, idleRetransmissionTimeoutMs = Session_1.DEFAULT_IDLE_RETRANSMISSION_TIMEOUT_MS, activeRetransmissionTimeoutMs = Session_1.DEFAULT_ACTIVE_RETRANSMISSION_TIMEOUT_MS, retransmissionRetries = Session_1.DEFAULT_RETRANSMISSION_RETRIES) {
        this.context = context;
        this.id = id;
        this.fabric = fabric;
        this.peerNodeId = peerNodeId;
        this.peerSessionId = peerSessionId;
        this.sharedSecret = sharedSecret;
        this.decryptKey = decryptKey;
        this.encryptKey = encryptKey;
        this.attestationKey = attestationKey;
        this.idleRetransmissionTimeoutMs = idleRetransmissionTimeoutMs;
        this.activeRetransmissionTimeoutMs = activeRetransmissionTimeoutMs;
        this.retransmissionRetries = retransmissionRetries;
        this.nextSubscriptionId = 0;
        this.subscriptions = new Array();
        this.timestamp = Time_1.Time.nowMs();
        this.activeTimestamp = this.timestamp;
    }
    static create(context, id, fabric, peerNodeId, peerSessionId, sharedSecret, salt, isInitiator, isResumption, idleRetransTimeoutMs, activeRetransTimeoutMs) {
        return __awaiter(this, void 0, void 0, function* () {
            const keys = yield Crypto_1.Crypto.hkdf(sharedSecret, salt, isResumption ? SESSION_RESUMPTION_KEYS_INFO : SESSION_KEYS_INFO, 16 * 3);
            const decryptKey = isInitiator ? keys.slice(16, 32) : keys.slice(0, 16);
            const encryptKey = isInitiator ? keys.slice(0, 16) : keys.slice(16, 32);
            const attestationKey = keys.slice(32, 48);
            return new SecureSession(context, id, fabric, peerNodeId, peerSessionId, sharedSecret, decryptKey, encryptKey, attestationKey, idleRetransTimeoutMs, activeRetransTimeoutMs);
        });
    }
    isSecure() {
        return true;
    }
    notifyActivity(messageReceived) {
        this.timestamp = Time_1.Time.nowMs();
        if (messageReceived) {
            this.activeTimestamp = this.timestamp;
        }
    }
    isPeerActive() {
        return (Time_1.Time.nowMs() - this.activeTimestamp) < Session_1.SLEEPY_ACTIVE_THRESHOLD_MS;
    }
    decode({ header, bytes }) {
        const headerBytes = MessageCodec_1.MessageCodec.encodePacketHeader(header);
        const securityFlags = headerBytes[3];
        const nonce = this.generateNonce(securityFlags, header.messageId, this.peerNodeId);
        return MessageCodec_1.MessageCodec.decodePayload({ header, bytes: Crypto_1.Crypto.decrypt(this.decryptKey, bytes, nonce, headerBytes) });
    }
    encode(message) {
        var _a, _b;
        message.packetHeader.sessionId = this.peerSessionId;
        const { header, bytes } = MessageCodec_1.MessageCodec.encodePayload(message);
        const headerBytes = MessageCodec_1.MessageCodec.encodePacketHeader(message.packetHeader);
        const securityFlags = headerBytes[3];
        const nonce = this.generateNonce(securityFlags, header.messageId, (_b = (_a = this.fabric) === null || _a === void 0 ? void 0 : _a.nodeId) !== null && _b !== void 0 ? _b : SessionManager_1.UNDEFINED_NODE_ID);
        return { header, bytes: Crypto_1.Crypto.encrypt(this.encryptKey, bytes, nonce, headerBytes) };
    }
    getAttestationChallengeKey() {
        return this.attestationKey;
    }
    getFabric() {
        return this.fabric;
    }
    getName() {
        return `secure/${this.id}`;
    }
    getMrpParameters() {
        const { idleRetransmissionTimeoutMs, activeRetransmissionTimeoutMs, retransmissionRetries } = this;
        return { idleRetransmissionTimeoutMs, activeRetransmissionTimeoutMs, retransmissionRetries };
    }
    getContext() {
        return this.context;
    }
    getId() {
        return this.id;
    }
    getPeerSessionId() {
        return this.peerSessionId;
    }
    getNodeId() {
        var _a, _b;
        return (_b = (_a = this.fabric) === null || _a === void 0 ? void 0 : _a.nodeId) !== null && _b !== void 0 ? _b : SessionManager_1.UNDEFINED_NODE_ID;
    }
    getPeerNodeId() {
        return this.peerNodeId;
    }
    addSubscription(subscription) {
        this.subscriptions.push(subscription);
        logger.debug(`Added subscription ${subscription.subscriptionId} to ${this.getName()}/${this.id}`);
    }
    destroy() {
        this.clearSubscriptions();
    }
    clearSubscriptions() {
        this.subscriptions.forEach(subscription => subscription.cancel());
        this.subscriptions.length = 0;
    }
    generateNonce(securityFlags, messageId, nodeId) {
        const writer = new matter_js_1.DataWriter(matter_js_1.Endian.Little);
        writer.writeUInt8(securityFlags);
        writer.writeUInt32(messageId);
        writer.writeUInt64(nodeId.id);
        return writer.toByteArray();
    }
}
exports.SecureSession = SecureSession;
