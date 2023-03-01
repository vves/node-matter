import { Attribute, Cluster, Command } from "./Cluster";
import { StatusCode } from "../interaction/InteractionMessages";
import { BitFlag } from "@project-chip/matter.js";
export declare const GroupsCluster: Cluster<{
    groupNames: BitFlag;
}, {
    nameSupport: Attribute<import("@project-chip/matter.js").TypeFromBitSchema<{
        groupNames: BitFlag;
    }>>;
    clusterRevision: Attribute<number>;
    featureMap: Attribute<import("@project-chip/matter.js").TypeFromBitSchema<{
        groupNames: BitFlag;
    }>>;
    attributeList: Attribute<import("../common/AttributeId").AttributeId[]>;
    eventList: Attribute<import("../common/EventId").EventId[]>;
    acceptedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
    generatedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
}, {
    addGroup: Command<{
        groupId: import("../common/GroupId").GroupId;
        groupName: string;
    }, {
        status: StatusCode;
        groupId: import("../common/GroupId").GroupId;
    }>;
    viewGroup: Command<{
        groupId: import("../common/GroupId").GroupId;
    }, {
        status: StatusCode;
        groupId: import("../common/GroupId").GroupId;
        groupName: string;
    }>;
    getGroupMembership: Command<{
        groupList: import("../common/GroupId").GroupId[];
    }, {
        groupList: import("../common/GroupId").GroupId[];
        capacity: number | null;
    }>;
    removeGroup: Command<{
        groupId: import("../common/GroupId").GroupId;
    }, {
        status: StatusCode;
        groupId: import("../common/GroupId").GroupId;
    }>;
    removeAllGroups: Command<{}, {
        status: StatusCode;
    }>;
    addGroupIfIdentifying: Command<{
        groupId: import("../common/GroupId").GroupId;
        groupName: string;
    }, void>;
}, import("./Cluster").Events>;
