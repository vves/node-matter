import { TlvWrapper } from "@project-chip/matter.js";
export declare class FabricIndex {
    readonly index: number;
    static NO_FABRIC: FabricIndex;
    constructor(index: number);
}
export declare const TlvFabricIndex: TlvWrapper<FabricIndex, number>;
