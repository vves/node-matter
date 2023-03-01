import { UdpMulticastServer } from "../../net/UdpMulticastServer";
import { MatterServer, Scanner } from "../common/Scanner";
import { Fabric } from "../fabric/Fabric";
import { NodeId } from "../common/NodeId";
export declare class MdnsScanner implements Scanner {
    private readonly multicastServer;
    static create(netInterface?: string): Promise<MdnsScanner>;
    private readonly matterDeviceRecords;
    private readonly recordWaiters;
    private readonly periodicTimer;
    constructor(multicastServer: UdpMulticastServer);
    findDevice({ operationalId }: Fabric, nodeId: NodeId): Promise<MatterServer | undefined>;
    close(): void;
    private handleDnsMessage;
    private expire;
}
