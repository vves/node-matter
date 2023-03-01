import { Cluster, WritableAttribute } from "./Cluster";
export declare const BindingCluster: Cluster<import("@project-chip/matter.js").BitSchema, {
    binding: WritableAttribute<{
        group?: import("../common/GroupId").GroupId | undefined;
        node?: import("../common/NodeId").NodeId | undefined;
        endpoint?: import("../common/EndpointNumber").EndpointNumber | undefined;
        cluster?: import("../common/ClusterId").ClusterId | undefined;
    }[]>;
    clusterRevision: import("./Cluster").Attribute<number>;
    featureMap: import("./Cluster").Attribute<import("@project-chip/matter.js").TypeFromBitSchema<import("@project-chip/matter.js").BitSchema>>;
    attributeList: import("./Cluster").Attribute<import("../common/AttributeId").AttributeId[]>;
    eventList: import("./Cluster").Attribute<import("../common/EventId").EventId[]>;
    acceptedCommandList: import("./Cluster").Attribute<import("../common/CommandId").CommandId[]>;
    generatedCommandList: import("./Cluster").Attribute<import("../common/CommandId").CommandId[]>;
}, import("./Cluster").Commands, import("./Cluster").Events>;
