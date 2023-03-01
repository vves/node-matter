"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TlvClusterId = exports.ClusterId = void 0;
const matter_js_1 = require("@project-chip/matter.js");
class ClusterId {
    constructor(id) {
        this.id = id;
    }
}
exports.ClusterId = ClusterId;
exports.TlvClusterId = new matter_js_1.TlvWrapper(matter_js_1.TlvUInt32, clusterId => clusterId.id, value => new ClusterId(value));
