"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnOffCluster = void 0;
const Cluster_1 = require("./Cluster");
const matter_js_1 = require("@project-chip/matter.js");
const TlvEffectVariant = matter_js_1.TlvUInt8;
const TlvOffWithEffectRequest = (0, matter_js_1.TlvObject)({
    effectIdentifier: (0, matter_js_1.TlvField)(0, (0, matter_js_1.TlvEnum)()),
    effectVariant: (0, matter_js_1.TlvField)(1, TlvEffectVariant),
});
const TlvOnOffControlBitmap = (0, matter_js_1.TlvBitmap)(matter_js_1.TlvUInt8, {
    acceptOnlyWhenOn: (0, matter_js_1.BitFlag)(1),
});
const TlvOnWithTimedOffRequest = (0, matter_js_1.TlvObject)({
    onOffControl: (0, matter_js_1.TlvField)(0, TlvOnOffControlBitmap),
    onTime: (0, matter_js_1.TlvField)(1, (0, matter_js_1.TlvNullable)(matter_js_1.TlvUInt8.bound({ min: 0, max: 254 }))),
    offWaitTime: (0, matter_js_1.TlvField)(2, (0, matter_js_1.TlvNullable)(matter_js_1.TlvUInt8.bound({ min: 0, max: 254 }))),
});
exports.OnOffCluster = (0, Cluster_1.Cluster)({
    id: 0x06,
    name: "On/Off",
    revision: 4,
    features: {
        lightingLevelControl: (0, matter_js_1.BitFlag)(0),
    },
    attributes: {
        onOff: (0, Cluster_1.Attribute)(0, matter_js_1.TlvBoolean, { persistent: true, default: false }),
    },
    commands: {
        off: (0, Cluster_1.Command)(0, Cluster_1.TlvNoArguments, 0, Cluster_1.TlvNoResponse),
        on: (0, Cluster_1.Command)(1, Cluster_1.TlvNoArguments, 1, Cluster_1.TlvNoResponse),
        toggle: (0, Cluster_1.Command)(2, Cluster_1.TlvNoArguments, 2, Cluster_1.TlvNoResponse),
    },
});
