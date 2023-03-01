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
exports.GeneralCommissioningClusterHandler = void 0;
const Logger_1 = require("../../../log/Logger");
const SuccessResponse = { errorCode: 0, debugText: "" };
const logger = Logger_1.Logger.get("GeneralCommissioningClusterHandler");
exports.GeneralCommissioningClusterHandler = {
    armFailSafe: ({ request: { breadcrumbStep }, attributes: { breadcrumb }, session }) => __awaiter(void 0, void 0, void 0, function* () {
        session.getContext().armFailSafe();
        breadcrumb.set(breadcrumbStep);
        return SuccessResponse;
    }),
    setRegulatoryConfig: ({ request: { breadcrumbStep, newRegulatoryConfig, countryCode }, attributes: { breadcrumb, regulatoryConfig, locationCapability } }) => __awaiter(void 0, void 0, void 0, function* () {
        const locationCapabilityValue = locationCapability.get();
        let validValues;
        switch (locationCapabilityValue) {
            case (1):
                validValues = [1];
                break;
            case (0):
                validValues = [0];
                break;
            case (2):
                validValues = [0, 1];
                break;
            default:
                return { errorCode: 1, debugText: "Invalid regulatory location" };
        }
        regulatoryConfig.set(newRegulatoryConfig);
        breadcrumb.set(breadcrumbStep);
        return SuccessResponse;
    }),
    commissioningComplete: ({ session, attributes: { breadcrumb } }) => __awaiter(void 0, void 0, void 0, function* () {
        if (!session.isSecure())
            throw new Error("commissioningComplete can only be called on a secure session");
        const fabric = session.getFabric();
        if (fabric === undefined)
            throw new Error("commissioningComplete is called but the fabric has not been defined yet");
        breadcrumb.set(BigInt(0));
        logger.info(`Commissioning completed on fabric #${fabric.fabricId.id} as node #${fabric.nodeId}.`);
        return SuccessResponse;
    }),
};
