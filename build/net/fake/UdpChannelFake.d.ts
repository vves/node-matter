import { UdpChannel, UdpChannelOptions } from "../UdpChannel";
import { NetListener } from "../NetInterface";
import { ByteArray } from "@project-chip/matter.js";
import { NetworkFake } from "./NetworkFake";
export declare class UdpChannelFake implements UdpChannel {
    private readonly localAddress;
    private readonly listeningAddress;
    private readonly listeningPort;
    static create(network: NetworkFake, { listeningAddress, listeningPort, netInterface, type }: UdpChannelOptions): Promise<UdpChannelFake>;
    private readonly netListeners;
    private readonly simulatedNetwork;
    constructor(localAddress: string, listeningAddress: string | undefined, listeningPort: number);
    onData(listener: (netInterface: string, peerAddress: string, peerPort: number, data: ByteArray) => void): NetListener;
    send(address: string, port: number, data: ByteArray): Promise<void>;
    close(): void;
}
