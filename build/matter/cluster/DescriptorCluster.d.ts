import { Attribute, Cluster } from "./Cluster";
export declare const DescriptorCluster: Cluster<import("@project-chip/matter.js").BitSchema, {
    deviceTypeList: Attribute<{
        type: import("../common/DeviceTypeId").DeviceTypeId;
        revision: number;
    }[]>;
    serverList: Attribute<import("../common/ClusterId").ClusterId[]>;
    clientList: Attribute<import("../common/ClusterId").ClusterId[]>;
    partsList: Attribute<import("../common/EndpointNumber").EndpointNumber[]>;
    clusterRevision: Attribute<number>;
    featureMap: Attribute<import("@project-chip/matter.js").TypeFromBitSchema<import("@project-chip/matter.js").BitSchema>>;
    attributeList: Attribute<import("../common/AttributeId").AttributeId[]>;
    eventList: Attribute<import("../common/EventId").EventId[]>;
    acceptedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
    generatedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
}, import("./Cluster").Commands, import("./Cluster").Events>;
