import { TlvWrapper } from "@project-chip/matter.js";
export declare class DeviceTypeId {
    readonly id: number;
    constructor(id: number);
}
export declare const TlvDeviceTypeId: TlvWrapper<DeviceTypeId, number>;
