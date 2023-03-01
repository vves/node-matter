"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cluster = exports.GlobalAttributes = exports.OptionalEvent = exports.Event = exports.OptionalCommand = exports.Command = exports.TlvNoResponse = exports.TlvNoArguments = exports.OptionalWritableAttribute = exports.WritableAttribute = exports.OptionalAttribute = exports.Attribute = void 0;
const Type_1 = require("../../util/Type");
const matter_js_1 = require("@project-chip/matter.js");
const AttributeId_1 = require("../common/AttributeId");
const EventId_1 = require("../common/EventId");
const CommandId_1 = require("../common/CommandId");
;
const Attribute = (id, schema, { persistent = false, omitChanges = false, default: conformanceValue, readAcl = 0 } = {}) => ({ id, schema, optional: false, writable: false, persistent, omitChanges, default: conformanceValue, readAcl });
exports.Attribute = Attribute;
const OptionalAttribute = (id, schema, { persistent = false, omitChanges = false, default: conformanceValue, readAcl = 0 } = {}) => ({ id, schema, optional: true, writable: false, persistent, omitChanges, default: conformanceValue, readAcl });
exports.OptionalAttribute = OptionalAttribute;
const WritableAttribute = (id, schema, { persistent = false, omitChanges = false, default: conformanceValue, readAcl = 0, writeAcl = 0 } = {}) => ({ id, schema, optional: false, writable: true, persistent, omitChanges, default: conformanceValue, readAcl, writeAcl });
exports.WritableAttribute = WritableAttribute;
const OptionalWritableAttribute = (id, schema, { persistent = false, omitChanges = false, default: conformanceValue, readAcl = 0, writeAcl = 0 } = {}) => ({ id, schema, optional: true, writable: true, persistent, omitChanges, default: conformanceValue, readAcl, writeAcl });
exports.OptionalWritableAttribute = OptionalWritableAttribute;
exports.TlvNoArguments = (0, matter_js_1.TlvObject)({});
exports.TlvNoResponse = matter_js_1.TlvVoid;
;
;
const Command = (requestId, requestSchema, responseId, responseSchema) => ({ optional: false, requestId, requestSchema, responseId, responseSchema });
exports.Command = Command;
const OptionalCommand = (requestId, requestSchema, responseId, responseSchema) => ({ optional: true, requestId, requestSchema, responseId, responseSchema });
exports.OptionalCommand = OptionalCommand;
const Event = (id, priority, data = {}) => ({ id, schema: (0, matter_js_1.TlvObject)(data), priority, optional: false });
exports.Event = Event;
const OptionalEvent = (id, priority, data = {}) => ({ id, schema: (0, matter_js_1.TlvObject)(data), priority, optional: true });
exports.OptionalEvent = OptionalEvent;
const GlobalAttributes = (features) => ({
    clusterRevision: (0, exports.Attribute)(0xFFFD, matter_js_1.TlvUInt16),
    featureMap: (0, exports.Attribute)(0xFFFC, (0, matter_js_1.TlvBitmap)(matter_js_1.TlvUInt32, features)),
    attributeList: (0, exports.Attribute)(0xFFFB, (0, matter_js_1.TlvArray)(AttributeId_1.TlvAttributeId)),
    eventList: (0, exports.Attribute)(0xFFFA, (0, matter_js_1.TlvArray)(EventId_1.TlvEventId)),
    acceptedCommandList: (0, exports.Attribute)(0xFFF9, (0, matter_js_1.TlvArray)(CommandId_1.TlvCommandId)),
    generatedCommandList: (0, exports.Attribute)(0xFFF8, (0, matter_js_1.TlvArray)(CommandId_1.TlvCommandId)),
});
exports.GlobalAttributes = GlobalAttributes;
const Cluster = ({ id, name, revision, features = {}, attributes = {}, commands = {}, events = {}, }) => ({
    id,
    name,
    revision,
    features,
    commands,
    attributes: (0, Type_1.Merge)(attributes, (0, exports.GlobalAttributes)(features)),
    events,
});
exports.Cluster = Cluster;
