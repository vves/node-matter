import { TlvWrapper } from "@project-chip/matter.js";
export declare class AttributeId {
    readonly id: number;
    constructor(id: number);
}
export declare const TlvAttributeId: TlvWrapper<AttributeId, number>;
