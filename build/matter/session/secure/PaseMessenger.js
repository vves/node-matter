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
exports.PaseClientMessenger = exports.PaseServerMessenger = exports.SPAKE_CONTEXT = exports.DEFAULT_PASSCODE_ID = void 0;
const PaseMessages_1 = require("./PaseMessages");
const SecureChannelMessenger_1 = require("./SecureChannelMessenger");
const matter_js_1 = require("@project-chip/matter.js");
exports.DEFAULT_PASSCODE_ID = 0;
exports.SPAKE_CONTEXT = matter_js_1.ByteArray.fromString("CHIP PAKE V1 Commissioning");
class PaseServerMessenger extends SecureChannelMessenger_1.SecureChannelMessenger {
    readPbkdfParamRequest() {
        return __awaiter(this, void 0, void 0, function* () {
            const { payload } = yield this.nextMessage(32);
            return { requestPayload: payload, request: PaseMessages_1.TlvPbkdfParamRequest.decode(payload) };
        });
    }
    sendPbkdfParamResponse(response) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.send(response, 33, PaseMessages_1.TlvPbkdfParamResponse);
        });
    }
    readPasePake1() {
        return this.nextMessageDecoded(34, PaseMessages_1.TlvPasePake1);
    }
    sendPasePake2(pasePake2) {
        return this.send(pasePake2, 35, PaseMessages_1.TlvPasePake2);
    }
    readPasePake3() {
        return this.nextMessageDecoded(36, PaseMessages_1.TlvPasePake3);
    }
}
exports.PaseServerMessenger = PaseServerMessenger;
class PaseClientMessenger extends SecureChannelMessenger_1.SecureChannelMessenger {
    sendPbkdfParamRequest(request) {
        return this.send(request, 32, PaseMessages_1.TlvPbkdfParamRequest);
    }
    readPbkdfParamResponse() {
        return __awaiter(this, void 0, void 0, function* () {
            const { payload } = yield this.nextMessage(33);
            return { responsePayload: payload, response: PaseMessages_1.TlvPbkdfParamResponse.decode(payload) };
        });
    }
    sendPasePake1(pasePake1) {
        return this.send(pasePake1, 34, PaseMessages_1.TlvPasePake1);
    }
    readPasePake2() {
        return this.nextMessageDecoded(35, PaseMessages_1.TlvPasePake2);
    }
    sendPasePake3(pasePake3) {
        return this.send(pasePake3, 36, PaseMessages_1.TlvPasePake3);
    }
}
exports.PaseClientMessenger = PaseClientMessenger;
