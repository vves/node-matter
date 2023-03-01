"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TlvEventId = exports.EventId = void 0;
const matter_js_1 = require("@project-chip/matter.js");
class EventId {
    constructor(id) {
        this.id = id;
    }
}
exports.EventId = EventId;
exports.TlvEventId = new matter_js_1.TlvWrapper(matter_js_1.TlvUInt32, eventId => eventId.id, value => new EventId(value));
