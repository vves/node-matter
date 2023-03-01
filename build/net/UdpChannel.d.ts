import { NetListener } from "./NetInterface";
import { ByteArray } from "@project-chip/matter.js";
export interface UdpChannelOptions {
    listeningPort: number;
    type: "udp4" | "udp6";
    listeningAddress?: string;
    netInterface?: string;
}
export interface UdpChannel {
    onData(listener: (netInterface: string, peerAddress: string, peerPort: number, data: ByteArray) => void): NetListener;
    send(address: string, port: number, data: ByteArray): Promise<void>;
    close(): void;
}
