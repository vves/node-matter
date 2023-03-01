import { UdpChannelOptions, UdpChannel } from "../UdpChannel";
import { Network } from "../Network";
export declare class NetworkFake extends Network {
    private readonly mac;
    private readonly ips;
    constructor(mac: string, ips: string[]);
    getNetInterfaces(): string[];
    getIpMac(_netInterface: string): {
        mac: string;
        ips: string[];
    };
    createUdpChannel(options: UdpChannelOptions): Promise<UdpChannel>;
}
