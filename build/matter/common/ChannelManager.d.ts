import { Channel } from "../../net/Channel";
import { Fabric } from "../fabric/Fabric";
import { Session } from "../session/Session";
import { MessageChannel } from "./ExchangeManager";
import { NodeId } from "./NodeId";
import { ByteArray } from "@project-chip/matter.js";
export declare class ChannelManager {
    private readonly channels;
    setChannel(fabric: Fabric, nodeId: NodeId, channel: MessageChannel<any>): void;
    getChannel(fabric: Fabric, nodeId: NodeId): MessageChannel<any>;
    getOrCreateChannel(byteArrayChannel: Channel<ByteArray>, session: Session<any>): MessageChannel<any>;
}
