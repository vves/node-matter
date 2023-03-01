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
exports.MessageCounter = exports.ExchangeCounter = exports.ExchangeManager = exports.MessageChannel = void 0;
const MessageCodec_1 = require("../../codec/MessageCodec");
const Crypto_1 = require("../../crypto/Crypto");
const MessageExchange_1 = require("./MessageExchange");
const Logger_1 = require("../../log/Logger");
const logger = Logger_1.Logger.get("ExchangeManager");
class MessageChannel {
    constructor(channel, session) {
        this.channel = channel;
        this.session = session;
    }
    send(message) {
        logger.debug("sending", MessageCodec_1.MessageCodec.messageToString(message));
        const packet = this.session.encode(message);
        const bytes = MessageCodec_1.MessageCodec.encodePacket(packet);
        return this.channel.send(bytes);
    }
    getName() {
        return `${this.channel.getName()} on session ${this.session.getName()}`;
    }
}
exports.MessageChannel = MessageChannel;
class ExchangeManager {
    constructor(sessionManager, channelManager) {
        this.sessionManager = sessionManager;
        this.channelManager = channelManager;
        this.exchangeCounter = new ExchangeCounter();
        this.messageCounter = new MessageCounter();
        this.exchanges = new Map();
        this.protocols = new Map();
        this.netListeners = new Array();
    }
    addNetInterface(netInterface) {
        this.netListeners.push(netInterface.onData((socket, data) => {
            this.onMessage(socket, data)
                .catch(error => logger.error(error));
        }));
    }
    addProtocolHandler(protocol) {
        this.protocols.set(protocol.getId(), protocol);
    }
    initiateExchange(fabric, nodeId, protocolId) {
        return this.initiateExchangeWithChannel(this.channelManager.getChannel(fabric, nodeId), protocolId);
    }
    initiateExchangeWithChannel(channel, protocolId) {
        const exchangeId = this.exchangeCounter.getIncrementedCounter();
        const exchangeIndex = exchangeId | 0x10000;
        const exchange = MessageExchange_1.MessageExchange.initiate(channel, exchangeId, protocolId, this.messageCounter, () => this.exchanges.delete(exchangeIndex));
        this.exchanges.set(exchangeIndex, exchange);
        return exchange;
    }
    close() {
        this.netListeners.forEach(netListener => netListener.close());
        this.netListeners.length = 0;
        [...this.exchanges.values()].forEach(exchange => exchange.close());
        this.exchanges.clear();
    }
    onMessage(channel, messageBytes) {
        return __awaiter(this, void 0, void 0, function* () {
            const packet = MessageCodec_1.MessageCodec.decodePacket(messageBytes);
            if (packet.header.sessionType === 1)
                throw new Error("Group messages are not supported");
            const session = this.sessionManager.getSession(packet.header.sessionId);
            if (session === undefined)
                throw new Error(`Cannot find a session for ID ${packet.header.sessionId}`);
            const message = session.decode(packet);
            const exchangeIndex = message.payloadHeader.isInitiatorMessage ? message.payloadHeader.exchangeId : (message.payloadHeader.exchangeId | 0x10000);
            const exchange = this.exchanges.get(exchangeIndex);
            if (exchange !== undefined) {
                yield exchange.onMessageReceived(message);
            }
            else {
                const exchange = MessageExchange_1.MessageExchange.fromInitialMessage(this.channelManager.getOrCreateChannel(channel, session), this.messageCounter, message, () => this.exchanges.delete(exchangeIndex));
                this.exchanges.set(exchangeIndex, exchange);
                yield exchange.onMessageReceived(message);
                const protocolHandler = this.protocols.get(message.payloadHeader.protocolId);
                if (protocolHandler === undefined)
                    throw new Error(`Unsupported protocol ${message.payloadHeader.protocolId}`);
                yield protocolHandler.onNewExchange(exchange, message);
            }
        });
    }
}
exports.ExchangeManager = ExchangeManager;
class ExchangeCounter {
    constructor() {
        this.exchangeCounter = Crypto_1.Crypto.getRandomUInt16();
    }
    getIncrementedCounter() {
        this.exchangeCounter++;
        if (this.exchangeCounter > 0xFFFF) {
            this.exchangeCounter = 0;
        }
        return this.exchangeCounter;
    }
}
exports.ExchangeCounter = ExchangeCounter;
class MessageCounter {
    constructor() {
        this.messageCounter = Crypto_1.Crypto.getRandomUInt32();
    }
    getIncrementedCounter() {
        this.messageCounter++;
        if (this.messageCounter > 0xFFFFFFFF) {
            this.messageCounter = 0;
        }
        return this.messageCounter;
    }
}
exports.MessageCounter = MessageCounter;
