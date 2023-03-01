"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DescriptorCluster = void 0;
const Cluster_1 = require("./Cluster");
const DeviceTypeId_1 = require("../common/DeviceTypeId");
const ClusterId_1 = require("../common/ClusterId");
const EndpointNumber_1 = require("../common/EndpointNumber");
const matter_js_1 = require("@project-chip/matter.js");
const TlvDeviceType = (0, matter_js_1.TlvObject)({
    type: (0, matter_js_1.TlvField)(0, DeviceTypeId_1.TlvDeviceTypeId),
    revision: (0, matter_js_1.TlvField)(1, matter_js_1.TlvUInt16.bound({ min: 1 })),
});
exports.DescriptorCluster = (0, Cluster_1.Cluster)({
    id: 0x1d,
    name: "Descriptor",
    revision: 1,
    attributes: {
        deviceTypeList: (0, Cluster_1.Attribute)(0, (0, matter_js_1.TlvArray)(TlvDeviceType, { minLength: 1 })),
        serverList: (0, Cluster_1.Attribute)(1, (0, matter_js_1.TlvArray)(ClusterId_1.TlvClusterId), { default: [] }),
        clientList: (0, Cluster_1.Attribute)(2, (0, matter_js_1.TlvArray)(ClusterId_1.TlvClusterId), { default: [] }),
        partsList: (0, Cluster_1.Attribute)(3, (0, matter_js_1.TlvArray)(EndpointNumber_1.TlvEndpointNumber), { default: [] }),
    },
});
