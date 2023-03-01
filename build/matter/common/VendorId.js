"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TlvVendorId = exports.VendorId = void 0;
const matter_js_1 = require("@project-chip/matter.js");
class VendorId {
    constructor(id) {
        this.id = id;
    }
}
exports.VendorId = VendorId;
exports.TlvVendorId = new matter_js_1.TlvWrapper(matter_js_1.TlvUInt16, vendorId => vendorId.id, value => new VendorId(value));
