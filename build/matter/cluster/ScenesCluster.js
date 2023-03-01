"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScenesCluster = exports.TlvExtensionFieldSet = void 0;
const Cluster_1 = require("./Cluster");
const GroupId_1 = require("../common/GroupId");
const ClusterId_1 = require("../common/ClusterId");
const NodeId_1 = require("../common/NodeId");
const AttributeId_1 = require("../common/AttributeId");
const matter_js_1 = require("@project-chip/matter.js");
const TlvAttributeValuePair = (0, matter_js_1.TlvObject)({
    attributeId: (0, matter_js_1.TlvField)(0, AttributeId_1.TlvAttributeId),
    attributeValue: (0, matter_js_1.TlvField)(1, (0, matter_js_1.TlvArray)(matter_js_1.TlvAny)),
});
exports.TlvExtensionFieldSet = (0, matter_js_1.TlvObject)({
    clusterId: (0, matter_js_1.TlvField)(0, ClusterId_1.TlvClusterId),
    attributeValueList: (0, matter_js_1.TlvField)(1, (0, matter_js_1.TlvArray)(TlvAttributeValuePair)),
});
const TlvAddSceneRequest = (0, matter_js_1.TlvObject)({
    groupId: (0, matter_js_1.TlvField)(0, GroupId_1.TlvGroupId),
    sceneId: (0, matter_js_1.TlvField)(1, matter_js_1.TlvUInt8),
    transitionTime: (0, matter_js_1.TlvField)(2, matter_js_1.TlvUInt16),
    sceneName: (0, matter_js_1.TlvField)(3, matter_js_1.TlvString.bound({ maxLength: 16 })),
    extensionFieldSets: (0, matter_js_1.TlvField)(4, (0, matter_js_1.TlvArray)(exports.TlvExtensionFieldSet)),
});
const TlvViewSceneRequest = (0, matter_js_1.TlvObject)({
    groupId: (0, matter_js_1.TlvField)(0, GroupId_1.TlvGroupId),
    sceneId: (0, matter_js_1.TlvField)(1, matter_js_1.TlvUInt8),
});
const TlvRemoveSceneRequest = (0, matter_js_1.TlvObject)({
    groupId: (0, matter_js_1.TlvField)(0, GroupId_1.TlvGroupId),
    sceneId: (0, matter_js_1.TlvField)(1, matter_js_1.TlvUInt8),
});
const TlvRemoveAllScenesRequest = (0, matter_js_1.TlvObject)({
    groupId: (0, matter_js_1.TlvField)(0, GroupId_1.TlvGroupId),
});
const TlvStoreSceneRequest = (0, matter_js_1.TlvObject)({
    groupId: (0, matter_js_1.TlvField)(0, GroupId_1.TlvGroupId),
    sceneId: (0, matter_js_1.TlvField)(1, matter_js_1.TlvUInt8),
});
const TlvRecallSceneRequest = (0, matter_js_1.TlvObject)({
    groupId: (0, matter_js_1.TlvField)(0, GroupId_1.TlvGroupId),
    sceneId: (0, matter_js_1.TlvField)(1, matter_js_1.TlvUInt8),
    transitionTime: (0, matter_js_1.TlvOptionalField)(2, (0, matter_js_1.TlvNullable)(matter_js_1.TlvUInt16)),
});
const TlvGetSceneMembershipRequest = (0, matter_js_1.TlvObject)({
    groupId: (0, matter_js_1.TlvField)(0, GroupId_1.TlvGroupId),
});
const TlvScenesCopyMode = (0, matter_js_1.TlvBitmap)(matter_js_1.TlvUInt8, {
    copyAllScenes: (0, matter_js_1.BitFlag)(0),
});
const TlvCopySceneRequest = (0, matter_js_1.TlvObject)({
    mode: (0, matter_js_1.TlvField)(0, TlvScenesCopyMode),
    groupIdFrom: (0, matter_js_1.TlvField)(1, GroupId_1.TlvGroupId),
    sceneIdFrom: (0, matter_js_1.TlvField)(2, matter_js_1.TlvUInt8),
    TlvGroupIdo: (0, matter_js_1.TlvField)(3, GroupId_1.TlvGroupId),
    sceneIdTo: (0, matter_js_1.TlvField)(4, matter_js_1.TlvUInt8),
});
const TlvAddSceneResponse = (0, matter_js_1.TlvObject)({
    status: (0, matter_js_1.TlvField)(0, (0, matter_js_1.TlvEnum)()),
    groupId: (0, matter_js_1.TlvField)(1, GroupId_1.TlvGroupId),
    sceneId: (0, matter_js_1.TlvField)(2, matter_js_1.TlvUInt8),
});
const TlvViewSceneResponse = (0, matter_js_1.TlvObject)({
    status: (0, matter_js_1.TlvField)(0, (0, matter_js_1.TlvEnum)()),
    groupId: (0, matter_js_1.TlvField)(1, GroupId_1.TlvGroupId),
    sceneId: (0, matter_js_1.TlvField)(2, matter_js_1.TlvUInt8),
    transitionTime: (0, matter_js_1.TlvOptionalField)(3, matter_js_1.TlvUInt16),
    sceneName: (0, matter_js_1.TlvOptionalField)(4, matter_js_1.TlvString.bound({ maxLength: 16 })),
    extensionFieldSets: (0, matter_js_1.TlvOptionalField)(5, (0, matter_js_1.TlvArray)(exports.TlvExtensionFieldSet)),
});
const TlvRemoveSceneResponse = (0, matter_js_1.TlvObject)({
    status: (0, matter_js_1.TlvField)(0, (0, matter_js_1.TlvEnum)()),
    groupId: (0, matter_js_1.TlvField)(1, GroupId_1.TlvGroupId),
    sceneId: (0, matter_js_1.TlvField)(2, matter_js_1.TlvUInt8),
});
const TlvRemoveAllScenesResponse = (0, matter_js_1.TlvObject)({
    status: (0, matter_js_1.TlvField)(0, (0, matter_js_1.TlvEnum)()),
    groupId: (0, matter_js_1.TlvField)(1, GroupId_1.TlvGroupId),
});
const TlvStoreSceneResponse = (0, matter_js_1.TlvObject)({
    status: (0, matter_js_1.TlvField)(0, (0, matter_js_1.TlvEnum)()),
    groupId: (0, matter_js_1.TlvField)(1, GroupId_1.TlvGroupId),
    sceneId: (0, matter_js_1.TlvField)(2, matter_js_1.TlvUInt8),
});
const TlvGetSceneMembershipResponse = (0, matter_js_1.TlvObject)({
    status: (0, matter_js_1.TlvField)(0, (0, matter_js_1.TlvEnum)()),
    capacity: (0, matter_js_1.TlvField)(1, (0, matter_js_1.TlvNullable)(matter_js_1.TlvUInt8)),
    groupId: (0, matter_js_1.TlvField)(2, GroupId_1.TlvGroupId),
    sceneList: (0, matter_js_1.TlvOptionalField)(3, (0, matter_js_1.TlvArray)(matter_js_1.TlvUInt8)),
});
const TlvCopySceneResponse = (0, matter_js_1.TlvObject)({
    status: (0, matter_js_1.TlvField)(0, (0, matter_js_1.TlvEnum)()),
    groupIdFrom: (0, matter_js_1.TlvField)(1, GroupId_1.TlvGroupId),
    sceneIdFrom: (0, matter_js_1.TlvField)(2, matter_js_1.TlvUInt8),
});
const TlvNameSupportBitmap = (0, matter_js_1.TlvBitmap)(matter_js_1.TlvUInt8, {
    sceneNames: (0, matter_js_1.BitFlag)(7),
});
exports.ScenesCluster = (0, Cluster_1.Cluster)({
    id: 0x05,
    name: "Scenes",
    revision: 4,
    features: {
        sceneNames: (0, matter_js_1.BitFlag)(0),
    },
    attributes: {
        sceneCount: (0, Cluster_1.Attribute)(0, matter_js_1.TlvUInt8, { default: 0 }),
        currentScene: (0, Cluster_1.Attribute)(1, matter_js_1.TlvUInt8, { default: 0 }),
        currentGroup: (0, Cluster_1.Attribute)(2, matter_js_1.TlvUInt16.bound({ min: 0, max: 0xfff7 }), { default: 0 }),
        sceneValid: (0, Cluster_1.Attribute)(3, matter_js_1.TlvBoolean, { default: false }),
        nameSupport: (0, Cluster_1.Attribute)(4, TlvNameSupportBitmap, { default: { sceneNames: true } }),
        lastConfiguredBy: (0, Cluster_1.OptionalAttribute)(5, (0, matter_js_1.TlvNullable)(NodeId_1.TlvNodeId), { default: null }),
    },
    commands: {
        addScene: (0, Cluster_1.Command)(0, TlvAddSceneRequest, 0, TlvAddSceneResponse),
        viewScene: (0, Cluster_1.Command)(1, TlvViewSceneRequest, 1, TlvViewSceneResponse),
        removeScene: (0, Cluster_1.Command)(2, TlvRemoveSceneRequest, 2, TlvRemoveSceneResponse),
        removeAllScenes: (0, Cluster_1.Command)(3, TlvRemoveAllScenesRequest, 3, TlvRemoveAllScenesResponse),
        storeScenes: (0, Cluster_1.Command)(4, TlvStoreSceneRequest, 4, TlvStoreSceneResponse),
        recallScene: (0, Cluster_1.Command)(5, TlvRecallSceneRequest, 5, Cluster_1.TlvNoResponse),
        getSceneMembership: (0, Cluster_1.Command)(6, TlvGetSceneMembershipRequest, 6, TlvGetSceneMembershipResponse),
        enhancedAddScene: (0, Cluster_1.OptionalCommand)(0x40, TlvAddSceneRequest, 0x40, TlvAddSceneResponse),
        enhancedViewScene: (0, Cluster_1.OptionalCommand)(0x41, TlvViewSceneRequest, 0x41, TlvViewSceneResponse),
        copyScene: (0, Cluster_1.OptionalCommand)(0x42, TlvCopySceneRequest, 0x42, TlvCopySceneResponse),
    },
});
