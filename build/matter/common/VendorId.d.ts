import { TlvWrapper } from "@project-chip/matter.js";
export declare class VendorId {
    readonly id: number;
    constructor(id: number);
}
export declare const TlvVendorId: TlvWrapper<VendorId, number>;
