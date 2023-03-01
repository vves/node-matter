import { Attribute, Cluster, Event, OptionalAttribute, OptionalWritableAttribute, WritableAttribute } from "./Cluster";
export declare const BasicInformationCluster: Cluster<import("@project-chip/matter.js").BitSchema, {
    dataModelRevision: Attribute<number>;
    vendorName: Attribute<string>;
    vendorId: Attribute<import("../common/VendorId").VendorId>;
    productName: Attribute<string>;
    productId: Attribute<number>;
    nodeLabel: WritableAttribute<string>;
    location: WritableAttribute<string>;
    hardwareVersion: Attribute<number>;
    hardwareVersionString: Attribute<string>;
    softwareVersion: Attribute<number>;
    softwareVersionString: Attribute<string>;
    manufacturingDate: OptionalAttribute<string>;
    partNumber: OptionalAttribute<string>;
    productURL: OptionalAttribute<string>;
    productLabel: OptionalAttribute<string>;
    serialNumber: OptionalAttribute<string>;
    localConfigDisabled: OptionalWritableAttribute<boolean>;
    reachable: OptionalAttribute<boolean>;
    uniqueId: OptionalAttribute<string>;
    capabilityMinima: Attribute<{
        caseSessionsPerFabric: number;
        subscriptionsPerFabric: number;
    }>;
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
