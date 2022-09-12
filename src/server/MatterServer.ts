/**
 * @license
 * Copyright 2022 Marco Fucci di Napoli (mfucci@gmail.com)
 * SPDX-License-Identifier: Apache-2.0
 */

import { Crypto } from "../crypto/Crypto";
import { Message, MessageCodec, SessionType } from "../codec/MessageCodec";
import { SessionManager } from "../session/SessionManager";
import { MessageExchange } from "./MessageExchange";
import { FabricManager } from "../fabric/FabricManager";
import { MatterMdnsServer } from "../mdns/MatterMdnsServer";
import { Session } from "../session/Session";

export const enum Protocol {
    SECURE_CHANNEL = 0x0000,
    INTERACTION_MODEL = 0x0001,
}

export interface ExchangeSocket<T> {
    send(data: T): Promise<void>;
    getName():string;
}

export interface Channel {
    bind(listener: (socket: ExchangeSocket<Buffer>, messageBytes: Buffer) => void): void;
}

export interface ProtocolHandler {
    onNewExchange(exchange: MessageExchange, message: Message): void;
}

export class MatterServer {
    static async create(deviceName: string, deviceType: number, vendorId: number, productId: number, discriminator: number) {
        const mdnsServer = await MatterMdnsServer.create();
        mdnsServer.addRecordsForCommission(deviceName, deviceType, vendorId, productId, discriminator);
        return new MatterServer(mdnsServer);
    }

    constructor(
        private readonly mdnsServer: MatterMdnsServer,
    ) {}

    private readonly channels = new Array<Channel>();
    private readonly protocolHandlers = new Map<Protocol, ProtocolHandler>();
    private readonly exchangeCounter = new ExchangeCounter();
    private readonly messageCounter = new MessageCounter();
    private readonly exchanges = new Map<number, MessageExchange>();
    private readonly sessionManager = new SessionManager(this);
    private readonly fabricManager = new FabricManager();

    addChannel(channel: Channel) {
        this.channels.push(channel);
        return this;
    }

    addProtocolHandler(protocol: Protocol, protocolHandler: ProtocolHandler) {
        this.protocolHandlers.set(protocol, protocolHandler);
        return this;
    }

    start() {
        this.channels.forEach(channel => channel.bind((socket, data) => this.onMessage(socket, data)));
        this.mdnsServer.announce();
    }

    getMdnsServer() {
        return this.mdnsServer;
    }

    getSessionManager() {
        return this.sessionManager;
    }

    getFabricManager() {
        return this.fabricManager;
    }

    initiateExchange(session: Session, channel: ExchangeSocket<Buffer>, protocolId: number) {
        const exchangeId = this.exchangeCounter.getIncrementedCounter();
        const exchange = MessageExchange.initiate(session, channel, exchangeId, protocolId, this.messageCounter, () => this.exchanges.delete(exchangeId & 0x10000));
        // Ensure exchangeIds are not colliding in the Map by adding 1 in front of exchanges initiated by this device.
        this.exchanges.set(exchangeId & 0x10000, exchange);
        return exchange;
    }

    private onMessage(socket: ExchangeSocket<Buffer>, messageBytes: Buffer) {
        var packet = MessageCodec.decodePacket(messageBytes);
        if (packet.header.sessionType === SessionType.Group) throw new Error("Group messages are not supported");

        const session = this.sessionManager.getSession(packet.header.sessionId);
        if (session === undefined) throw new Error(`Cannot find a session for ID ${packet.header.sessionId}`);

        const message = session.decode(packet);
        const exchangeId = message.payloadHeader.isInitiatorMessage ? message.payloadHeader.exchangeId : message.payloadHeader.exchangeId & 0x10000;
        if (this.exchanges.has(exchangeId)) {
            const exchange = this.exchanges.get(exchangeId);
            exchange?.onMessageReceived(message);
        } else {
            const exchange = MessageExchange.fromInitialMessage(session, socket, this.messageCounter, message, () => this.exchanges.delete(exchangeId));
            this.exchanges.set(exchangeId, exchange);
            const protocolHandler = this.protocolHandlers.get(message.payloadHeader.protocolId);
            if (protocolHandler === undefined) throw new Error(`Unsupported protocol ${message.payloadHeader.protocolId}`);
            protocolHandler.onNewExchange(exchange, message);
        }
    }
}

class ExchangeCounter {
    private exchangeCounter = Crypto.getRandomUInt16();

    getIncrementedCounter() {
        this.exchangeCounter++;
        if (this.exchangeCounter > 0xFFFF) {
            this.exchangeCounter = 0;
        }
        return this.exchangeCounter;
    }
}

export class MessageCounter {
    private messageCounter = Crypto.getRandomUInt32();

    getIncrementedCounter() {
        this.messageCounter++;
        if (this.messageCounter > 0xFFFFFFFF) {
            this.messageCounter = 0;
        }
        return this.messageCounter;
    }
}
