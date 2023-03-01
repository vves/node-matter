import { TlvWrapper } from "@project-chip/matter.js";
export declare class CommandId {
    readonly id: number;
    constructor(id: number);
}
export declare const TlvCommandId: TlvWrapper<CommandId, number>;
