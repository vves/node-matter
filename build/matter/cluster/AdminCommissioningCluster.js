"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminCommissioningCluster = void 0;
const matter_js_1 = require("@project-chip/matter.js");
const FabricIndex_1 = require("../common/FabricIndex");
const VendorId_1 = require("../common/VendorId");
const Cluster_1 = require("./Cluster");
const Crypto_1 = require("../../crypto/Crypto");
const PAKE_PASSCODE_VERIFIER_LENGTH = Crypto_1.CRYPTO_GROUP_SIZE_BYTES + Crypto_1.CRYPTO_PUBLIC_KEY_SIZE_BYTES;
const TlvOpenCommissioningWindowRequest = (0, matter_js_1.TlvObject)({
    commissioningTimeout: (0, matter_js_1.TlvField)(0, matter_js_1.TlvUInt16),
    pakePasscodeVerifier: (0, matter_js_1.TlvField)(1, matter_js_1.TlvByteString.bound({ length: PAKE_PASSCODE_VERIFIER_LENGTH })),
    discriminator: (0, matter_js_1.TlvField)(2, matter_js_1.TlvUInt16.bound({ max: 4095 })),
    iterations: (0, matter_js_1.TlvField)(3, matter_js_1.TlvUInt32.bound({ min: 1000, max: 100000 })),
    salt: (0, matter_js_1.TlvField)(4, matter_js_1.TlvByteString.bound({ minLength: 16, maxLength: 32 })),
});
const TlvOpenBasicCommissioningWindowRequest = (0, matter_js_1.TlvObject)({
    commissioningTimeout: (0, matter_js_1.TlvField)(0, matter_js_1.TlvUInt16),
});
exports.AdminCommissioningCluster = (0, Cluster_1.Cluster)({
    id: 0x3c,
    name: "AdministratorCommissioning",
    revision: 1,
    features: {
        basic: (0, matter_js_1.BitFlag)(0),
    },
    attributes: {
        windowStatus: (0, Cluster_1.Attribute)(0, (0, matter_js_1.TlvEnum)()),
        adminFabricIndex: (0, Cluster_1.Attribute)(1, (0, matter_js_1.TlvNullable)(FabricIndex_1.TlvFabricIndex)),
        adminVendorId: (0, Cluster_1.Attribute)(2, (0, matter_js_1.TlvNullable)(VendorId_1.TlvVendorId)),
    },
    commands: {
        openCommissioningWindow: (0, Cluster_1.Command)(0, TlvOpenCommissioningWindowRequest, 0, Cluster_1.TlvNoResponse),
        openBasicCommissioningWindow: (0, Cluster_1.Command)(1, TlvOpenBasicCommissioningWindowRequest, 1, Cluster_1.TlvNoResponse),
        revokeCommissioning: (0, Cluster_1.Command)(2, Cluster_1.TlvNoArguments, 2, Cluster_1.TlvNoResponse),
    },
});
