"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupsCluster = void 0;
const Cluster_1 = require("./Cluster");
const GroupId_1 = require("../common/GroupId");
const matter_js_1 = require("@project-chip/matter.js");
const TlvAddGroupRequest = (0, matter_js_1.TlvObject)({
    groupId: (0, matter_js_1.TlvField)(0, GroupId_1.TlvGroupId),
    groupName: (0, matter_js_1.TlvField)(1, matter_js_1.TlvString.bound({ maxLength: 16 })),
});
const TlvAddGroupResponse = (0, matter_js_1.TlvObject)({
    status: (0, matter_js_1.TlvField)(0, (0, matter_js_1.TlvEnum)()),
    groupId: (0, matter_js_1.TlvField)(1, GroupId_1.TlvGroupId),
});
const TlvViewGroupRequest = (0, matter_js_1.TlvObject)({
    groupId: (0, matter_js_1.TlvField)(0, GroupId_1.TlvGroupId),
});
const TlvViewGroupResponse = (0, matter_js_1.TlvObject)({
    status: (0, matter_js_1.TlvField)(0, (0, matter_js_1.TlvEnum)()),
    groupId: (0, matter_js_1.TlvField)(1, GroupId_1.TlvGroupId),
    groupName: (0, matter_js_1.TlvField)(2, matter_js_1.TlvString.bound({ maxLength: 16 })),
});
const TlvGetGroupMembershipRequest = (0, matter_js_1.TlvObject)({
    groupList: (0, matter_js_1.TlvField)(0, (0, matter_js_1.TlvArray)(GroupId_1.TlvGroupId)),
});
const TlvGetGroupMembershipResponse = (0, matter_js_1.TlvObject)({
    capacity: (0, matter_js_1.TlvField)(0, (0, matter_js_1.TlvNullable)(matter_js_1.TlvUInt8)),
    groupList: (0, matter_js_1.TlvField)(1, (0, matter_js_1.TlvArray)(GroupId_1.TlvGroupId)),
});
const TlvRemoveGroupRequest = (0, matter_js_1.TlvObject)({
    groupId: (0, matter_js_1.TlvField)(0, GroupId_1.TlvGroupId),
});
const TlvRemoveGroupResponse = (0, matter_js_1.TlvObject)({
    status: (0, matter_js_1.TlvField)(0, (0, matter_js_1.TlvEnum)()),
    groupId: (0, matter_js_1.TlvField)(1, GroupId_1.TlvGroupId),
});
const TlvRemoveAllGroupResponse = (0, matter_js_1.TlvObject)({
    status: (0, matter_js_1.TlvField)(0, (0, matter_js_1.TlvEnum)()),
});
const TlvAddGroupIfIdentifyingRequest = (0, matter_js_1.TlvObject)({
    groupId: (0, matter_js_1.TlvField)(0, GroupId_1.TlvGroupId),
    groupName: (0, matter_js_1.TlvField)(1, matter_js_1.TlvString.bound({ maxLength: 16 })),
});
const TlvNameSupportBitmap = (0, matter_js_1.TlvBitmap)(matter_js_1.TlvUInt8, {
    groupNames: (0, matter_js_1.BitFlag)(7),
});
exports.GroupsCluster = (0, Cluster_1.Cluster)({
    id: 0x04,
    name: "Groups",
    revision: 4,
    features: {
        groupNames: (0, matter_js_1.BitFlag)(0),
    },
    attributes: {
        nameSupport: (0, Cluster_1.Attribute)(0, TlvNameSupportBitmap, { default: { groupNames: true } }),
    },
    commands: {
        addGroup: (0, Cluster_1.Command)(0, TlvAddGroupRequest, 0, TlvAddGroupResponse),
        viewGroup: (0, Cluster_1.Command)(1, TlvViewGroupRequest, 0, TlvViewGroupResponse),
        getGroupMembership: (0, Cluster_1.Command)(2, TlvGetGroupMembershipRequest, 2, TlvGetGroupMembershipResponse),
        removeGroup: (0, Cluster_1.Command)(3, TlvRemoveGroupRequest, 3, TlvRemoveGroupResponse),
        removeAllGroups: (0, Cluster_1.Command)(4, Cluster_1.TlvNoArguments, 4, TlvRemoveAllGroupResponse),
        addGroupIfIdentifying: (0, Cluster_1.Command)(5, TlvAddGroupIfIdentifyingRequest, 5, Cluster_1.TlvNoResponse),
    }
});
