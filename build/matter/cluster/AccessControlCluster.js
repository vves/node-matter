"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessControlCluster = void 0;
const Cluster_1 = require("./Cluster");
const ClusterId_1 = require("../common/ClusterId");
const EndpointNumber_1 = require("../common/EndpointNumber");
const DeviceTypeId_1 = require("../common/DeviceTypeId");
const NodeId_1 = require("../common/NodeId");
const SubjectId_1 = require("../common/SubjectId");
const matter_js_1 = require("@project-chip/matter.js");
const TlvTarget = (0, matter_js_1.TlvObject)({
    cluster: (0, matter_js_1.TlvField)(0, (0, matter_js_1.TlvNullable)(ClusterId_1.TlvClusterId)),
    endpoint: (0, matter_js_1.TlvField)(1, (0, matter_js_1.TlvNullable)(EndpointNumber_1.TlvEndpointNumber)),
    deviceType: (0, matter_js_1.TlvField)(1, (0, matter_js_1.TlvNullable)(DeviceTypeId_1.TlvDeviceTypeId)),
});
const TlvAccessControlEntry = (0, matter_js_1.TlvObject)({
    privilege: (0, matter_js_1.TlvField)(1, (0, matter_js_1.TlvEnum)()),
    authMode: (0, matter_js_1.TlvField)(2, (0, matter_js_1.TlvEnum)()),
    subjects: (0, matter_js_1.TlvField)(3, (0, matter_js_1.TlvNullable)((0, matter_js_1.TlvArray)(SubjectId_1.TlvSubjectId))),
    targets: (0, matter_js_1.TlvField)(4, (0, matter_js_1.TlvNullable)((0, matter_js_1.TlvArray)(TlvTarget))),
});
const TlvAccessControlExtensionEntry = (0, matter_js_1.TlvObject)({
    data: (0, matter_js_1.TlvField)(1, matter_js_1.TlvByteString.bound({ maxLength: 128 })),
});
const AccessChangeEvent = (entrySchema) => ({
    adminNodeID: (0, matter_js_1.TlvField)(1, (0, matter_js_1.TlvNullable)(NodeId_1.TlvNodeId)),
    adminPasscodeID: (0, matter_js_1.TlvField)(2, (0, matter_js_1.TlvNullable)(matter_js_1.TlvUInt16)),
    changeType: (0, matter_js_1.TlvField)(3, (0, matter_js_1.TlvEnum)()),
    latestValue: (0, matter_js_1.TlvField)(4, (0, matter_js_1.TlvNullable)(entrySchema)),
});
exports.AccessControlCluster = (0, Cluster_1.Cluster)({
    id: 0x1f,
    name: "Access Control",
    revision: 1,
    attributes: {
        acl: (0, Cluster_1.WritableAttribute)(0, (0, matter_js_1.TlvArray)(TlvAccessControlEntry), { default: [], writeAcl: 2, readAcl: 2 }),
        extension: (0, Cluster_1.OptionalWritableAttribute)(1, (0, matter_js_1.TlvArray)(TlvAccessControlExtensionEntry), { default: [], writeAcl: 2, readAcl: 2 }),
        subjectsPerAccessControlEntry: (0, Cluster_1.Attribute)(2, matter_js_1.TlvUInt16.bound({ min: 4 }), { default: 4 }),
        targetsPerAccessControlEntry: (0, Cluster_1.Attribute)(3, matter_js_1.TlvUInt16.bound({ min: 3 }), { default: 3 }),
        accessControlEntriesPerFabric: (0, Cluster_1.Attribute)(4, matter_js_1.TlvUInt16.bound({ min: 3 }), { default: 3 }),
    },
    events: {
        accessControlEntryChanged: (0, Cluster_1.Event)(0, 1, AccessChangeEvent(TlvAccessControlEntry)),
        accessControlExtensionChanged: (0, Cluster_1.Event)(1, 1, AccessChangeEvent(TlvAccessControlExtensionEntry)),
    },
});
