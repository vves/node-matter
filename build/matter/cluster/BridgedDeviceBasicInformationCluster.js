"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicInformationCluster = void 0;
const FabricIndex_1 = require("../common/FabricIndex");
const VendorId_1 = require("../common/VendorId");
const Cluster_1 = require("./Cluster");
const matter_js_1 = require("@project-chip/matter.js");
exports.BasicInformationCluster = (0, Cluster_1.Cluster)({
    id: 0x39,
    name: "Bridged Device Basic Information",
    revision: 1,
    attributes: {
        vendorName: (0, Cluster_1.OptionalAttribute)(1, matter_js_1.TlvString32max),
        vendorId: (0, Cluster_1.OptionalAttribute)(2, VendorId_1.TlvVendorId),
        productName: (0, Cluster_1.OptionalAttribute)(3, matter_js_1.TlvString32max),
        nodeLabel: (0, Cluster_1.OptionalWritableAttribute)(5, matter_js_1.TlvString32max, { persistent: true, default: "", writeAcl: 1 }),
        hardwareVersion: (0, Cluster_1.OptionalAttribute)(7, matter_js_1.TlvUInt16, { default: 0 }),
        hardwareVersionString: (0, Cluster_1.OptionalAttribute)(8, matter_js_1.TlvString.bound({ minLength: 1, maxLength: 64 })),
        softwareVersion: (0, Cluster_1.OptionalAttribute)(9, matter_js_1.TlvUInt32, { default: 0 }),
        softwareVersionString: (0, Cluster_1.OptionalAttribute)(10, matter_js_1.TlvString.bound({ minLength: 1, maxLength: 64 })),
        manufacturingDate: (0, Cluster_1.OptionalAttribute)(11, matter_js_1.TlvString.bound({ minLength: 8, maxLength: 16 })),
        partNumber: (0, Cluster_1.OptionalAttribute)(12, matter_js_1.TlvString32max),
        productURL: (0, Cluster_1.OptionalAttribute)(13, matter_js_1.TlvString256max),
        productLabel: (0, Cluster_1.OptionalAttribute)(14, matter_js_1.TlvString64max),
        serialNumber: (0, Cluster_1.OptionalAttribute)(15, matter_js_1.TlvString32max),
        reachable: (0, Cluster_1.Attribute)(17, matter_js_1.TlvBoolean, { default: true }),
        uniqueId: (0, Cluster_1.OptionalAttribute)(18, matter_js_1.TlvString32max),
    },
    events: {
        startUp: (0, Cluster_1.OptionalEvent)(0, 0, { softwareVersion: (0, matter_js_1.TlvField)(0, matter_js_1.TlvUInt32) }),
        shutDown: (0, Cluster_1.OptionalEvent)(1, 0),
        leave: (0, Cluster_1.OptionalEvent)(2, 1, { fabricIndex: (0, matter_js_1.TlvField)(0, FabricIndex_1.TlvFabricIndex) }),
        reachableChanged: (0, Cluster_1.Event)(3, 1, { reachableNewValue: (0, matter_js_1.TlvField)(0, matter_js_1.TlvBoolean) }),
    },
});
