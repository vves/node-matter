"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoilMoistureMeasurementCluster = exports.LeafWetnessMeasurementCluster = exports.RelativeHumidityCluster = void 0;
const Cluster_1 = require("./Cluster");
const matter_js_1 = require("@project-chip/matter.js");
const attributes = {
    measuredValue: (0, Cluster_1.Attribute)(0, (0, matter_js_1.TlvNullable)(matter_js_1.TlvUInt16.bound({ min: 0, max: 10000 }))),
    minMeasuredValue: (0, Cluster_1.Attribute)(1, (0, matter_js_1.TlvNullable)(matter_js_1.TlvUInt16.bound({ min: 0 }))),
    maxMeasuredValue: (0, Cluster_1.Attribute)(2, (0, matter_js_1.TlvNullable)(matter_js_1.TlvUInt16.bound({ max: 10000 }))),
    tolerance: (0, Cluster_1.OptionalAttribute)(3, matter_js_1.TlvUInt16.bound({ min: 0, max: 2048 })),
};
exports.RelativeHumidityCluster = (0, Cluster_1.Cluster)({
    id: 0x0405,
    name: "RelativeHumidityMeasurement",
    revision: 3,
    attributes,
});
exports.LeafWetnessMeasurementCluster = (0, Cluster_1.Cluster)({
    id: 0x0407,
    name: "LeafWetnessMeasurement",
    revision: 3,
    attributes,
});
exports.SoilMoistureMeasurementCluster = (0, Cluster_1.Cluster)({
    id: 0x0408,
    name: "SoilMoistureMeasurement",
    revision: 3,
    attributes,
});
