import { Attribute, Cluster, Event, OptionalAttribute, OptionalWritableAttribute } from "./Cluster";
export declare const BasicInformationCluster: Cluster<import("@project-chip/matter.js").BitSchema, {
    vendorName: OptionalAttribute<string>;
    vendorId: OptionalAttribute<import("../common/VendorId").VendorId>;
    productName: OptionalAttribute<string>;
    nodeLabel: OptionalWritableAttribute<string>;
    hardwareVersion: OptionalAttribute<number>;
    hardwareVersionString: OptionalAttribute<string>;
    softwareVersion: OptionalAttribute<number>;
    softwareVersionString: OptionalAttribute<string>;
    manufacturingDate: OptionalAttribute<string>;
    partNumber: OptionalAttribute<string>;
    productURL: OptionalAttribute<string>;
    productLabel: OptionalAttribute<string>;
    serialNumber: OptionalAttribute<string>;
    reachable: Attribute<boolean>;
    uniqueId: OptionalAttribute<string>;
    clusterRevision: Attribute<number>;
    featureMap: Attribute<import("@project-chip/matter.js").TypeFromBitSchema<import("@project-chip/matter.js").BitSchema>>;
    attributeList: Attribute<import("../common/AttributeId").AttributeId[]>;
    eventList: Attribute<import("../common/EventId").EventId[]>;
    acceptedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
    generatedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
}, import("./Cluster").Commands, {
    startUp: Event<{
        softwareVersion: number;
    }>;
    shutDown: Event<{
        [x: string]: any;
    }>;
    leave: Event<{
        fabricIndex: import("../common/FabricIndex").FabricIndex;
    }>;
    reachableChanged: Event<{
        reachableNewValue: boolean;
    }>;
}>;
