"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IlluminanceMeasurementCluster = void 0;
const Cluster_1 = require("./Cluster");
const matter_js_1 = require("@project-chip/matter.js");
exports.IlluminanceMeasurementCluster = (0, Cluster_1.Cluster)({
    id: 0x0400,
    name: "IlluminanceMeasurement",
    revision: 3,
    attributes: {
        measuredValue: (0, Cluster_1.Attribute)(0, (0, matter_js_1.TlvNullable)(matter_js_1.TlvUInt16), { default: 0 }),
        minMeasuredValue: (0, Cluster_1.Attribute)(1, (0, matter_js_1.TlvNullable)(matter_js_1.TlvUInt16.bound({ min: 1 }))),
        maxMeasuredValue: (0, Cluster_1.Attribute)(2, (0, matter_js_1.TlvNullable)(matter_js_1.TlvUInt16.bound({ max: 65534 }))),
        tolerance: (0, Cluster_1.OptionalAttribute)(3, matter_js_1.TlvUInt16.bound({ min: 0, max: 2048 })),
        lightSensorType: (0, Cluster_1.OptionalAttribute)(4, (0, matter_js_1.TlvNullable)(matter_js_1.TlvUInt8), { default: null }),
    },
});
