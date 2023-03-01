"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BooleanStateCluster = void 0;
const Cluster_1 = require("./Cluster");
const matter_js_1 = require("@project-chip/matter.js");
exports.BooleanStateCluster = (0, Cluster_1.Cluster)({
    id: 0x0045,
    name: "BooleanState",
    revision: 1,
    attributes: {
        stateValue: (0, Cluster_1.Attribute)(0x00, matter_js_1.TlvBoolean),
    },
    events: {
        stateChange: (0, Cluster_1.OptionalEvent)(0, 1, { stateValue: (0, matter_js_1.TlvField)(0, matter_js_1.TlvBoolean) }),
    },
});
