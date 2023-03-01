"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneralCommissioningCluster = void 0;
const Cluster_1 = require("./Cluster");
const matter_js_1 = require("@project-chip/matter.js");
const TlvBasicCommissioningInfo = (0, matter_js_1.TlvObject)({
    failSafeExpiryLengthSeconds: (0, matter_js_1.TlvField)(0, matter_js_1.TlvUInt16),
    maxCumulativeFailsafeSeconds: (0, matter_js_1.TlvField)(1, matter_js_1.TlvUInt16),
});
const TlvCommissioningSuccessFailureResponse = (0, matter_js_1.TlvObject)({
    errorCode: (0, matter_js_1.TlvField)(0, (0, matter_js_1.TlvEnum)()),
    debugText: (0, matter_js_1.TlvField)(1, matter_js_1.TlvString.bound({ maxLength: 128 })),
});
const TlvArmFailSafeRequest = (0, matter_js_1.TlvObject)({
    expiryLengthSeconds: (0, matter_js_1.TlvField)(0, matter_js_1.TlvUInt16),
    breadcrumbStep: (0, matter_js_1.TlvField)(1, matter_js_1.TlvUInt64),
});
const TlvSetRegulatoryConfigRequest = (0, matter_js_1.TlvObject)({
    newRegulatoryConfig: (0, matter_js_1.TlvField)(0, (0, matter_js_1.TlvEnum)()),
    countryCode: (0, matter_js_1.TlvField)(1, matter_js_1.TlvString.bound({ length: 2 })),
    breadcrumbStep: (0, matter_js_1.TlvField)(2, matter_js_1.TlvUInt64),
});
exports.GeneralCommissioningCluster = (0, Cluster_1.Cluster)({
    id: 0x30,
    name: "General Commissioning",
    revision: 1,
    attributes: {
        breadcrumb: (0, Cluster_1.WritableAttribute)(0, matter_js_1.TlvUInt64, { default: BigInt(0), writeAcl: 2 }),
        commissioningInfo: (0, Cluster_1.Attribute)(1, TlvBasicCommissioningInfo),
        regulatoryConfig: (0, Cluster_1.Attribute)(2, (0, matter_js_1.TlvEnum)()),
        locationCapability: (0, Cluster_1.Attribute)(3, (0, matter_js_1.TlvEnum)(), { default: 2 }),
        supportsConcurrentConnections: (0, Cluster_1.Attribute)(4, matter_js_1.TlvBoolean, { default: true }),
    },
    commands: {
        armFailSafe: (0, Cluster_1.Command)(0, TlvArmFailSafeRequest, 1, TlvCommissioningSuccessFailureResponse),
        setRegulatoryConfig: (0, Cluster_1.Command)(2, TlvSetRegulatoryConfigRequest, 3, TlvCommissioningSuccessFailureResponse),
        commissioningComplete: (0, Cluster_1.Command)(4, Cluster_1.TlvNoArguments, 5, TlvCommissioningSuccessFailureResponse),
    },
});
