import { MessageExchange } from "../common/MessageExchange";
import { MatterController } from "../MatterController";
import { MatterDevice } from "../MatterDevice";
import { StatusCode, TlvDataReport, TlvInvokeRequest, TlvInvokeResponse, TlvReadRequest, TlvSubscribeRequest, TlvSubscribeResponse, TlvTimedRequest, TlvWriteRequest, TlvWriteResponse } from "./InteractionMessages";
import { ByteArray, TypeFromSchema } from "@project-chip/matter.js";
import { Message } from "../../codec/MessageCodec";
import { MatterError } from "../../error/MatterError";
export declare const enum MessageType {
    StatusResponse = 1,
    ReadRequest = 2,
    SubscribeRequest = 3,
    SubscribeResponse = 4,
    ReportData = 5,
    WriteRequest = 6,
    WriteResponse = 7,
    InvokeCommandRequest = 8,
    InvokeCommandResponse = 9,
    TimedRequest = 10
}
export declare type ReadRequest = TypeFromSchema<typeof TlvReadRequest>;
export declare type DataReport = TypeFromSchema<typeof TlvDataReport>;
export declare type SubscribeRequest = TypeFromSchema<typeof TlvSubscribeRequest>;
export declare type SubscribeResponse = TypeFromSchema<typeof TlvSubscribeResponse>;
export declare type InvokeRequest = TypeFromSchema<typeof TlvInvokeRequest>;
export declare type InvokeResponse = TypeFromSchema<typeof TlvInvokeResponse>;
export declare type TimedRequest = TypeFromSchema<typeof TlvTimedRequest>;
export declare type WriteRequest = TypeFromSchema<typeof TlvWriteRequest>;
export declare type WriteResponse = TypeFromSchema<typeof TlvWriteResponse>;
export declare class StatusResponseError extends MatterError {
    readonly message: string;
    readonly code: StatusCode;
    constructor(message: string, code: StatusCode);
}
declare class InteractionMessenger<ContextT> {
    private readonly exchangeBase;
    constructor(exchangeBase: MessageExchange<ContextT>);
    sendStatus(status: StatusCode): Promise<void>;
    waitForSuccess(): Promise<void>;
    nextMessage(expectedMessageType?: number): Promise<Message>;
    close(): void;
    protected throwIfError(messageType: number, payload: ByteArray): void;
}
export declare class InteractionServerMessenger extends InteractionMessenger<MatterDevice> {
    private readonly exchange;
    constructor(exchange: MessageExchange<MatterDevice>);
    handleRequest(handleReadRequest: (request: ReadRequest) => DataReport, handleWriteRequest: (request: WriteRequest) => WriteResponse, handleSubscribeRequest: (request: SubscribeRequest, messenger: InteractionServerMessenger) => Promise<void>, handleInvokeRequest: (request: InvokeRequest, message: Message) => Promise<InvokeResponse>, handleTimedRequest: (request: TimedRequest) => Promise<void>): Promise<void>;
    sendDataReport(dataReport: DataReport): Promise<void>;
    send(messageType: number, payload: ByteArray): Promise<void>;
}
export declare class InteractionClientMessenger extends InteractionMessenger<MatterController> {
    private readonly exchange;
    constructor(exchange: MessageExchange<MatterController>);
    sendReadRequest(readRequest: ReadRequest): Promise<{
        interactionModelRevision: number;
        values?: {
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
        }[] | undefined;
        subscriptionId?: number | undefined;
        eventReports?: {
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
        }[] | undefined;
        moreChunkedMessages?: boolean | undefined;
        suppressResponse?: boolean | undefined;
    }>;
    sendSubscribeRequest(subscribeRequest: SubscribeRequest): Promise<{
        subscribeResponse: {
            interactionModelRevision: number;
            subscriptionId: number;
            maxInterval: number;
        };
        report: {
            interactionModelRevision: number;
            values?: {
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
            }[] | undefined;
            subscriptionId?: number | undefined;
            eventReports?: {
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
            }[] | undefined;
            moreChunkedMessages?: boolean | undefined;
            suppressResponse?: boolean | undefined;
        };
    }>;
    sendInvokeCommand(invokeRequest: InvokeRequest): Promise<{
        interactionModelRevision: number;
        suppressResponse: boolean;
        responses: {
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
        }[];
    }>;
    readDataReport(): Promise<DataReport>;
    private request;
}
export {};
