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
exports.MessageExchange = void 0;
const MessageCodec_1 = require("../../codec/MessageCodec");
const Queue_1 = require("../../util/Queue");
const Session_1 = require("../session/Session");
const SecureChannelMessages_1 = require("../session/secure/SecureChannelMessages");
const Promises_1 = require("../../util/Promises");
const Time_1 = require("../../time/Time");
const Logger_1 = require("../../log/Logger");
const matter_js_1 = require("@project-chip/matter.js");
const SecureChannelProtocol_1 = require("../session/secure/SecureChannelProtocol");
const logger = Logger_1.Logger.get("MessageExchange");
const MRP_BACKOFF_BASE = 1.6;
const MRP_BACKOFF_JITTER = 0.25;
const MRP_BACKOFF_MARGIN = 1.1;
const MRP_BACKOFF_THRESHOLD = 1;
const MRP_STANDALONE_ACK_TIMEOUT = 200;
const MAXIMUM_TRANSMISSION_TIME_MS = 9495;
class MessageExchange {
    constructor(session, channel, messageCounter, isInitiator, peerSessionId, nodeId, peerNodeId, exchangeId, protocolId, closeCallback) {
        this.session = session;
        this.channel = channel;
        this.messageCounter = messageCounter;
        this.isInitiator = isInitiator;
        this.peerSessionId = peerSessionId;
        this.nodeId = nodeId;
        this.peerNodeId = peerNodeId;
        this.exchangeId = exchangeId;
        this.protocolId = protocolId;
        this.closeCallback = closeCallback;
        this.messagesQueue = new Queue_1.Queue();
        const { activeRetransmissionTimeoutMs, idleRetransmissionTimeoutMs, retransmissionRetries } = session.getMrpParameters();
        this.activeRetransmissionTimeoutMs = activeRetransmissionTimeoutMs !== null && activeRetransmissionTimeoutMs !== void 0 ? activeRetransmissionTimeoutMs : Session_1.SLEEPY_ACTIVE_INTERVAL_MS;
        this.idleRetransmissionTimeoutMs = idleRetransmissionTimeoutMs !== null && idleRetransmissionTimeoutMs !== void 0 ? idleRetransmissionTimeoutMs : Session_1.SLEEPY_IDLE_INTERVAL_MS;
        this.retransmissionRetries = retransmissionRetries;
        logger.debug("new MessageExchange", this.protocolId, this.exchangeId, this.activeRetransmissionTimeoutMs, this.idleRetransmissionTimeoutMs, this.retransmissionRetries);
    }
    static fromInitialMessage(channel, messageCounter, initialMessage, closeCallback) {
        const { session } = channel;
        const exchange = new MessageExchange(session, channel, messageCounter, false, session.getId(), initialMessage.packetHeader.destNodeId, initialMessage.packetHeader.sourceNodeId, initialMessage.payloadHeader.exchangeId, initialMessage.payloadHeader.protocolId, closeCallback);
        return exchange;
    }
    static initiate(channel, exchangeId, protocolId, messageCounter, closeCallback) {
        const { session } = channel;
        return new MessageExchange(session, channel, messageCounter, true, session.getPeerSessionId(), session.getNodeId(), session.getPeerNodeId(), exchangeId, protocolId, closeCallback);
    }
    onMessageReceived(message) {
        var _a, _b, _c, _d, _e;
        return __awaiter(this, void 0, void 0, function* () {
            const { packetHeader: { messageId }, payloadHeader: { requiresAck, ackedMessageId, protocolId, messageType } } = message;
            logger.debug("onMessageReceived", this.protocolId, MessageCodec_1.MessageCodec.messageToString(message));
            this.session.notifyActivity(true);
            if (messageId === ((_a = this.receivedMessageToAck) === null || _a === void 0 ? void 0 : _a.packetHeader.messageId)) {
                if (requiresAck) {
                    yield this.send(16, new matter_js_1.ByteArray(0));
                }
                return;
            }
            if (messageId === ((_b = this.sentMessageToAck) === null || _b === void 0 ? void 0 : _b.payloadHeader.ackedMessageId)) {
                yield this.channel.send(this.sentMessageToAck);
                return;
            }
            const sentMessageIdToAck = (_c = this.sentMessageToAck) === null || _c === void 0 ? void 0 : _c.packetHeader.messageId;
            if (sentMessageIdToAck !== undefined) {
                if (ackedMessageId === undefined) {
                    throw new Error("Previous message ack is missing");
                }
                else if (ackedMessageId !== sentMessageIdToAck) {
                    if (SecureChannelProtocol_1.SecureChannelProtocol.isStandaloneAck(protocolId, messageType)) {
                    }
                    else {
                        throw new Error(`Incorrect ack received. Expected ${sentMessageIdToAck}, received: ${ackedMessageId}`);
                    }
                }
                else {
                    (_d = this.sentMessageAckSuccess) === null || _d === void 0 ? void 0 : _d.call(this);
                    (_e = this.retransmissionTimer) === null || _e === void 0 ? void 0 : _e.stop();
                    this.sentMessageAckSuccess = undefined;
                    this.sentMessageAckFailure = undefined;
                    this.sentMessageToAck = undefined;
                }
            }
            if (SecureChannelProtocol_1.SecureChannelProtocol.isStandaloneAck(protocolId, messageType)) {
                return;
            }
            if (protocolId !== this.protocolId) {
                throw new Error(`Received a message for an unexpected protocol. Expected: ${this.protocolId}, received: ${protocolId}`);
            }
            if (requiresAck) {
                this.receivedMessageToAck = message;
            }
            yield this.messagesQueue.write(message);
        });
    }
    send(messageType, payload) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            if (this.sentMessageToAck !== undefined)
                throw new Error("The previous message has not been acked yet, cannot send a new message");
            this.session.notifyActivity(false);
            const message = {
                packetHeader: {
                    sessionId: this.peerSessionId,
                    sessionType: 0,
                    messageId: this.messageCounter.getIncrementedCounter(),
                    destNodeId: this.peerNodeId,
                    sourceNodeId: this.nodeId,
                },
                payloadHeader: {
                    exchangeId: this.exchangeId,
                    protocolId: messageType === 16 ? SecureChannelMessages_1.SECURE_CHANNEL_PROTOCOL_ID : this.protocolId,
                    messageType,
                    isInitiatorMessage: this.isInitiator,
                    requiresAck: messageType !== 16,
                    ackedMessageId: (_a = this.receivedMessageToAck) === null || _a === void 0 ? void 0 : _a.packetHeader.messageId,
                },
                payload,
            };
            if (messageType !== 16) {
                this.receivedMessageToAck = undefined;
            }
            let ackPromise;
            if (message.payloadHeader.requiresAck) {
                this.sentMessageToAck = message;
                this.retransmissionTimer = Time_1.Time.getTimer(this.getResubmissionBackOffTime(0), () => this.retransmitMessage(message, 0));
                const { promise, resolver, rejecter } = yield (0, Promises_1.getPromiseResolver)();
                ackPromise = promise;
                this.sentMessageAckSuccess = resolver;
                this.sentMessageAckFailure = rejecter;
            }
            yield this.channel.send(message);
            if (ackPromise !== undefined) {
                (_b = this.retransmissionTimer) === null || _b === void 0 ? void 0 : _b.start();
                yield ackPromise;
                (_c = this.retransmissionTimer) === null || _c === void 0 ? void 0 : _c.stop();
                this.sentMessageAckSuccess = undefined;
                this.sentMessageAckFailure = undefined;
            }
        });
    }
    nextMessage() {
        return this.messagesQueue.read();
    }
    waitFor(messageType) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield this.messagesQueue.read();
            const { payloadHeader: { messageType: receivedMessageType } } = message;
            if (receivedMessageType !== messageType)
                throw new Error(`Received unexpected message type ${receivedMessageType.toString(16)}. Expected ${messageType.toString(16)}`);
            return message;
        });
    }
    getResubmissionBackOffTime(retransmissionCount) {
        const baseInterval = this.session.isPeerActive() ? this.activeRetransmissionTimeoutMs : this.idleRetransmissionTimeoutMs;
        return Math.floor(MRP_BACKOFF_MARGIN * baseInterval * Math.pow(MRP_BACKOFF_BASE, Math.max(0, retransmissionCount - MRP_BACKOFF_THRESHOLD)) * (1 + Math.random() * MRP_BACKOFF_JITTER));
    }
    retransmitMessage(message, retransmissionCount) {
        retransmissionCount++;
        if (retransmissionCount === this.retransmissionRetries) {
            if (this.sentMessageToAck !== undefined && this.sentMessageAckFailure !== undefined) {
                this.receivedMessageToAck = undefined;
                this.sentMessageAckFailure(new Error("Message retransmission limit reached"));
                this.sentMessageAckFailure = undefined;
                this.sentMessageAckSuccess = undefined;
            }
            return;
        }
        this.session.notifyActivity(false);
        if (retransmissionCount === 1) {
        }
        const resubmissionBackoffTime = this.getResubmissionBackOffTime(retransmissionCount);
        logger.debug(`Resubmit message ${message.packetHeader.messageId} (attempt ${retransmissionCount}, next backoff time ${resubmissionBackoffTime}ms))`);
        this.channel.send(message)
            .then(() => {
            this.retransmissionTimer = Time_1.Time.getTimer(resubmissionBackoffTime, () => this.retransmitMessage(message, retransmissionCount))
                .start();
        })
            .catch(error => logger.error("An error happened when retransmitting a message", error));
    }
    close() {
        if (this.receivedMessageToAck !== undefined) {
            this.send(16, new matter_js_1.ByteArray(0))
                .catch(error => logger.error("An error happened when closing the exchange", error));
        }
        Time_1.Time.getTimer(MAXIMUM_TRANSMISSION_TIME_MS, () => this.closeInternal()).start();
    }
    closeInternal() {
        var _a;
        (_a = this.retransmissionTimer) === null || _a === void 0 ? void 0 : _a.stop();
        this.messagesQueue.close();
        this.closeCallback();
    }
}
exports.MessageExchange = MessageExchange;
