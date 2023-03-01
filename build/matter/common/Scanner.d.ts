import { Fabric } from "../fabric/Fabric";
import { NodeId } from "./NodeId";
export declare type MatterServer = {
    ip: string;
    port: number;
};
export interface Scanner {
    findDevice(fabric: Fabric, nodeId: NodeId): Promise<MatterServer | undefined>;
    close(): void;
}
