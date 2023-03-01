"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TlvGroupId = exports.GroupId = void 0;
const matter_js_1 = require("@project-chip/matter.js");
class GroupId {
    constructor(id) {
        this.id = id;
    }
}
exports.GroupId = GroupId;
exports.TlvGroupId = new matter_js_1.TlvWrapper(matter_js_1.TlvUInt16, groupId => groupId.id, value => new GroupId(value));
