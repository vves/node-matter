import { MatterDevice } from "../MatterDevice";
import { ProtocolHandler } from "../common/ProtocolHandler";
import { MessageExchange } from "../common/MessageExchange";
import { DataReport, InteractionServerMessenger, InvokeRequest, InvokeResponse, ReadRequest, SubscribeRequest, TimedRequest, WriteRequest, WriteResponse } from "./InteractionMessenger";
import { CommandServer } from "../cluster/server/CommandServer";
import { AttributeServer } from "../cluster/server/AttributeServer";
import { Attributes, Cluster, Commands, Events } from "../cluster/Cluster";
import { AttributeInitialValues, AttributeServers, ClusterServerHandlers } from "../cluster/server/ClusterServer";
import { BitSchema, TypeFromBitSchema } from "@project-chip/matter.js";
import { Message } from "../../codec/MessageCodec";
export declare const INTERACTION_PROTOCOL_ID = 1;
export declare class ClusterServer<F extends BitSchema, A extends Attributes, C extends Commands, E extends Events> {
    readonly id: number;
    readonly name: string;
    readonly attributes: AttributeServers<A>;
    readonly commands: CommandServer<any, any>[];
    constructor(clusterDef: Cluster<F, A, C, E>, features: TypeFromBitSchema<F>, attributesInitialValues: AttributeInitialValues<A>, handlers: ClusterServerHandlers<Cluster<F, A, C, E>>);
}
export interface CommandPath {
    endpointId: number;
    clusterId: number;
    commandId: number;
}
export interface AttributePath {
    endpointId: number;
    clusterId: number;
    attributeId: number;
}
export interface AttributeWithPath {
    path: AttributePath;
    attribute: AttributeServer<any>;
}
export declare function commandPathToId({ endpointId, clusterId, commandId }: CommandPath): string;
export declare function attributePathToId({ endpointId, clusterId, attributeId }: Partial<AttributePath>): string;
export declare class InteractionServer implements ProtocolHandler<MatterDevice> {
    private readonly endpoints;
    private readonly attributes;
    private readonly attributePaths;
    private readonly commands;
    private readonly commandPaths;
    private nextSubscriptionId;
    constructor();
    getId(): number;
    addEndpoint(endpointId: number, device: {
        name: string;
        code: number;
    }, clusters: ClusterServer<any, any, any, any>[]): this;
    onNewExchange(exchange: MessageExchange<MatterDevice>): Promise<void>;
    handleReadRequest(exchange: MessageExchange<MatterDevice>, { attributes: attributePaths, isFabricFiltered }: ReadRequest): DataReport;
    handleWriteRequest(exchange: MessageExchange<MatterDevice>, { suppressResponse, writeRequests }: WriteRequest): WriteResponse;
    handleSubscribeRequest(exchange: MessageExchange<MatterDevice>, { minIntervalFloorSeconds, maxIntervalCeilingSeconds, attributeRequests, eventRequests, keepSubscriptions }: SubscribeRequest, messenger: InteractionServerMessenger): Promise<void>;
    handleInvokeRequest(exchange: MessageExchange<MatterDevice>, { invokes }: InvokeRequest, message: Message): Promise<InvokeResponse>;
    handleTimedRequest(exchange: MessageExchange<MatterDevice>, { timeout }: TimedRequest): Promise<void>;
    private resolveAttributeName;
    private getAttributes;
}
