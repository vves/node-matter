"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TlvDeviceTypeId = exports.DeviceTypeId = void 0;
const matter_js_1 = require("@project-chip/matter.js");
class DeviceTypeId {
    constructor(id) {
        this.id = id;
    }
}
exports.DeviceTypeId = DeviceTypeId;
exports.TlvDeviceTypeId = new matter_js_1.TlvWrapper(matter_js_1.TlvUInt32, deviceTypeId => deviceTypeId.id, value => new DeviceTypeId(value));
