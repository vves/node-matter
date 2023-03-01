import { TlvWrapper } from "@project-chip/matter.js";
export declare class EndpointNumber {
    readonly number: number;
    constructor(number: number);
}
export declare const TlvEndpointNumber: TlvWrapper<EndpointNumber, number>;
