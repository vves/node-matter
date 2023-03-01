import { UdpChannel } from './UdpChannel';
import { Channel } from "./Channel";
import { NetInterface, NetListener } from "./NetInterface";
import { ByteArray } from "@project-chip/matter.js";
export declare class UdpInterface implements NetInterface {
    private readonly server;
    static create(port: number, type: "udp4" | "udp6", address?: string): Promise<UdpInterface>;
    constructor(server: UdpChannel);
    openChannel(address: string, port: number): Promise<UdpConnection>;
    onData(listener: (channel: Channel<ByteArray>, messageBytes: ByteArray) => void): NetListener;
}
declare class UdpConnection implements Channel<ByteArray> {
    private readonly server;
    private readonly peerAddress;
    private readonly peerPort;
    constructor(server: UdpChannel, peerAddress: string, peerPort: number);
    send(data: ByteArray): Promise<void>;
    getName(): string;
}
export {};
