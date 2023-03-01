"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageCodec = void 0;
const NodeId_1 = require("../matter/common/NodeId");
const matter_js_1 = require("@project-chip/matter.js");
const HEADER_VERSION = 0x00;
const COMMON_VENDOR_ID = 0x0000;
class MessageCodec {
    static decodePacket(data) {
        const reader = new matter_js_1.DataReader(data, matter_js_1.Endian.Little);
        const header = this.decodePacketHeader(reader);
        return {
            header,
            bytes: reader.getRemainingBytes(),
        };
    }
    static decodePayload({ header, bytes }) {
        const reader = new matter_js_1.DataReader(bytes, matter_js_1.Endian.Little);
        return {
            packetHeader: header,
            payloadHeader: this.decodePayloadHeader(reader),
            payload: reader.getRemainingBytes(),
        };
    }
    static encodePayload({ packetHeader, payloadHeader, payload }) {
        return {
            header: packetHeader,
            bytes: matter_js_1.ByteArray.concat(this.encodePayloadHeader(payloadHeader), payload),
        };
    }
    static encodePacket({ header, bytes }) {
        return matter_js_1.ByteArray.concat(this.encodePacketHeader(header), bytes);
    }
    static decodePacketHeader(reader) {
        const flags = reader.readUInt8();
        const version = (flags & 240) >> 4;
        const hasDestNodeId = (flags & 1) !== 0;
        const hasDestGroupId = (flags & 2) !== 0;
        const hasSourceNodeId = (flags & 4) !== 0;
        if (hasDestNodeId && hasDestGroupId)
            throw new Error("The header cannot contain destination group and node at the same time");
        if (version !== HEADER_VERSION)
            throw new Error(`Unsupported header version ${version}`);
        const sessionId = reader.readUInt16();
        const securityFlags = reader.readUInt8();
        const messageId = reader.readUInt32();
        const sourceNodeId = hasSourceNodeId ? new NodeId_1.NodeId(reader.readUInt64()) : undefined;
        const destNodeId = hasDestNodeId ? new NodeId_1.NodeId(reader.readUInt64()) : undefined;
        const destGroupId = hasDestGroupId ? reader.readUInt16() : undefined;
        const sessionType = securityFlags & 0b00000011;
        if (sessionType !== 1 && sessionType !== 0)
            throw new Error(`Unsupported session type ${sessionType}`);
        return { sessionId, sourceNodeId, messageId, destGroupId, destNodeId, sessionType };
    }
    static decodePayloadHeader(reader) {
        const exchangeFlags = reader.readUInt8();
        const isInitiatorMessage = (exchangeFlags & 1) !== 0;
        const isAckMessage = (exchangeFlags & 2) !== 0;
        const requiresAck = (exchangeFlags & 4) !== 0;
        const hasSecuredExtension = (exchangeFlags & 8) !== 0;
        const hasVendorId = (exchangeFlags & 16) !== 0;
        if (hasSecuredExtension)
            throw new Error("Secured extension is not supported");
        const messageType = reader.readUInt8();
        const exchangeId = reader.readUInt16();
        const vendorId = hasVendorId ? reader.readUInt16() : COMMON_VENDOR_ID;
        const protocolId = vendorId << 16 | reader.readUInt16();
        const ackedMessageId = isAckMessage ? reader.readUInt32() : undefined;
        return { protocolId, exchangeId, messageType, isInitiatorMessage, requiresAck, ackedMessageId };
    }
    static encodePacketHeader({ messageId: messageCounter, sessionId, destGroupId, destNodeId, sourceNodeId, sessionType }) {
        const writer = new matter_js_1.DataWriter(matter_js_1.Endian.Little);
        const flags = (HEADER_VERSION << 4)
            | (destGroupId !== undefined ? 2 : 0)
            | (destNodeId !== undefined ? 1 : 0)
            | (sourceNodeId !== undefined ? 4 : 0);
        const securityFlags = sessionType;
        writer.writeUInt8(flags);
        writer.writeUInt16(sessionId);
        writer.writeUInt8(securityFlags);
        writer.writeUInt32(messageCounter);
        if (sourceNodeId !== undefined)
            writer.writeUInt64(sourceNodeId.id);
        if (destNodeId !== undefined)
            writer.writeUInt64(destNodeId.id);
        if (destGroupId !== undefined)
            writer.writeUInt32(destGroupId);
        return writer.toByteArray();
    }
    static messageToString({ packetHeader: { messageId, sessionId }, payloadHeader: { exchangeId, messageType, protocolId, ackedMessageId, requiresAck }, payload }) {
        return `id:${sessionId}/${exchangeId}/${messageId} t:${protocolId}/${messageType}${ackedMessageId !== undefined ? ` acked:${ackedMessageId}` : ''} reqAck:${requiresAck} payload: ${payload.toHex()}`;
    }
    static encodePayloadHeader({ exchangeId, isInitiatorMessage, messageType, protocolId, requiresAck, ackedMessageId: ackedMessageCounter }) {
        const writer = new matter_js_1.DataWriter(matter_js_1.Endian.Little);
        const vendorId = (protocolId & 0xFFFF0000) >> 16;
        const flags = (isInitiatorMessage ? 1 : 0)
            | (ackedMessageCounter !== undefined ? 2 : 0)
            | (requiresAck ? 4 : 0)
            | (vendorId !== COMMON_VENDOR_ID ? 16 : 0);
        writer.writeUInt8(flags);
        writer.writeUInt8(messageType);
        writer.writeUInt16(exchangeId);
        (vendorId !== COMMON_VENDOR_ID) ? writer.writeUInt32(protocolId) : writer.writeUInt16(protocolId);
        if (ackedMessageCounter !== undefined)
            writer.writeUInt32(ackedMessageCounter);
        return writer.toByteArray();
    }
}
exports.MessageCodec = MessageCodec;
