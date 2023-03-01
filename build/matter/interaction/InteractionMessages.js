"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TlvWriteResponse = exports.TlvWriteRequest = exports.TlvTimedRequest = exports.TlvInvokeResponse = exports.TlvInvokeRequest = exports.TlvSubscribeResponse = exports.TlvSubscribeRequest = exports.TlvDataReport = exports.TlvReadRequest = exports.TlvStatusResponse = exports.TlvInvokeResponseData = exports.TlvCommandStatus = exports.TlvCommandData = exports.TlvCommandPath = exports.TlvEventReport = exports.TlvEventStatus = exports.TlvAttributeReport = exports.TlvAttributeReportValue = exports.TlvAttributeData = exports.TlvAttributeStatus = exports.TlvStatus = exports.TlvDataVersionFilter = exports.TlvClusterPath = exports.TlvEventFilter = exports.TlvEventData = exports.TlvEventPath = exports.TlvAttributePath = void 0;
const NodeId_1 = require("../common/NodeId");
const matter_js_1 = require("@project-chip/matter.js");
exports.TlvAttributePath = (0, matter_js_1.TlvList)({
    enableTagCompression: (0, matter_js_1.TlvOptionalField)(0, matter_js_1.TlvBoolean),
    nodeId: (0, matter_js_1.TlvOptionalField)(1, NodeId_1.TlvNodeId),
    endpointId: (0, matter_js_1.TlvOptionalField)(2, matter_js_1.TlvUInt16),
    clusterId: (0, matter_js_1.TlvOptionalField)(3, matter_js_1.TlvUInt32),
    attributeId: (0, matter_js_1.TlvOptionalField)(4, matter_js_1.TlvUInt32),
    listIndex: (0, matter_js_1.TlvOptionalField)(5, (0, matter_js_1.TlvNullable)(matter_js_1.TlvUInt16)),
});
exports.TlvEventPath = (0, matter_js_1.TlvList)({
    node: (0, matter_js_1.TlvOptionalField)(0, NodeId_1.TlvNodeId),
    endpoint: (0, matter_js_1.TlvOptionalField)(1, matter_js_1.TlvUInt16),
    cluster: (0, matter_js_1.TlvOptionalField)(2, matter_js_1.TlvUInt32),
    event: (0, matter_js_1.TlvOptionalField)(3, matter_js_1.TlvUInt32),
    isUrgent: (0, matter_js_1.TlvOptionalField)(4, matter_js_1.TlvBoolean),
});
exports.TlvEventData = (0, matter_js_1.TlvObject)({
    path: (0, matter_js_1.TlvField)(0, exports.TlvEventPath),
    eventNumber: (0, matter_js_1.TlvField)(1, matter_js_1.TlvUInt64),
    priority: (0, matter_js_1.TlvField)(2, matter_js_1.TlvUInt8),
    epochTimestamp: (0, matter_js_1.TlvOptionalField)(3, matter_js_1.TlvInt64),
    systemTimestamp: (0, matter_js_1.TlvOptionalField)(4, matter_js_1.TlvUInt64),
    deltaEpochTimestamp: (0, matter_js_1.TlvOptionalField)(5, matter_js_1.TlvUInt64),
    deltaSystemTimestamp: (0, matter_js_1.TlvOptionalField)(6, matter_js_1.TlvUInt64),
    data: (0, matter_js_1.TlvOptionalField)(7, matter_js_1.TlvAny),
});
exports.TlvEventFilter = (0, matter_js_1.TlvList)({
    node: (0, matter_js_1.TlvOptionalField)(0, NodeId_1.TlvNodeId),
    eventMin: (0, matter_js_1.TlvField)(1, matter_js_1.TlvUInt64),
});
exports.TlvClusterPath = (0, matter_js_1.TlvList)({
    node: (0, matter_js_1.TlvOptionalField)(0, NodeId_1.TlvNodeId),
    endpoint: (0, matter_js_1.TlvField)(1, matter_js_1.TlvUInt16),
    cluster: (0, matter_js_1.TlvField)(2, matter_js_1.TlvUInt32),
});
exports.TlvDataVersionFilter = (0, matter_js_1.TlvObject)({
    path: (0, matter_js_1.TlvField)(0, exports.TlvClusterPath),
    dataVersion: (0, matter_js_1.TlvField)(1, matter_js_1.TlvUInt32),
});
exports.TlvStatus = (0, matter_js_1.TlvObject)({
    status: (0, matter_js_1.TlvOptionalField)(0, (0, matter_js_1.TlvEnum)()),
    clusterStatus: (0, matter_js_1.TlvOptionalField)(1, (0, matter_js_1.TlvEnum)()),
});
exports.TlvAttributeStatus = (0, matter_js_1.TlvObject)({
    path: (0, matter_js_1.TlvField)(0, exports.TlvAttributePath),
    status: (0, matter_js_1.TlvField)(1, exports.TlvStatus),
});
exports.TlvAttributeData = (0, matter_js_1.TlvObject)({
    dataVersion: (0, matter_js_1.TlvOptionalField)(0, matter_js_1.TlvUInt32),
    path: (0, matter_js_1.TlvField)(1, exports.TlvAttributePath),
    data: (0, matter_js_1.TlvField)(2, matter_js_1.TlvAny),
});
exports.TlvAttributeReportValue = (0, matter_js_1.TlvObject)({
    version: (0, matter_js_1.TlvField)(0, matter_js_1.TlvUInt32),
    path: (0, matter_js_1.TlvField)(1, exports.TlvAttributePath),
    value: (0, matter_js_1.TlvField)(2, matter_js_1.TlvAny),
});
exports.TlvAttributeReport = (0, matter_js_1.TlvObject)({
    attributeStatus: (0, matter_js_1.TlvOptionalField)(0, exports.TlvAttributeStatus),
    value: (0, matter_js_1.TlvOptionalField)(1, exports.TlvAttributeReportValue),
});
exports.TlvEventStatus = (0, matter_js_1.TlvObject)({
    path: (0, matter_js_1.TlvField)(0, exports.TlvEventPath),
    status: (0, matter_js_1.TlvField)(1, exports.TlvStatus),
});
exports.TlvEventReport = (0, matter_js_1.TlvObject)({
    eventStatus: (0, matter_js_1.TlvField)(0, exports.TlvEventStatus),
    eventData: (0, matter_js_1.TlvField)(1, exports.TlvEventData),
});
exports.TlvCommandPath = (0, matter_js_1.TlvList)({
    endpointId: (0, matter_js_1.TlvField)(0, matter_js_1.TlvUInt16),
    clusterId: (0, matter_js_1.TlvField)(1, matter_js_1.TlvUInt32),
    commandId: (0, matter_js_1.TlvField)(2, matter_js_1.TlvUInt32),
});
exports.TlvCommandData = (0, matter_js_1.TlvObject)({
    path: (0, matter_js_1.TlvField)(0, exports.TlvCommandPath),
    args: (0, matter_js_1.TlvField)(1, matter_js_1.TlvAny),
});
exports.TlvCommandStatus = (0, matter_js_1.TlvObject)({
    path: (0, matter_js_1.TlvField)(0, exports.TlvCommandPath),
    result: (0, matter_js_1.TlvField)(1, (0, matter_js_1.TlvObject)({
        code: (0, matter_js_1.TlvField)(0, matter_js_1.TlvUInt16),
    })),
});
exports.TlvInvokeResponseData = (0, matter_js_1.TlvObject)({
    response: (0, matter_js_1.TlvOptionalField)(0, (0, matter_js_1.TlvObject)({
        path: (0, matter_js_1.TlvField)(0, exports.TlvCommandPath),
        response: (0, matter_js_1.TlvField)(1, matter_js_1.TlvAny),
    })),
    result: (0, matter_js_1.TlvOptionalField)(1, exports.TlvCommandStatus),
});
exports.TlvStatusResponse = (0, matter_js_1.TlvObject)({
    status: (0, matter_js_1.TlvField)(0, (0, matter_js_1.TlvEnum)()),
    interactionModelRevision: (0, matter_js_1.TlvField)(0xFF, matter_js_1.TlvUInt8),
});
exports.TlvReadRequest = (0, matter_js_1.TlvObject)({
    attributes: (0, matter_js_1.TlvField)(0, (0, matter_js_1.TlvArray)(exports.TlvAttributePath)),
    eventRequests: (0, matter_js_1.TlvOptionalField)(1, (0, matter_js_1.TlvArray)(exports.TlvEventPath)),
    eventFilters: (0, matter_js_1.TlvOptionalField)(2, (0, matter_js_1.TlvArray)(exports.TlvEventFilter)),
    isFabricFiltered: (0, matter_js_1.TlvField)(3, matter_js_1.TlvBoolean),
    dataVersionFilters: (0, matter_js_1.TlvOptionalField)(4, (0, matter_js_1.TlvArray)(exports.TlvDataVersionFilter)),
    interactionModelRevision: (0, matter_js_1.TlvField)(0xFF, matter_js_1.TlvUInt8),
});
exports.TlvDataReport = (0, matter_js_1.TlvObject)({
    subscriptionId: (0, matter_js_1.TlvOptionalField)(0, matter_js_1.TlvUInt32),
    values: (0, matter_js_1.TlvOptionalField)(1, (0, matter_js_1.TlvArray)(exports.TlvAttributeReport)),
    eventReports: (0, matter_js_1.TlvOptionalField)(2, (0, matter_js_1.TlvArray)(exports.TlvEventReport)),
    moreChunkedMessages: (0, matter_js_1.TlvOptionalField)(3, matter_js_1.TlvBoolean),
    suppressResponse: (0, matter_js_1.TlvOptionalField)(4, matter_js_1.TlvBoolean),
    interactionModelRevision: (0, matter_js_1.TlvField)(0xFF, matter_js_1.TlvUInt8),
});
exports.TlvSubscribeRequest = (0, matter_js_1.TlvObject)({
    keepSubscriptions: (0, matter_js_1.TlvField)(0, matter_js_1.TlvBoolean),
    minIntervalFloorSeconds: (0, matter_js_1.TlvField)(1, matter_js_1.TlvUInt16),
    maxIntervalCeilingSeconds: (0, matter_js_1.TlvField)(2, matter_js_1.TlvUInt16),
    attributeRequests: (0, matter_js_1.TlvOptionalField)(3, (0, matter_js_1.TlvArray)(exports.TlvAttributePath)),
    eventRequests: (0, matter_js_1.TlvOptionalField)(4, (0, matter_js_1.TlvArray)(exports.TlvEventPath)),
    eventFilters: (0, matter_js_1.TlvOptionalField)(5, (0, matter_js_1.TlvArray)(exports.TlvEventFilter)),
    isFabricFiltered: (0, matter_js_1.TlvField)(7, matter_js_1.TlvBoolean),
    dataVersionFilters: (0, matter_js_1.TlvOptionalField)(8, (0, matter_js_1.TlvArray)(exports.TlvDataVersionFilter)),
});
exports.TlvSubscribeResponse = (0, matter_js_1.TlvObject)({
    subscriptionId: (0, matter_js_1.TlvField)(0, matter_js_1.TlvUInt32),
    maxInterval: (0, matter_js_1.TlvField)(2, matter_js_1.TlvUInt16),
    interactionModelRevision: (0, matter_js_1.TlvField)(0xFF, matter_js_1.TlvUInt8),
});
exports.TlvInvokeRequest = (0, matter_js_1.TlvObject)({
    suppressResponse: (0, matter_js_1.TlvField)(0, matter_js_1.TlvBoolean),
    timedRequest: (0, matter_js_1.TlvField)(1, matter_js_1.TlvBoolean),
    invokes: (0, matter_js_1.TlvField)(2, (0, matter_js_1.TlvArray)(exports.TlvCommandData)),
    interactionModelRevision: (0, matter_js_1.TlvField)(0xFF, matter_js_1.TlvUInt8),
});
exports.TlvInvokeResponse = (0, matter_js_1.TlvObject)({
    suppressResponse: (0, matter_js_1.TlvField)(0, matter_js_1.TlvBoolean),
    responses: (0, matter_js_1.TlvField)(1, (0, matter_js_1.TlvArray)(exports.TlvInvokeResponseData)),
    interactionModelRevision: (0, matter_js_1.TlvField)(0xFF, matter_js_1.TlvUInt8),
});
exports.TlvTimedRequest = (0, matter_js_1.TlvObject)({
    timeout: (0, matter_js_1.TlvField)(0, matter_js_1.TlvUInt16),
    interactionModelRevision: (0, matter_js_1.TlvField)(0xFF, matter_js_1.TlvUInt8),
});
exports.TlvWriteRequest = (0, matter_js_1.TlvObject)({
    suppressResponse: (0, matter_js_1.TlvOptionalField)(0, matter_js_1.TlvBoolean),
    timedRequest: (0, matter_js_1.TlvField)(1, matter_js_1.TlvBoolean),
    writeRequests: (0, matter_js_1.TlvField)(2, (0, matter_js_1.TlvArray)(exports.TlvAttributeData)),
    moreChunkedMessages: (0, matter_js_1.TlvOptionalField)(3, matter_js_1.TlvBoolean),
    interactionModelRevision: (0, matter_js_1.TlvField)(0xFF, matter_js_1.TlvUInt8),
});
exports.TlvWriteResponse = (0, matter_js_1.TlvObject)({
    writeResponses: (0, matter_js_1.TlvField)(0, (0, matter_js_1.TlvArray)(exports.TlvAttributeStatus)),
    interactionModelRevision: (0, matter_js_1.TlvField)(0xFF, matter_js_1.TlvUInt8),
});
