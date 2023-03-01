export declare const enum StatusCode {
    Success = 0,
    Failure = 1,
    InvalidSubscription = 125,
    UnsupportedAccess = 126,
    UnsupportedEndpoint = 127,
    InvalidAction = 128,
    UnsupportedCommand = 129,
    InvalidCommand = 133,
    UnsupportedAttribute = 134,
    ConstraintError = 135,
    UnsupportedWrite = 136,
    ResourceExhausted = 137,
    NotFound = 139,
    UnreportableAttribute = 140,
    InvalidDataType = 141,
    UnsupportedRead = 143,
    DataVersionMismatch = 146,
    Timeout = 148,
    UnsupportedMode = 155,
    Busy = 156,
    UnsupportedCluster = 195,
    NoUpstreamSubscription = 197,
    NeedsTimedInteraction = 198,
    UnsupportedEvent = 199,
    PathsExhausted = 200,
    TimedRequestMismatch = 201,
    FailsafeRequired = 202
}
export declare const TlvAttributePath: import("@project-chip/matter.js").ObjectSchema<{
    enableTagCompression: import("@project-chip/matter.js").OptionalFieldType<boolean>;
    nodeId: import("@project-chip/matter.js").OptionalFieldType<import("../common/NodeId").NodeId>;
    endpointId: import("@project-chip/matter.js").OptionalFieldType<number>;
    clusterId: import("@project-chip/matter.js").OptionalFieldType<number>;
    attributeId: import("@project-chip/matter.js").OptionalFieldType<number>;
    listIndex: import("@project-chip/matter.js").OptionalFieldType<number | null>;
}>;
export declare const TlvEventPath: import("@project-chip/matter.js").ObjectSchema<{
    node: import("@project-chip/matter.js").OptionalFieldType<import("../common/NodeId").NodeId>;
    endpoint: import("@project-chip/matter.js").OptionalFieldType<number>;
    cluster: import("@project-chip/matter.js").OptionalFieldType<number>;
    event: import("@project-chip/matter.js").OptionalFieldType<number>;
    isUrgent: import("@project-chip/matter.js").OptionalFieldType<boolean>;
}>;
export declare const TlvEventData: import("@project-chip/matter.js").ObjectSchema<{
    path: import("@project-chip/matter.js").FieldType<{
        event?: number | undefined;
        node?: import("../common/NodeId").NodeId | undefined;
        endpoint?: number | undefined;
        cluster?: number | undefined;
        isUrgent?: boolean | undefined;
    }>;
    eventNumber: import("@project-chip/matter.js").FieldType<number | bigint>;
    priority: import("@project-chip/matter.js").FieldType<number>;
    epochTimestamp: import("@project-chip/matter.js").OptionalFieldType<number | bigint>;
    systemTimestamp: import("@project-chip/matter.js").OptionalFieldType<number | bigint>;
    deltaEpochTimestamp: import("@project-chip/matter.js").OptionalFieldType<number | bigint>;
    deltaSystemTimestamp: import("@project-chip/matter.js").OptionalFieldType<number | bigint>;
    data: import("@project-chip/matter.js").OptionalFieldType<import("@project-chip/matter.js").TlvStream>;
}>;
export declare const TlvEventFilter: import("@project-chip/matter.js").ObjectSchema<{
    node: import("@project-chip/matter.js").OptionalFieldType<import("../common/NodeId").NodeId>;
    eventMin: import("@project-chip/matter.js").FieldType<number | bigint>;
}>;
export declare const TlvClusterPath: import("@project-chip/matter.js").ObjectSchema<{
    node: import("@project-chip/matter.js").OptionalFieldType<import("../common/NodeId").NodeId>;
    endpoint: import("@project-chip/matter.js").FieldType<number>;
    cluster: import("@project-chip/matter.js").FieldType<number>;
}>;
export declare const TlvDataVersionFilter: import("@project-chip/matter.js").ObjectSchema<{
    path: import("@project-chip/matter.js").FieldType<{
        endpoint: number;
        cluster: number;
        node?: import("../common/NodeId").NodeId | undefined;
    }>;
    dataVersion: import("@project-chip/matter.js").FieldType<number>;
}>;
export declare const TlvStatus: import("@project-chip/matter.js").ObjectSchema<{
    status: import("@project-chip/matter.js").OptionalFieldType<StatusCode>;
    clusterStatus: import("@project-chip/matter.js").OptionalFieldType<StatusCode>;
}>;
export declare const TlvAttributeStatus: import("@project-chip/matter.js").ObjectSchema<{
    path: import("@project-chip/matter.js").FieldType<{
        nodeId?: import("../common/NodeId").NodeId | undefined;
        enableTagCompression?: boolean | undefined;
        endpointId?: number | undefined;
        clusterId?: number | undefined;
        attributeId?: number | undefined;
        listIndex?: number | null | undefined;
    }>;
    status: import("@project-chip/matter.js").FieldType<{
        status?: StatusCode | undefined;
        clusterStatus?: StatusCode | undefined;
    }>;
}>;
export declare const TlvAttributeData: import("@project-chip/matter.js").ObjectSchema<{
    dataVersion: import("@project-chip/matter.js").OptionalFieldType<number>;
    path: import("@project-chip/matter.js").FieldType<{
        nodeId?: import("../common/NodeId").NodeId | undefined;
        enableTagCompression?: boolean | undefined;
        endpointId?: number | undefined;
        clusterId?: number | undefined;
        attributeId?: number | undefined;
        listIndex?: number | null | undefined;
    }>;
    data: import("@project-chip/matter.js").FieldType<import("@project-chip/matter.js").TlvStream>;
}>;
export declare const TlvAttributeReportValue: import("@project-chip/matter.js").ObjectSchema<{
    version: import("@project-chip/matter.js").FieldType<number>;
    path: import("@project-chip/matter.js").FieldType<{
        nodeId?: import("../common/NodeId").NodeId | undefined;
        enableTagCompression?: boolean | undefined;
        endpointId?: number | undefined;
        clusterId?: number | undefined;
        attributeId?: number | undefined;
        listIndex?: number | null | undefined;
    }>;
    value: import("@project-chip/matter.js").FieldType<import("@project-chip/matter.js").TlvStream>;
}>;
export declare const TlvAttributeReport: import("@project-chip/matter.js").ObjectSchema<{
    attributeStatus: import("@project-chip/matter.js").OptionalFieldType<{
        path: {
            nodeId?: import("../common/NodeId").NodeId | undefined;
            enableTagCompression?: boolean | undefined;
            endpointId?: number | undefined;
            clusterId?: number | undefined;
            attributeId?: number | undefined;
            listIndex?: number | null | undefined;
        };
        status: {
            status?: StatusCode | undefined;
            clusterStatus?: StatusCode | undefined;
        };
    }>;
    value: import("@project-chip/matter.js").OptionalFieldType<{
        value: import("@project-chip/matter.js").TlvStream;
        path: {
            nodeId?: import("../common/NodeId").NodeId | undefined;
            enableTagCompression?: boolean | undefined;
            endpointId?: number | undefined;
            clusterId?: number | undefined;
            attributeId?: number | undefined;
            listIndex?: number | null | undefined;
        };
        version: number;
    }>;
}>;
export declare const TlvEventStatus: import("@project-chip/matter.js").ObjectSchema<{
    path: import("@project-chip/matter.js").FieldType<{
        event?: number | undefined;
        node?: import("../common/NodeId").NodeId | undefined;
        endpoint?: number | undefined;
        cluster?: number | undefined;
        isUrgent?: boolean | undefined;
    }>;
    status: import("@project-chip/matter.js").FieldType<{
        status?: StatusCode | undefined;
        clusterStatus?: StatusCode | undefined;
    }>;
}>;
export declare const TlvEventReport: import("@project-chip/matter.js").ObjectSchema<{
    eventStatus: import("@project-chip/matter.js").FieldType<{
        path: {
            event?: number | undefined;
            node?: import("../common/NodeId").NodeId | undefined;
            endpoint?: number | undefined;
            cluster?: number | undefined;
            isUrgent?: boolean | undefined;
        };
        status: {
            status?: StatusCode | undefined;
            clusterStatus?: StatusCode | undefined;
        };
    }>;
    eventData: import("@project-chip/matter.js").FieldType<{
        priority: number;
        path: {
            event?: number | undefined;
            node?: import("../common/NodeId").NodeId | undefined;
            endpoint?: number | undefined;
            cluster?: number | undefined;
            isUrgent?: boolean | undefined;
        };
        eventNumber: number | bigint;
        data?: import("@project-chip/matter.js").TlvStream | undefined;
        epochTimestamp?: number | bigint | undefined;
        systemTimestamp?: number | bigint | undefined;
        deltaEpochTimestamp?: number | bigint | undefined;
        deltaSystemTimestamp?: number | bigint | undefined;
    }>;
}>;
export declare const TlvCommandPath: import("@project-chip/matter.js").ObjectSchema<{
    endpointId: import("@project-chip/matter.js").FieldType<number>;
    clusterId: import("@project-chip/matter.js").FieldType<number>;
    commandId: import("@project-chip/matter.js").FieldType<number>;
}>;
export declare const TlvCommandData: import("@project-chip/matter.js").ObjectSchema<{
    path: import("@project-chip/matter.js").FieldType<{
        endpointId: number;
        clusterId: number;
        commandId: number;
    }>;
    args: import("@project-chip/matter.js").FieldType<import("@project-chip/matter.js").TlvStream>;
}>;
export declare const TlvCommandStatus: import("@project-chip/matter.js").ObjectSchema<{
    path: import("@project-chip/matter.js").FieldType<{
        endpointId: number;
        clusterId: number;
        commandId: number;
    }>;
    result: import("@project-chip/matter.js").FieldType<{
        code: number;
    }>;
}>;
export declare const TlvInvokeResponseData: import("@project-chip/matter.js").ObjectSchema<{
    response: import("@project-chip/matter.js").OptionalFieldType<{
        path: {
            endpointId: number;
            clusterId: number;
            commandId: number;
        };
        response: import("@project-chip/matter.js").TlvStream;
    }>;
    result: import("@project-chip/matter.js").OptionalFieldType<{
        path: {
            endpointId: number;
            clusterId: number;
            commandId: number;
        };
        result: {
            code: number;
        };
    }>;
}>;
export declare const TlvStatusResponse: import("@project-chip/matter.js").ObjectSchema<{
    status: import("@project-chip/matter.js").FieldType<StatusCode>;
    interactionModelRevision: import("@project-chip/matter.js").FieldType<number>;
}>;
export declare const TlvReadRequest: import("@project-chip/matter.js").ObjectSchema<{
    attributes: import("@project-chip/matter.js").FieldType<{
        nodeId?: import("../common/NodeId").NodeId | undefined;
        enableTagCompression?: boolean | undefined;
        endpointId?: number | undefined;
        clusterId?: number | undefined;
        attributeId?: number | undefined;
        listIndex?: number | null | undefined;
    }[]>;
    eventRequests: import("@project-chip/matter.js").OptionalFieldType<{
        event?: number | undefined;
        node?: import("../common/NodeId").NodeId | undefined;
        endpoint?: number | undefined;
        cluster?: number | undefined;
        isUrgent?: boolean | undefined;
    }[]>;
    eventFilters: import("@project-chip/matter.js").OptionalFieldType<{
        eventMin: number | bigint;
        node?: import("../common/NodeId").NodeId | undefined;
    }[]>;
    isFabricFiltered: import("@project-chip/matter.js").FieldType<boolean>;
    dataVersionFilters: import("@project-chip/matter.js").OptionalFieldType<{
        path: {
            endpoint: number;
            cluster: number;
            node?: import("../common/NodeId").NodeId | undefined;
        };
        dataVersion: number;
    }[]>;
    interactionModelRevision: import("@project-chip/matter.js").FieldType<number>;
}>;
export declare const TlvDataReport: import("@project-chip/matter.js").ObjectSchema<{
    subscriptionId: import("@project-chip/matter.js").OptionalFieldType<number>;
    values: import("@project-chip/matter.js").OptionalFieldType<{
        value?: {
            value: import("@project-chip/matter.js").TlvStream;
            path: {
                nodeId?: import("../common/NodeId").NodeId | undefined;
                enableTagCompression?: boolean | undefined;
                endpointId?: number | undefined;
                clusterId?: number | undefined;
                attributeId?: number | undefined;
                listIndex?: number | null | undefined;
            };
            version: number;
        } | undefined;
        attributeStatus?: {
            path: {
                nodeId?: import("../common/NodeId").NodeId | undefined;
                enableTagCompression?: boolean | undefined;
                endpointId?: number | undefined;
                clusterId?: number | undefined;
                attributeId?: number | undefined;
                listIndex?: number | null | undefined;
            };
            status: {
                status?: StatusCode | undefined;
                clusterStatus?: StatusCode | undefined;
            };
        } | undefined;
    }[]>;
    eventReports: import("@project-chip/matter.js").OptionalFieldType<{
        eventStatus: {
            path: {
                event?: number | undefined;
                node?: import("../common/NodeId").NodeId | undefined;
                endpoint?: number | undefined;
                cluster?: number | undefined;
                isUrgent?: boolean | undefined;
            };
            status: {
                status?: StatusCode | undefined;
                clusterStatus?: StatusCode | undefined;
            };
        };
        eventData: {
            priority: number;
            path: {
                event?: number | undefined;
                node?: import("../common/NodeId").NodeId | undefined;
                endpoint?: number | undefined;
                cluster?: number | undefined;
                isUrgent?: boolean | undefined;
            };
            eventNumber: number | bigint;
            data?: import("@project-chip/matter.js").TlvStream | undefined;
            epochTimestamp?: number | bigint | undefined;
            systemTimestamp?: number | bigint | undefined;
            deltaEpochTimestamp?: number | bigint | undefined;
            deltaSystemTimestamp?: number | bigint | undefined;
        };
    }[]>;
    moreChunkedMessages: import("@project-chip/matter.js").OptionalFieldType<boolean>;
    suppressResponse: import("@project-chip/matter.js").OptionalFieldType<boolean>;
    interactionModelRevision: import("@project-chip/matter.js").FieldType<number>;
}>;
export declare const TlvSubscribeRequest: import("@project-chip/matter.js").ObjectSchema<{
    keepSubscriptions: import("@project-chip/matter.js").FieldType<boolean>;
    minIntervalFloorSeconds: import("@project-chip/matter.js").FieldType<number>;
    maxIntervalCeilingSeconds: import("@project-chip/matter.js").FieldType<number>;
    attributeRequests: import("@project-chip/matter.js").OptionalFieldType<{
        nodeId?: import("../common/NodeId").NodeId | undefined;
        enableTagCompression?: boolean | undefined;
        endpointId?: number | undefined;
        clusterId?: number | undefined;
        attributeId?: number | undefined;
        listIndex?: number | null | undefined;
    }[]>;
    eventRequests: import("@project-chip/matter.js").OptionalFieldType<{
        event?: number | undefined;
        node?: import("../common/NodeId").NodeId | undefined;
        endpoint?: number | undefined;
        cluster?: number | undefined;
        isUrgent?: boolean | undefined;
    }[]>;
    eventFilters: import("@project-chip/matter.js").OptionalFieldType<{
        eventMin: number | bigint;
        node?: import("../common/NodeId").NodeId | undefined;
    }[]>;
    isFabricFiltered: import("@project-chip/matter.js").FieldType<boolean>;
    dataVersionFilters: import("@project-chip/matter.js").OptionalFieldType<{
        path: {
            endpoint: number;
            cluster: number;
            node?: import("../common/NodeId").NodeId | undefined;
        };
        dataVersion: number;
    }[]>;
}>;
export declare const TlvSubscribeResponse: import("@project-chip/matter.js").ObjectSchema<{
    subscriptionId: import("@project-chip/matter.js").FieldType<number>;
    maxInterval: import("@project-chip/matter.js").FieldType<number>;
    interactionModelRevision: import("@project-chip/matter.js").FieldType<number>;
}>;
export declare const TlvInvokeRequest: import("@project-chip/matter.js").ObjectSchema<{
    suppressResponse: import("@project-chip/matter.js").FieldType<boolean>;
    timedRequest: import("@project-chip/matter.js").FieldType<boolean>;
    invokes: import("@project-chip/matter.js").FieldType<{
        path: {
            endpointId: number;
            clusterId: number;
            commandId: number;
        };
        args: import("@project-chip/matter.js").TlvStream;
    }[]>;
    interactionModelRevision: import("@project-chip/matter.js").FieldType<number>;
}>;
export declare const TlvInvokeResponse: import("@project-chip/matter.js").ObjectSchema<{
    suppressResponse: import("@project-chip/matter.js").FieldType<boolean>;
    responses: import("@project-chip/matter.js").FieldType<{
        response?: {
            path: {
                endpointId: number;
                clusterId: number;
                commandId: number;
            };
            response: import("@project-chip/matter.js").TlvStream;
        } | undefined;
        result?: {
            path: {
                endpointId: number;
                clusterId: number;
                commandId: number;
            };
            result: {
                code: number;
            };
        } | undefined;
    }[]>;
    interactionModelRevision: import("@project-chip/matter.js").FieldType<number>;
}>;
export declare const TlvTimedRequest: import("@project-chip/matter.js").ObjectSchema<{
    timeout: import("@project-chip/matter.js").FieldType<number>;
    interactionModelRevision: import("@project-chip/matter.js").FieldType<number>;
}>;
export declare const TlvWriteRequest: import("@project-chip/matter.js").ObjectSchema<{
    suppressResponse: import("@project-chip/matter.js").OptionalFieldType<boolean>;
    timedRequest: import("@project-chip/matter.js").FieldType<boolean>;
    writeRequests: import("@project-chip/matter.js").FieldType<{
        data: import("@project-chip/matter.js").TlvStream;
        path: {
            nodeId?: import("../common/NodeId").NodeId | undefined;
            enableTagCompression?: boolean | undefined;
            endpointId?: number | undefined;
            clusterId?: number | undefined;
            attributeId?: number | undefined;
            listIndex?: number | null | undefined;
        };
        dataVersion?: number | undefined;
    }[]>;
    moreChunkedMessages: import("@project-chip/matter.js").OptionalFieldType<boolean>;
    interactionModelRevision: import("@project-chip/matter.js").FieldType<number>;
}>;
export declare const TlvWriteResponse: import("@project-chip/matter.js").ObjectSchema<{
    writeResponses: import("@project-chip/matter.js").FieldType<{
        path: {
            nodeId?: import("../common/NodeId").NodeId | undefined;
            enableTagCompression?: boolean | undefined;
            endpointId?: number | undefined;
            clusterId?: number | undefined;
            attributeId?: number | undefined;
            listIndex?: number | null | undefined;
        };
        status: {
            status?: StatusCode | undefined;
            clusterStatus?: StatusCode | undefined;
        };
    }[]>;
    interactionModelRevision: import("@project-chip/matter.js").FieldType<number>;
}>;
