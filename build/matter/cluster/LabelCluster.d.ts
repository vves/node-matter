import { Attribute, Cluster, WritableAttribute } from "./Cluster";
export declare const UserLabelCluster: Cluster<import("@project-chip/matter.js").BitSchema, {
    labelList: WritableAttribute<{
        value: string;
        label: string;
    }[]>;
    clusterRevision: Attribute<number>;
    featureMap: Attribute<import("@project-chip/matter.js").TypeFromBitSchema<import("@project-chip/matter.js").BitSchema>>;
    attributeList: Attribute<import("../common/AttributeId").AttributeId[]>;
    eventList: Attribute<import("../common/EventId").EventId[]>;
    acceptedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
    generatedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
}, import("./Cluster").Commands, import("./Cluster").Events>;
export declare const FixedLabelCluster: Cluster<import("@project-chip/matter.js").BitSchema, {
    labelList: Attribute<{
        value: string;
        label: string;
    }[]>;
    clusterRevision: Attribute<number>;
    featureMap: Attribute<import("@project-chip/matter.js").TypeFromBitSchema<import("@project-chip/matter.js").BitSchema>>;
    attributeList: Attribute<import("../common/AttributeId").AttributeId[]>;
    eventList: Attribute<import("../common/EventId").EventId[]>;
    acceptedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
    generatedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
}, import("./Cluster").Commands, import("./Cluster").Events>;
