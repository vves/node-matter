import { Message } from "../../codec/MessageCodec";
import { NetInterface } from "../../net/NetInterface";
import { Session } from "../session/Session";
import { SessionManager } from "../session/SessionManager";
import { Channel } from "../../net/Channel";
import { MessageExchange } from "./MessageExchange";
import { ProtocolHandler } from "./ProtocolHandler";
import { ChannelManager } from "./ChannelManager";
import { Fabric } from "../fabric/Fabric";
import { NodeId } from "./NodeId";
import { ByteArray } from "@project-chip/matter.js";
export declare class MessageChannel<ContextT> implements Channel<Message> {
    readonly channel: Channel<ByteArray>;
    readonly session: Session<ContextT>;
    constructor(channel: Channel<ByteArray>, session: Session<ContextT>);
    send(message: Message): Promise<void>;
    getName(): string;
}
export declare class ExchangeManager<ContextT> {
    private readonly sessionManager;
    private readonly channelManager;
    private readonly exchangeCounter;
    private readonly messageCounter;
    private readonly exchanges;
    private readonly protocols;
    private readonly netListeners;
    constructor(sessionManager: SessionManager<ContextT>, channelManager: ChannelManager);
    addNetInterface(netInterface: NetInterface): void;
    addProtocolHandler(protocol: ProtocolHandler<ContextT>): void;
    initiateExchange(fabric: Fabric, nodeId: NodeId, protocolId: number): MessageExchange<ContextT>;
    initiateExchangeWithChannel(channel: MessageChannel<ContextT>, protocolId: number): MessageExchange<ContextT>;
    close(): void;
    private onMessage;
}
export declare class ExchangeCounter {
    private exchangeCounter;
    getIncrementedCounter(): number;
}
export declare class MessageCounter {
    private messageCounter;
    getIncrementedCounter(): number;
}
