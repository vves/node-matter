import { TlvWrapper } from "@project-chip/matter.js";
export declare class FabricId {
    readonly id: bigint;
    constructor(id: bigint);
}
export declare const TlvFabricId: TlvWrapper<FabricId, number | bigint>;
