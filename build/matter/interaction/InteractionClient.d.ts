import { MessageExchange } from "../common/MessageExchange";
import { MatterController } from "../MatterController";
import { Attribute, AttributeJsType, Attributes, Cluster, Command, Commands, RequestType, ResponseType } from "../cluster/Cluster";
import { DataReport } from "./InteractionMessenger";
import { ClusterClient } from "../cluster/client/ClusterClient";
import { ExchangeManager, MessageChannel } from "../common/ExchangeManager";
import { ProtocolHandler } from "../common/ProtocolHandler";
import { TlvSchema } from "@project-chip/matter.js";
export declare function ClusterClient<CommandT extends Commands, AttributeT extends Attributes>(interactionClient: InteractionClient, endpointId: number, clusterDef: Cluster<any, AttributeT, CommandT, any>): ClusterClient<CommandT, AttributeT>;
export declare class SubscriptionClient implements ProtocolHandler<MatterController> {
    private readonly subscriptionListeners;
    constructor(subscriptionListeners: Map<number, (dataReport: DataReport) => void>);
    getId(): number;
    onNewExchange(exchange: MessageExchange<MatterController>): Promise<void>;
}
export declare class InteractionClient {
    private readonly exchangeManager;
    private readonly channel;
    private readonly subscriptionListeners;
    constructor(exchangeManager: ExchangeManager<MatterController>, channel: MessageChannel<MatterController>);
    getAllAttributes(): Promise<{}>;
    get<A extends Attribute<any>>(endpointId: number, clusterId: number, { id, schema, optional, default: conformanceValue }: A): Promise<AttributeJsType<A>>;
    set<T>(endpointId: number, clusterId: number, { id, schema, default: conformanceValue }: Attribute<T>, value: T): Promise<void>;
    subscribe<A extends Attribute<any>>(endpointId: number, clusterId: number, { id, schema, default: conformanceValue }: A, listener: (value: AttributeJsType<A>, version: number) => void, minIntervalFloorSeconds: number, maxIntervalCeilingSeconds: number): Promise<void>;
    invoke<C extends Command<any, any>>(endpointId: number, clusterId: number, request: RequestType<C>, id: number, requestSchema: TlvSchema<RequestType<C>>, responseId: number, responseSchema: TlvSchema<ResponseType<C>>, optional: boolean): Promise<ResponseType<C>>;
    private withMessenger;
}
