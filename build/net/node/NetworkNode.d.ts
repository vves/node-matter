import { UdpChannelOptions, UdpChannel } from "../UdpChannel";
import { Network } from "../Network";
export declare class NetworkNode extends Network {
    static getMulticastInterface(netInterface: string, ipv4: boolean): string;
    static getNetInterfaceForIp(ip: string): string | undefined;
    private static readonly netInterfaces;
    private static getNetInterfaceForIpInternal;
    getNetInterfaces(): string[];
    getIpMac(netInterface: string): {
        mac: string;
        ips: string[];
    } | undefined;
    createUdpChannel(options: UdpChannelOptions): Promise<UdpChannel>;
}
