import { Cluster, WritableAttribute, Attribute, Event, OptionalWritableAttribute } from "./Cluster";
export declare const enum Privilege {
    View = 1,
    ProxyView = 2,
    Operate = 3,
    Manage = 4,
    Administer = 5
}
export declare const enum AuthMode {
    PASE = 1,
    CASE = 2,
    Group = 3
}
export declare const enum ChangeTypeEnum {
    Changed = 0,
    Added = 1,
    Removed = 2
}
export declare const AccessControlCluster: Cluster<import("@project-chip/matter.js").BitSchema, {
    acl: WritableAttribute<{
        privilege: Privilege;
        authMode: AuthMode;
        subjects: import("../common/NodeId").NodeId[] | null;
        targets: {
            endpoint: import("../common/EndpointNumber").EndpointNumber | null;
            cluster: import("../common/ClusterId").ClusterId | null;
            deviceType: import("../common/DeviceTypeId").DeviceTypeId | null;
        }[] | null;
    }[]>;
    extension: OptionalWritableAttribute<{
        data: Uint8Array;
    }[]>;
    subjectsPerAccessControlEntry: Attribute<number>;
    targetsPerAccessControlEntry: Attribute<number>;
    accessControlEntriesPerFabric: Attribute<number>;
    clusterRevision: Attribute<number>;
    featureMap: Attribute<import("@project-chip/matter.js").TypeFromBitSchema<import("@project-chip/matter.js").BitSchema>>;
    attributeList: Attribute<import("../common/AttributeId").AttributeId[]>;
    eventList: Attribute<import("../common/EventId").EventId[]>;
    acceptedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
    generatedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
}, import("./Cluster").Commands, {
    accessControlEntryChanged: Event<{
        adminNodeID: import("../common/NodeId").NodeId | null;
        adminPasscodeID: number | null;
        changeType: ChangeTypeEnum;
        latestValue: {
            privilege: Privilege;
            authMode: AuthMode;
            subjects: import("../common/NodeId").NodeId[] | null;
            targets: {
                endpoint: import("../common/EndpointNumber").EndpointNumber | null;
                cluster: import("../common/ClusterId").ClusterId | null;
                deviceType: import("../common/DeviceTypeId").DeviceTypeId | null;
            }[] | null;
        } | null;
    }>;
    accessControlExtensionChanged: Event<{
        adminNodeID: import("../common/NodeId").NodeId | null;
        adminPasscodeID: number | null;
        changeType: ChangeTypeEnum;
        latestValue: {
            data: Uint8Array;
        } | null;
    }>;
}>;
