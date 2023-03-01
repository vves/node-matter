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
exports.SecureChannelProtocol = void 0;
const SecureChannelMessages_1 = require("./SecureChannelMessages");
class SecureChannelProtocol {
    constructor(paseCommissioner, caseCommissioner) {
        this.paseCommissioner = paseCommissioner;
        this.caseCommissioner = caseCommissioner;
    }
    getId() {
        return SecureChannelMessages_1.SECURE_CHANNEL_PROTOCOL_ID;
    }
    updatePaseCommissioner(paseServer) {
        this.paseCommissioner = paseServer;
    }
    onNewExchange(exchange, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const messageType = message.payloadHeader.messageType;
            switch (messageType) {
                case 32:
                    yield this.paseCommissioner.onNewExchange(exchange);
                    break;
                case 48:
                    yield this.caseCommissioner.onNewExchange(exchange);
                    break;
                default:
                    throw new Error(`Unexpected initial message on secure channel protocol: ${messageType.toString(16)}`);
            }
        });
    }
    static isStandaloneAck(protocolId, messageType) {
        return protocolId === SecureChannelMessages_1.SECURE_CHANNEL_PROTOCOL_ID && messageType === 16;
    }
}
exports.SecureChannelProtocol = SecureChannelProtocol;
