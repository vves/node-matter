import { NodeId } from "../matter/common/NodeId";
import { ByteArray } from "@project-chip/matter.js";
export interface PacketHeader {
    sessionId: number;
    sessionType: SessionType;
    messageId: number;
    sourceNodeId?: NodeId;
    destNodeId?: NodeId;
    destGroupId?: number;
}
export interface PayloadHeader {
    exchangeId: number;
    protocolId: number;
    messageType: number;
    isInitiatorMessage: boolean;
    requiresAck: boolean;
    ackedMessageId?: number;
}
export interface Packet {
    header: PacketHeader;
    bytes: ByteArray;
}
export interface Message {
    packetHeader: PacketHeader;
    payloadHeader: PayloadHeader;
    payload: ByteArray;
}
export declare const enum SessionType {
    Group = 1,
    Unicast = 0
}
export declare class MessageCodec {
    static decodePacket(data: ByteArray): Packet;
    static decodePayload({ header, bytes }: Packet): Message;
    static encodePayload({ packetHeader, payloadHeader, payload }: Message): Packet;
    static encodePacket({ header, bytes }: Packet): ByteArray;
    private static decodePacketHeader;
    private static decodePayloadHeader;
    static encodePacketHeader({ messageId: messageCounter, sessionId, destGroupId, destNodeId, sourceNodeId, sessionType }: PacketHeader): Uint8Array;
    static messageToString({ packetHeader: { messageId, sessionId }, payloadHeader: { exchangeId, messageType, protocolId, ackedMessageId, requiresAck }, payload }: Message): string;
    private static encodePayloadHeader;
}
