/// <reference types="node" />
import dgram from "dgram";
import { UdpChannel, UdpChannelOptions } from "../UdpChannel";
import { ByteArray } from "@project-chip/matter.js";
export declare class UdpChannelNode implements UdpChannel {
    private readonly socket;
    private readonly netInterface?;
    static create({ listeningPort, type, listeningAddress, netInterface }: UdpChannelOptions): Promise<UdpChannelNode>;
    constructor(socket: dgram.Socket, netInterface?: string | undefined);
    onData(listener: (netInterface: string, peerAddress: string, peerPort: number, data: ByteArray) => void): {
        close: () => void;
    };
    send(address: string, port: number, data: ByteArray): Promise<void>;
    close(): void;
}
