import { TlvWrapper } from "@project-chip/matter.js";
export declare class ClusterId {
    readonly id: number;
    constructor(id: number);
}
export declare const TlvClusterId: TlvWrapper<ClusterId, number>;
