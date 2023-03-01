import { BitFlag } from "@project-chip/matter.js";
import { Cluster, Command, Attribute } from "./Cluster";
export declare const enum StatusCode {
    Busy = 2,
    PAKEParameterError = 3,
    WindowNotOpen = 4
}
export declare const enum CommissioningWindowStatus {
    WindowNotOpen = 0,
    EnhancedWindowOpen = 1,
    BasicWindowOpen = 2
}
export declare const AdminCommissioningCluster: Cluster<{
    basic: BitFlag;
}, {
    windowStatus: Attribute<CommissioningWindowStatus>;
    adminFabricIndex: Attribute<import("../common/FabricIndex").FabricIndex | null>;
    adminVendorId: Attribute<import("../common/VendorId").VendorId | null>;
    clusterRevision: Attribute<number>;
    featureMap: Attribute<import("@project-chip/matter.js").TypeFromBitSchema<{
        basic: BitFlag;
    }>>;
    attributeList: Attribute<import("../common/AttributeId").AttributeId[]>;
    eventList: Attribute<import("../common/EventId").EventId[]>;
    acceptedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
    generatedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
}, {
    openCommissioningWindow: Command<{
        iterations: number;
        salt: Uint8Array;
        discriminator: number;
        commissioningTimeout: number;
        pakePasscodeVerifier: Uint8Array;
    }, void>;
    openBasicCommissioningWindow: Command<{
        commissioningTimeout: number;
    }, void>;
    revokeCommissioning: Command<{}, void>;
}, import("./Cluster").Events>;
