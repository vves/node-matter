"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OccupancySensingCluster = exports.OccupancySensorTypeBitmap = exports.OccupancyBitmap = void 0;
const Cluster_1 = require("./Cluster");
const matter_js_1 = require("@project-chip/matter.js");
exports.OccupancyBitmap = (0, matter_js_1.TlvBitmap)(matter_js_1.TlvUInt8, {
    occupied: (0, matter_js_1.BitFlag)(0),
});
exports.OccupancySensorTypeBitmap = (0, matter_js_1.TlvBitmap)(matter_js_1.TlvUInt8, {
    PIR: (0, matter_js_1.BitFlag)(0),
    ultrasonic: (0, matter_js_1.BitFlag)(1),
    physicalContact: (0, matter_js_1.BitFlag)(2)
});
exports.OccupancySensingCluster = (0, Cluster_1.Cluster)({
    id: 0x0406,
    name: "OccupancySensing",
    revision: 3,
    attributes: {
        occupancy: (0, Cluster_1.Attribute)(0x0000, exports.OccupancyBitmap),
        occupancySensorType: (0, Cluster_1.Attribute)(0x0001, (0, matter_js_1.TlvEnum)()),
        occupancySensorTypeBitmap: (0, Cluster_1.Attribute)(0x0002, exports.OccupancySensorTypeBitmap),
        pirOccupiedToUnoccupiedDelay: (0, Cluster_1.OptionalWritableAttribute)(0x0010, matter_js_1.TlvUInt16, { default: 0 }),
        pirUnoccupiedToOccupiedDelay: (0, Cluster_1.OptionalWritableAttribute)(0x0011, matter_js_1.TlvUInt16, { default: 0 }),
        pirUnoccupiedToOccupiedThreshold: (0, Cluster_1.OptionalWritableAttribute)(0x0012, matter_js_1.TlvUInt8.bound({ min: 1, max: 254 }), { default: 1 }),
        ultrasonicOccupiedToUnoccupiedDelay: (0, Cluster_1.OptionalWritableAttribute)(0x0020, matter_js_1.TlvUInt16, { default: 0 }),
        ultrasonicUnoccupiedToOccupiedDelay: (0, Cluster_1.OptionalWritableAttribute)(0x0021, matter_js_1.TlvUInt16, { default: 0 }),
        ultrasonicUnoccupiedToOccupiedThreshold: (0, Cluster_1.OptionalWritableAttribute)(0x0022, matter_js_1.TlvUInt8.bound({ min: 1, max: 254 }), { default: 1 }),
        physicalContactOccupiedToUnoccupiedDelay: (0, Cluster_1.OptionalWritableAttribute)(0x0030, (0, matter_js_1.TlvNullable)(matter_js_1.TlvUInt16), { default: 0 }),
        physicalContactUnoccupiedToOccupiedDelay: (0, Cluster_1.OptionalWritableAttribute)(0x0031, (0, matter_js_1.TlvNullable)(matter_js_1.TlvUInt16), { default: 0 }),
        physicalContactUnoccupiedToOccupiedThreshold: (0, Cluster_1.OptionalWritableAttribute)(0x0032, matter_js_1.TlvUInt8.bound({ min: 1, max: 254 }), { default: 1 }),
    },
});
