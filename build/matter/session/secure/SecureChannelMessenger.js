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
exports.SecureChannelMessenger = void 0;
const SecureChannelMessages_1 = require("./SecureChannelMessages");
const matter_js_1 = require("@project-chip/matter.js");
class SecureChannelMessenger {
    constructor(exchange) {
        this.exchange = exchange;
    }
    nextMessage(expectedMessageType) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield this.exchange.nextMessage();
            const messageType = message.payloadHeader.messageType;
            this.throwIfError(messageType, message.payload);
            if (expectedMessageType !== undefined && messageType !== expectedMessageType)
                throw new Error(`Received unexpected message type: ${messageType}, expected: ${expectedMessageType}`);
            return message;
        });
    }
    nextMessageDecoded(expectedMessageType, schema) {
        return __awaiter(this, void 0, void 0, function* () {
            return schema.decode((yield this.nextMessage(expectedMessageType)).payload);
        });
    }
    waitForSuccess() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.nextMessage(64);
        });
    }
    send(message, type, schema) {
        return __awaiter(this, void 0, void 0, function* () {
            const payload = schema.encode(message);
            yield this.exchange.send(type, payload);
            return payload;
        });
    }
    sendError() {
        return this.sendStatusReport(1, 2);
    }
    sendSuccess() {
        return this.sendStatusReport(0, 0);
    }
    getChannelName() {
        return this.exchange.channel.channel.getName();
    }
    close() {
        this.exchange.close();
    }
    sendStatusReport(generalStatus, protocolStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const writer = new matter_js_1.DataWriter(matter_js_1.Endian.Little);
            writer.writeUInt16(generalStatus);
            writer.writeUInt32(SecureChannelMessages_1.SECURE_CHANNEL_PROTOCOL_ID);
            writer.writeUInt16(protocolStatus);
            yield this.exchange.send(64, writer.toByteArray());
        });
    }
    throwIfError(messageType, payload) {
        if (messageType !== 64)
            return;
        const reader = new matter_js_1.DataReader(payload, matter_js_1.Endian.Little);
        const generalStatus = reader.readUInt16();
        if (generalStatus === 0)
            return;
        const protocolId = reader.readUInt32();
        const protocolStatus = reader.readUInt16();
        throw new Error(`Received error status: ${generalStatus} ${protocolId} ${protocolStatus}`);
    }
}
exports.SecureChannelMessenger = SecureChannelMessenger;
