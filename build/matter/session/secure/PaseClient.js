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
exports.PaseClient = void 0;
const Crypto_1 = require("../../../crypto/Crypto");
const Spake2p_1 = require("../../../crypto/Spake2p");
const Logger_1 = require("../../../log/Logger");
const SessionManager_1 = require("../SessionManager");
const PaseMessenger_1 = require("./PaseMessenger");
const matter_js_1 = require("@project-chip/matter.js");
const logger = Logger_1.Logger.get("PaseClient");
class PaseClient {
    pair(client, exchange, setupPin) {
        return __awaiter(this, void 0, void 0, function* () {
            const messenger = new PaseMessenger_1.PaseClientMessenger(exchange);
            const random = Crypto_1.Crypto.getRandom();
            const sessionId = client.getNextAvailableSessionId();
            const requestPayload = yield messenger.sendPbkdfParamRequest({ random, sessionId, passcodeId: PaseMessenger_1.DEFAULT_PASSCODE_ID, hasPbkdfParameters: false });
            const { responsePayload, response: { pbkdfParameters, sessionId: peerSessionId } } = yield messenger.readPbkdfParamResponse();
            if (pbkdfParameters === undefined)
                throw new Error("Missing requested PbkdfParameters in the response");
            const { w0, w1 } = yield Spake2p_1.Spake2p.computeW0W1(pbkdfParameters, setupPin);
            const spake2p = yield Spake2p_1.Spake2p.create(Crypto_1.Crypto.hash([PaseMessenger_1.SPAKE_CONTEXT, requestPayload, responsePayload]), w0);
            const X = spake2p.computeX();
            yield messenger.sendPasePake1({ x: X });
            const { y: Y, verifier } = yield messenger.readPasePake2();
            const { Ke, hAY, hBX } = yield spake2p.computeSecretAndVerifiersFromY(w1, X, Y);
            if (!verifier.equals(hBX))
                throw new Error("Received incorrect key confirmation from the receiver");
            yield messenger.sendPasePake3({ verifier: hAY });
            yield messenger.waitForSuccess();
            const secureSession = yield client.createSecureSession(sessionId, undefined, SessionManager_1.UNDEFINED_NODE_ID, peerSessionId, Ke, new matter_js_1.ByteArray(0), true, false);
            messenger.close();
            logger.info(`Pase client: Paired succesfully with ${messenger.getChannelName()}`);
            return secureSession;
        });
    }
}
exports.PaseClient = PaseClient;
