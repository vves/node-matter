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
exports.CaseClientMessenger = exports.CaseServerMessenger = void 0;
const CaseMessages_1 = require("./CaseMessages");
const SecureChannelMessenger_1 = require("./SecureChannelMessenger");
class CaseServerMessenger extends SecureChannelMessenger_1.SecureChannelMessenger {
    readSigma1() {
        return __awaiter(this, void 0, void 0, function* () {
            const { payload } = yield this.nextMessage(48);
            return { sigma1Bytes: payload, sigma1: CaseMessages_1.TlvCaseSigma1.decode(payload) };
        });
    }
    sendSigma2(sigma2) {
        return this.send(sigma2, 49, CaseMessages_1.TlvCaseSigma2);
    }
    sendSigma2Resume(sigma2Resume) {
        return this.send(sigma2Resume, 51, CaseMessages_1.TlvCaseSigma2Resume);
    }
    readSigma3() {
        return __awaiter(this, void 0, void 0, function* () {
            const { payload } = yield this.nextMessage(50);
            return { sigma3Bytes: payload, sigma3: CaseMessages_1.TlvCaseSigma3.decode(payload) };
        });
    }
}
exports.CaseServerMessenger = CaseServerMessenger;
class CaseClientMessenger extends SecureChannelMessenger_1.SecureChannelMessenger {
    sendSigma1(sigma1) {
        return this.send(sigma1, 48, CaseMessages_1.TlvCaseSigma1);
    }
    readSigma2() {
        return __awaiter(this, void 0, void 0, function* () {
            const { payload, payloadHeader: { messageType } } = yield this.nextMessage();
            switch (messageType) {
                case 49:
                    return { sigma2Bytes: payload, sigma2: CaseMessages_1.TlvCaseSigma2.decode(payload) };
                case 51:
                    return { sigma2Resume: CaseMessages_1.TlvCaseSigma2Resume.decode(payload) };
                default:
                    throw new Error(`Received unexpected message type: ${messageType}, expected: ${49} or ${51}`);
            }
        });
    }
    sendSigma3(sigma3) {
        return this.send(sigma3, 50, CaseMessages_1.TlvCaseSigma3);
    }
}
exports.CaseClientMessenger = CaseClientMessenger;
