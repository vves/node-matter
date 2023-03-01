"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TlvAttributeId = exports.AttributeId = void 0;
const matter_js_1 = require("@project-chip/matter.js");
class AttributeId {
    constructor(id) {
        this.id = id;
    }
}
exports.AttributeId = AttributeId;
exports.TlvAttributeId = new matter_js_1.TlvWrapper(matter_js_1.TlvUInt32, attributeId => attributeId.id, value => new AttributeId(value));
