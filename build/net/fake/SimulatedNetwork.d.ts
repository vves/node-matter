import { NetListener } from "../NetInterface";
import { ByteArray } from "@project-chip/matter.js";
export declare type Listener = (netInterface: string, peerAddress: string, peerPort: number, data: ByteArray) => void;
export declare const FAKE_INTERFACE_NAME = "fakeInterface";
export declare class SimulatedNetwork {
    static get: () => SimulatedNetwork;
    private readonly listenersMap;
    onUdpData(address: string | undefined, port: number, listener: Listener): NetListener;
    private offUdpData;
    sendUdp(localAddress: string, localPort: number, remoteAddress: string, remotePort: number, data: ByteArray): Promise<void>;
}
