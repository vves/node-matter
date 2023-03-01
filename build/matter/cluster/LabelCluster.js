"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FixedLabelCluster = exports.UserLabelCluster = void 0;
const Cluster_1 = require("./Cluster");
const matter_js_1 = require("@project-chip/matter.js");
const TlvLabel = (0, matter_js_1.TlvObject)({
    label: (0, matter_js_1.TlvField)(0, matter_js_1.TlvString.bound({ length: 16 })),
    value: (0, matter_js_1.TlvField)(1, matter_js_1.TlvString.bound({ length: 16 })),
});
exports.UserLabelCluster = (0, Cluster_1.Cluster)({
    id: 0x41,
    name: "User Label",
    revision: 1,
    attributes: {
        labelList: (0, Cluster_1.WritableAttribute)(0, (0, matter_js_1.TlvArray)(TlvLabel), { persistent: true, default: [], writeAcl: 1 }),
    },
});
exports.FixedLabelCluster = (0, Cluster_1.Cluster)({
    id: 0x40,
    name: "Fixed Label",
    revision: 1,
    attributes: {
        labelList: (0, Cluster_1.Attribute)(0, (0, matter_js_1.TlvArray)(TlvLabel), { persistent: true, default: [] }),
    },
});
