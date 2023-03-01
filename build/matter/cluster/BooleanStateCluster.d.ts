import { Attribute, Cluster } from "./Cluster";
export declare const BooleanStateCluster: Cluster<import("@project-chip/matter.js").BitSchema, {
    stateValue: Attribute<boolean>;
    clusterRevision: Attribute<number>;
    featureMap: Attribute<import("@project-chip/matter.js").TypeFromBitSchema<import("@project-chip/matter.js").BitSchema>>;
    attributeList: Attribute<import("../common/AttributeId").AttributeId[]>;
    eventList: Attribute<import("../common/EventId").EventId[]>;
    acceptedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
    generatedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
}, import("./Cluster").Commands, {
    stateChange: import("./Cluster").Event<{
        stateValue: boolean;
    }>;
}>;
