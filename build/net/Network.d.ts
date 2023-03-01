import { UdpChannel, UdpChannelOptions } from "./UdpChannel";
export declare abstract class Network {
    static get: () => Network;
    abstract getNetInterfaces(): string[];
    abstract getIpMac(netInterface: string): {
        mac: string;
        ips: string[];
    } | undefined;
    abstract createUdpChannel(options: UdpChannelOptions): Promise<UdpChannel>;
}
