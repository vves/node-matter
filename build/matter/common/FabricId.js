"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TlvFabricId = exports.FabricId = void 0;
const matter_js_1 = require("@project-chip/matter.js");
class FabricId {
    constructor(id) {
        this.id = id;
    }
}
exports.FabricId = FabricId;
exports.TlvFabricId = new matter_js_1.TlvWrapper(matter_js_1.TlvUInt64, fabricId => fabricId.id, value => new FabricId(BigInt(value)));
