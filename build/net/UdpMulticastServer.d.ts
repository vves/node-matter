import { ByteArray } from "@project-chip/matter.js";
export interface UdpMulticastServerOptions {
    listeningPort: number;
    broadcastAddressIpv4: string;
    broadcastAddressIpv6: string;
    netInterface?: string;
}
export declare class UdpMulticastServer {
    private readonly network;
    private readonly broadcastAddressIpv4;
    private readonly broadcastAddressIpv6;
    private readonly broadcastPort;
    private readonly serverIpv4;
    private readonly serverIpv6;
    static create({ netInterface, broadcastAddressIpv4, broadcastAddressIpv6, listeningPort }: UdpMulticastServerOptions): Promise<UdpMulticastServer>;
    private readonly broadcastChannels;
    private constructor();
    onMessage(listener: (message: ByteArray, peerAddress: string, netInterface: string) => void): void;
    send(message: ByteArray, netInterface?: string): Promise<void>;
    private createBroadcastChannel;
    close(): void;
}
