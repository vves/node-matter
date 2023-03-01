"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TlvFabricIndex = exports.FabricIndex = void 0;
const matter_js_1 = require("@project-chip/matter.js");
class FabricIndex {
    constructor(index) {
        this.index = index;
    }
}
exports.FabricIndex = FabricIndex;
FabricIndex.NO_FABRIC = new FabricIndex(0);
exports.TlvFabricIndex = new matter_js_1.TlvWrapper(matter_js_1.TlvUInt8.bound({ min: 0, max: 254 }), farbricIndex => farbricIndex.index, value => value === 0 ? FabricIndex.NO_FABRIC : new FabricIndex(value));
