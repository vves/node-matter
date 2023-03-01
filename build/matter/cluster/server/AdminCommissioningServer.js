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
exports.AdminCommissioningHandler = void 0;
const PaseServer_1 = require("../../session/secure/PaseServer");
const AdminCommissioningHandler = (secureChannelProtocol) => ({
    openCommissioningWindow: function ({ request: { pakePasscodeVerifier: pakeVerifier, discriminator, iterations, salt }, session, attributes: { windowStatus } }) {
        return __awaiter(this, void 0, void 0, function* () {
            secureChannelProtocol.updatePaseCommissioner(PaseServer_1.PaseServer.fromVerificationValue(pakeVerifier, { iterations, salt }));
            session.getContext().openCommissioningModeWindow(2, discriminator);
        });
    },
    openBasicCommissioningWindow: function ({}) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Not implemented");
        });
    },
    revokeCommissioning: function (args) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("Not implemented");
        });
    }
});
exports.AdminCommissioningHandler = AdminCommissioningHandler;
