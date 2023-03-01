"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TlvEndpointNumber = exports.EndpointNumber = void 0;
const matter_js_1 = require("@project-chip/matter.js");
class EndpointNumber {
    constructor(number) {
        this.number = number;
    }
}
exports.EndpointNumber = EndpointNumber;
exports.TlvEndpointNumber = new matter_js_1.TlvWrapper(matter_js_1.TlvUInt16, endpointNumber => endpointNumber.number, value => new EndpointNumber(value));
