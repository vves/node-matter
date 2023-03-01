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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaseServer = void 0;
const Crypto_1 = require("../../../crypto/Crypto");
const SessionManager_1 = require("../SessionManager");
const PaseMessenger_1 = require("./PaseMessenger");
const Spake2p_1 = require("../../../crypto/Spake2p");
const SecureChannelMessages_1 = require("./SecureChannelMessages");
const Logger_1 = require("../../../log/Logger");
const matter_js_1 = require("@project-chip/matter.js");
const bn_js_1 = __importDefault(require("bn.js"));
const logger = Logger_1.Logger.get("PaseServer");
class PaseServer {
    constructor(w0, L, pbkdfParameters) {
        this.w0 = w0;
        this.L = L;
        this.pbkdfParameters = pbkdfParameters;
    }
    static fromPin(setupPinCode, pbkdfParameters) {
        return __awaiter(this, void 0, void 0, function* () {
            const { w0, L } = yield Spake2p_1.Spake2p.computeW0L(pbkdfParameters, setupPinCode);
            return new PaseServer(w0, L, pbkdfParameters);
        });
    }
    static fromVerificationValue(verificationValue, pbkdfParameters) {
        const w0 = new bn_js_1.default(verificationValue.slice(0, 32));
        const L = verificationValue.slice(32, 32 + 65);
        return new PaseServer(w0, L, pbkdfParameters);
    }
    getId() {
        return SecureChannelMessages_1.SECURE_CHANNEL_PROTOCOL_ID;
    }
    onNewExchange(exchange) {
        return __awaiter(this, void 0, void 0, function* () {
            const messenger = new PaseMessenger_1.PaseServerMessenger(exchange);
            try {
                yield this.handlePairingRequest(exchange.session.getContext(), messenger);
            }
            catch (error) {
                logger.error("An error occured during the commissioning", error);
                yield messenger.sendError();
            }
        });
    }
    handlePairingRequest(server, messenger) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info(`Pase server: Received pairing request from ${messenger.getChannelName()}`);
            const sessionId = server.getNextAvailableSessionId();
            const random = Crypto_1.Crypto.getRandom();
            const { requestPayload, request: { random: peerRandom, mrpParameters, passcodeId, hasPbkdfParameters, sessionId: peerSessionId } } = yield messenger.readPbkdfParamRequest();
            if (passcodeId !== PaseMessenger_1.DEFAULT_PASSCODE_ID)
                throw new Error(`Unsupported passcode ID ${passcodeId}`);
            const responsePayload = yield messenger.sendPbkdfParamResponse({ peerRandom, random, sessionId, mrpParameters, pbkdfParameters: hasPbkdfParameters ? undefined : this.pbkdfParameters });
            const spake2p = yield Spake2p_1.Spake2p.create(Crypto_1.Crypto.hash([PaseMessenger_1.SPAKE_CONTEXT, requestPayload, responsePayload]), this.w0);
            const { x: X } = yield messenger.readPasePake1();
            const Y = spake2p.computeY();
            const { Ke, hAY, hBX } = yield spake2p.computeSecretAndVerifiersFromX(this.L, X, Y);
            yield messenger.sendPasePake2({ y: Y, verifier: hBX });
            const { verifier } = yield messenger.readPasePake3();
            if (!verifier.equals(hAY))
                throw new Error("Received incorrect key confirmation from the initiator");
            yield server.createSecureSession(sessionId, undefined, SessionManager_1.UNDEFINED_NODE_ID, peerSessionId, Ke, new matter_js_1.ByteArray(0), false, false, mrpParameters === null || mrpParameters === void 0 ? void 0 : mrpParameters.idleRetransTimeoutMs, mrpParameters === null || mrpParameters === void 0 ? void 0 : mrpParameters.activeRetransTimeoutMs);
            yield messenger.sendSuccess();
            messenger.close();
            logger.info(`Pase server: session ${sessionId} created with ${messenger.getChannelName()}`);
        });
    }
}
exports.PaseServer = PaseServer;
