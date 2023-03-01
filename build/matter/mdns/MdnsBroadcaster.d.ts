import { Broadcaster } from "../common/Broadcaster";
import { MdnsServer } from "../../net/MdnsServer";
import { VendorId } from "../common/VendorId";
import { NodeId } from "../common/NodeId";
import { ByteArray } from "@project-chip/matter.js";
export declare class MdnsBroadcaster implements Broadcaster {
    private readonly mdnsServer;
    static create(multicastInterface?: string): Promise<MdnsBroadcaster>;
    private readonly network;
    constructor(mdnsServer: MdnsServer);
    setCommissionMode(mode: number, deviceName: string, deviceType: number, vendorId: VendorId, productId: number, discriminator: number): void;
    setFabric(operationalId: ByteArray, nodeId: NodeId): void;
    announce(): void;
    close(): void;
}
