import { TlvWrapper } from "@project-chip/matter.js";
export declare class NodeId {
    readonly id: bigint;
    constructor(id: bigint);
    toString(): string;
    static getRandomOperationalNodeId(): NodeId;
    static getGroupNodeId(groupId: number): NodeId;
}
export declare const TlvNodeId: TlvWrapper<NodeId, number | bigint>;
