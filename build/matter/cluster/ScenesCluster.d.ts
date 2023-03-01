import { Attribute, OptionalAttribute, Cluster, Command, OptionalCommand } from "./Cluster";
import { StatusCode } from "../interaction/InteractionMessages";
import { BitFlag } from "@project-chip/matter.js";
export declare const TlvExtensionFieldSet: import("@project-chip/matter.js").ObjectSchema<{
    clusterId: import("@project-chip/matter.js").FieldType<import("../common/ClusterId").ClusterId>;
    attributeValueList: import("@project-chip/matter.js").FieldType<{
        attributeId: import("../common/AttributeId").AttributeId;
        attributeValue: import("@project-chip/matter.js").TlvStream[];
    }[]>;
}>;
export declare const ScenesCluster: Cluster<{
    sceneNames: BitFlag;
}, {
    sceneCount: Attribute<number>;
    currentScene: Attribute<number>;
    currentGroup: Attribute<number>;
    sceneValid: Attribute<boolean>;
    nameSupport: Attribute<import("@project-chip/matter.js").TypeFromBitSchema<{
        sceneNames: BitFlag;
    }>>;
    lastConfiguredBy: OptionalAttribute<import("../common/NodeId").NodeId | null>;
    clusterRevision: Attribute<number>;
    featureMap: Attribute<import("@project-chip/matter.js").TypeFromBitSchema<{
        sceneNames: BitFlag;
    }>>;
    attributeList: Attribute<import("../common/AttributeId").AttributeId[]>;
    eventList: Attribute<import("../common/EventId").EventId[]>;
    acceptedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
    generatedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
}, {
    addScene: Command<{
        groupId: import("../common/GroupId").GroupId;
        sceneId: number;
        transitionTime: number;
        sceneName: string;
        extensionFieldSets: {
            clusterId: import("../common/ClusterId").ClusterId;
            attributeValueList: {
                attributeId: import("../common/AttributeId").AttributeId;
                attributeValue: import("@project-chip/matter.js").TlvStream[];
            }[];
        }[];
    }, {
        status: StatusCode;
        groupId: import("../common/GroupId").GroupId;
        sceneId: number;
    }>;
    viewScene: Command<{
        groupId: import("../common/GroupId").GroupId;
        sceneId: number;
    }, {
        status: StatusCode;
        groupId: import("../common/GroupId").GroupId;
        sceneId: number;
        transitionTime?: number | undefined;
        sceneName?: string | undefined;
        extensionFieldSets?: {
            clusterId: import("../common/ClusterId").ClusterId;
            attributeValueList: {
                attributeId: import("../common/AttributeId").AttributeId;
                attributeValue: import("@project-chip/matter.js").TlvStream[];
            }[];
        }[] | undefined;
    }>;
    removeScene: Command<{
        groupId: import("../common/GroupId").GroupId;
        sceneId: number;
    }, {
        status: StatusCode;
        groupId: import("../common/GroupId").GroupId;
        sceneId: number;
    }>;
    removeAllScenes: Command<{
        groupId: import("../common/GroupId").GroupId;
    }, {
        status: StatusCode;
        groupId: import("../common/GroupId").GroupId;
    }>;
    storeScenes: Command<{
        groupId: import("../common/GroupId").GroupId;
        sceneId: number;
    }, {
        status: StatusCode;
        groupId: import("../common/GroupId").GroupId;
        sceneId: number;
    }>;
    recallScene: Command<{
        groupId: import("../common/GroupId").GroupId;
        sceneId: number;
        transitionTime?: number | null | undefined;
    }, void>;
    getSceneMembership: Command<{
        groupId: import("../common/GroupId").GroupId;
    }, {
        status: StatusCode;
        groupId: import("../common/GroupId").GroupId;
        capacity: number | null;
        sceneList?: number[] | undefined;
    }>;
    enhancedAddScene: OptionalCommand<{
        groupId: import("../common/GroupId").GroupId;
        sceneId: number;
        transitionTime: number;
        sceneName: string;
        extensionFieldSets: {
            clusterId: import("../common/ClusterId").ClusterId;
            attributeValueList: {
                attributeId: import("../common/AttributeId").AttributeId;
                attributeValue: import("@project-chip/matter.js").TlvStream[];
            }[];
        }[];
    }, {
        status: StatusCode;
        groupId: import("../common/GroupId").GroupId;
        sceneId: number;
    }>;
    enhancedViewScene: OptionalCommand<{
        groupId: import("../common/GroupId").GroupId;
        sceneId: number;
    }, {
        status: StatusCode;
        groupId: import("../common/GroupId").GroupId;
        sceneId: number;
        transitionTime?: number | undefined;
        sceneName?: string | undefined;
        extensionFieldSets?: {
            clusterId: import("../common/ClusterId").ClusterId;
            attributeValueList: {
                attributeId: import("../common/AttributeId").AttributeId;
                attributeValue: import("@project-chip/matter.js").TlvStream[];
            }[];
        }[] | undefined;
    }>;
    copyScene: OptionalCommand<{
        mode: import("@project-chip/matter.js").TypeFromBitSchema<{
            copyAllScenes: BitFlag;
        }>;
        groupIdFrom: import("../common/GroupId").GroupId;
        sceneIdFrom: number;
        TlvGroupIdo: import("../common/GroupId").GroupId;
        sceneIdTo: number;
    }, {
        status: StatusCode;
        groupIdFrom: import("../common/GroupId").GroupId;
        sceneIdFrom: number;
    }>;
}, import("./Cluster").Events>;
