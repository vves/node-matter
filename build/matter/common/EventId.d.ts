import { TlvWrapper } from "@project-chip/matter.js";
export declare class EventId {
    readonly id: number;
    constructor(id: number);
}
export declare const TlvEventId: TlvWrapper<EventId, number>;
