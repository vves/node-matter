import { TlvWrapper } from "@project-chip/matter.js";
export declare class GroupId {
    readonly id: number;
    constructor(id: number);
}
export declare const TlvGroupId: TlvWrapper<GroupId, number>;
