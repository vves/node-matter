import { Record } from "../codec/DnsCodec";
import { UdpMulticastServer } from "./UdpMulticastServer";
export declare const MDNS_BROADCAST_IPV4 = "224.0.0.251";
export declare const MDNS_BROADCAST_IPV6 = "ff02::fb";
export declare const MDNS_BROADCAST_PORT = 5353;
export declare class MdnsServer {
    private readonly multicastServer;
    private readonly netInterface;
    static create(netInterface?: string): Promise<MdnsServer>;
    private readonly network;
    private recordsGenerator;
    private readonly records;
    constructor(multicastServer: UdpMulticastServer, netInterface: string | undefined);
    private handleDnsMessage;
    announce(): Promise<void>;
    setRecordsGenerator(generator: (netInterface: string) => Record<any>[]): void;
    close(): void;
    private getMulticastInterfacesForAnnounce;
    private queryRecords;
}
