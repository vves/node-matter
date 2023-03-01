"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BindingCluster = void 0;
const Cluster_1 = require("./Cluster");
const ClusterId_1 = require("../common/ClusterId");
const EndpointNumber_1 = require("../common/EndpointNumber");
const NodeId_1 = require("../common/NodeId");
const GroupId_1 = require("../common/GroupId");
const matter_js_1 = require("@project-chip/matter.js");
const TlvTarget = (0, matter_js_1.TlvObject)({
    node: (0, matter_js_1.TlvOptionalField)(1, NodeId_1.TlvNodeId),
    group: (0, matter_js_1.TlvOptionalField)(2, GroupId_1.TlvGroupId),
    endpoint: (0, matter_js_1.TlvOptionalField)(3, EndpointNumber_1.TlvEndpointNumber),
    cluster: (0, matter_js_1.TlvOptionalField)(4, ClusterId_1.TlvClusterId),
});
exports.BindingCluster = (0, Cluster_1.Cluster)({
    id: 0x1e,
    name: "Binding",
    revision: 1,
    attributes: {
        binding: (0, Cluster_1.WritableAttribute)(0, (0, matter_js_1.TlvArray)(TlvTarget), { persistent: true, default: [] }),
    },
});
