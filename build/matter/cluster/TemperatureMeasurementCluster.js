"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemperatureMeasurementCluster = void 0;
const Cluster_1 = require("./Cluster");
const matter_js_1 = require("@project-chip/matter.js");
exports.TemperatureMeasurementCluster = (0, Cluster_1.Cluster)({
    id: 0x0402,
    name: "TemperatureMeasurement",
    revision: 4,
    attributes: {
        measuredValue: (0, Cluster_1.Attribute)(0, (0, matter_js_1.TlvNullable)(matter_js_1.TlvInt16)),
        minMeasuredValue: (0, Cluster_1.Attribute)(1, (0, matter_js_1.TlvNullable)(matter_js_1.TlvInt16.bound({ min: -27315 }))),
        maxMeasuredValue: (0, Cluster_1.Attribute)(2, (0, matter_js_1.TlvNullable)(matter_js_1.TlvInt16.bound({ max: 32767 }))),
        tolerance: (0, Cluster_1.OptionalAttribute)(3, matter_js_1.TlvUInt16.bound({ min: 0, max: 2048 }), { default: 0 }),
    },
});
