"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicInformationCluster = void 0;
const FabricIndex_1 = require("../common/FabricIndex");
const VendorId_1 = require("../common/VendorId");
const Cluster_1 = require("./Cluster");
const matter_js_1 = require("@project-chip/matter.js");
const TlvCapabilityMinima = (0, matter_js_1.TlvObject)({
    caseSessionsPerFabric: (0, matter_js_1.TlvField)(0, matter_js_1.TlvUInt16.bound({ min: 3 })),
    subscriptionsPerFabric: (0, matter_js_1.TlvField)(1, matter_js_1.TlvUInt16.bound({ min: 3 })),
});
exports.BasicInformationCluster = (0, Cluster_1.Cluster)({
    id: 0x28,
    name: "Basic Information",
    revision: 1,
    attributes: {
        dataModelRevision: (0, Cluster_1.Attribute)(0, matter_js_1.TlvUInt16),
        vendorName: (0, Cluster_1.Attribute)(1, matter_js_1.TlvString32max),
        vendorId: (0, Cluster_1.Attribute)(2, VendorId_1.TlvVendorId),
        productName: (0, Cluster_1.Attribute)(3, matter_js_1.TlvString32max),
        productId: (0, Cluster_1.Attribute)(4, matter_js_1.TlvUInt16),
        nodeLabel: (0, Cluster_1.WritableAttribute)(5, matter_js_1.TlvString32max, { persistent: true, default: "", writeAcl: 1 }),
        location: (0, Cluster_1.WritableAttribute)(6, matter_js_1.TlvString.bound({ length: 2 }), { persistent: true, default: "XX", writeAcl: 2 }),
        hardwareVersion: (0, Cluster_1.Attribute)(7, matter_js_1.TlvUInt16, { default: 0 }),
        hardwareVersionString: (0, Cluster_1.Attribute)(8, matter_js_1.TlvString.bound({ minLength: 1, maxLength: 64 })),
        softwareVersion: (0, Cluster_1.Attribute)(9, matter_js_1.TlvUInt32, { default: 0 }),
        softwareVersionString: (0, Cluster_1.Attribute)(10, matter_js_1.TlvString.bound({ minLength: 1, maxLength: 64 })),
        manufacturingDate: (0, Cluster_1.OptionalAttribute)(11, matter_js_1.TlvString.bound({ minLength: 8, maxLength: 16 })),
        partNumber: (0, Cluster_1.OptionalAttribute)(12, matter_js_1.TlvString32max),
        productURL: (0, Cluster_1.OptionalAttribute)(13, matter_js_1.TlvString256max),
        productLabel: (0, Cluster_1.OptionalAttribute)(14, matter_js_1.TlvString64max),
        serialNumber: (0, Cluster_1.OptionalAttribute)(15, matter_js_1.TlvString32max),
        localConfigDisabled: (0, Cluster_1.OptionalWritableAttribute)(16, matter_js_1.TlvBoolean, { persistent: true, default: false, writeAcl: 1 }),
        reachable: (0, Cluster_1.OptionalAttribute)(17, matter_js_1.TlvBoolean, { default: true }),
        uniqueId: (0, Cluster_1.OptionalAttribute)(18, matter_js_1.TlvString32max),
        capabilityMinima: (0, Cluster_1.Attribute)(19, TlvCapabilityMinima, { default: { caseSessionsPerFabric: 3, subscriptionsPerFabric: 3 } }),
    },
    events: {
        startUp: (0, Cluster_1.Event)(0, 0, { softwareVersion: (0, matter_js_1.TlvField)(0, matter_js_1.TlvUInt32) }),
        shutDown: (0, Cluster_1.OptionalEvent)(1, 0),
        leave: (0, Cluster_1.OptionalEvent)(2, 1, { fabricIndex: (0, matter_js_1.TlvField)(0, FabricIndex_1.TlvFabricIndex) }),
        reachableChanged: (0, Cluster_1.OptionalEvent)(3, 1, { reachableNewValue: (0, matter_js_1.TlvField)(0, matter_js_1.TlvBoolean) }),
    },
});
