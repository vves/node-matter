"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentifyCluster = void 0;
const Cluster_1 = require("./Cluster");
const matter_js_1 = require("@project-chip/matter.js");
const TlvIdentifyRequest = (0, matter_js_1.TlvObject)({
    identifyTime: (0, matter_js_1.TlvField)(0, matter_js_1.TlvUInt16),
});
const TlvTriggerEffectRequest = (0, matter_js_1.TlvObject)({
    effectIdentifier: (0, matter_js_1.TlvField)(0, (0, matter_js_1.TlvEnum)()),
    effectVariant: (0, matter_js_1.TlvField)(1, (0, matter_js_1.TlvEnum)()),
});
const TlvIdentifyQueryResponse = (0, matter_js_1.TlvObject)({
    timeout: (0, matter_js_1.TlvField)(0, matter_js_1.TlvUInt16),
});
exports.IdentifyCluster = (0, Cluster_1.Cluster)({
    id: 0x03,
    name: "Identify",
    revision: 4,
    features: {
        query: (0, matter_js_1.BitFlag)(0),
    },
    attributes: {
        identifyTime: (0, Cluster_1.WritableAttribute)(0, matter_js_1.TlvUInt16, { default: 0 }),
        identifyType: (0, Cluster_1.Attribute)(1, (0, matter_js_1.TlvEnum)(), { default: 0 }),
    },
    commands: {
        identify: (0, Cluster_1.Command)(0, TlvIdentifyRequest, 0, Cluster_1.TlvNoResponse),
        triggerEffect: (0, Cluster_1.OptionalCommand)(0x40, TlvTriggerEffectRequest, 0, Cluster_1.TlvNoResponse),
    },
});
