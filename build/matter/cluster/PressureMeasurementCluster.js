"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PressureMeasurementCluster = void 0;
const Cluster_1 = require("./Cluster");
const matter_js_1 = require("@project-chip/matter.js");
exports.PressureMeasurementCluster = (0, Cluster_1.Cluster)({
    id: 0x0403,
    name: "PressureMeasurement",
    revision: 3,
    features: {
        extended: (0, matter_js_1.BitFlag)(0)
    },
    attributes: {
        measuredValue: (0, Cluster_1.Attribute)(0x0, (0, matter_js_1.TlvNullable)(matter_js_1.TlvInt16)),
        minMeasuredValue: (0, Cluster_1.Attribute)(0x1, (0, matter_js_1.TlvNullable)(matter_js_1.TlvInt16.bound({ min: -32767 }))),
        maxMeasuredValue: (0, Cluster_1.Attribute)(0x2, (0, matter_js_1.TlvNullable)(matter_js_1.TlvInt16)),
        tolerance: (0, Cluster_1.OptionalAttribute)(0x3, matter_js_1.TlvUInt16.bound({ min: 0, max: 2048 }), { default: 0 }),
        scaledValue: (0, Cluster_1.OptionalAttribute)(0x10, (0, matter_js_1.TlvNullable)(matter_js_1.TlvInt16), { default: 0 }),
        minScaledValue: (0, Cluster_1.OptionalAttribute)(0x11, (0, matter_js_1.TlvNullable)(matter_js_1.TlvInt16.bound({ min: -32767 })), { default: 0 }),
        maxScaledValue: (0, Cluster_1.OptionalAttribute)(0x12, (0, matter_js_1.TlvNullable)(matter_js_1.TlvInt16), { default: 0 }),
        scaledTolerance: (0, Cluster_1.OptionalAttribute)(0x13, matter_js_1.TlvUInt16.bound({ min: 0, max: 2048 }), { default: 0 }),
        scale: (0, Cluster_1.OptionalAttribute)(0x14, matter_js_1.TlvUInt8.bound({ min: -127, max: 127 }), { default: 0 }),
    },
});
