"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TlvCommandId = exports.CommandId = void 0;
const matter_js_1 = require("@project-chip/matter.js");
class CommandId {
    constructor(id) {
        this.id = id;
    }
}
exports.CommandId = CommandId;
exports.TlvCommandId = new matter_js_1.TlvWrapper(matter_js_1.TlvUInt32, commandId => commandId.id, value => new CommandId(value));
