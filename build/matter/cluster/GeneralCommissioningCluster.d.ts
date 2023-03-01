import { Attribute, Cluster, Command, WritableAttribute } from "./Cluster";
import { TypeFromSchema } from "@project-chip/matter.js";
export declare const enum RegulatoryLocationType {
    Indoor = 0,
    Outdoor = 1,
    IndoorOutdoor = 2
}
export declare const enum CommissioningError {
    Ok = 0,
    ValueOutsideRange = 1,
    InvalidAuthentication = 2,
    NoFailSafe = 3,
    BusyWithOtherAdmin = 4
}
declare const TlvCommissioningSuccessFailureResponse: import("@project-chip/matter.js").ObjectSchema<{
    errorCode: import("@project-chip/matter.js").FieldType<CommissioningError>;
    debugText: import("@project-chip/matter.js").FieldType<string>;
}>;
export declare type CommissioningSuccessFailureResponse = TypeFromSchema<typeof TlvCommissioningSuccessFailureResponse>;
export declare const GeneralCommissioningCluster: Cluster<import("@project-chip/matter.js").BitSchema, {
    breadcrumb: WritableAttribute<number | bigint>;
    commissioningInfo: Attribute<{
        failSafeExpiryLengthSeconds: number;
        maxCumulativeFailsafeSeconds: number;
    }>;
    regulatoryConfig: Attribute<RegulatoryLocationType>;
    locationCapability: Attribute<RegulatoryLocationType>;
    supportsConcurrentConnections: Attribute<boolean>;
    clusterRevision: Attribute<number>;
    featureMap: Attribute<import("@project-chip/matter.js").TypeFromBitSchema<import("@project-chip/matter.js").BitSchema>>;
    attributeList: Attribute<import("../common/AttributeId").AttributeId[]>;
    eventList: Attribute<import("../common/EventId").EventId[]>;
    acceptedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
    generatedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
}, {
    armFailSafe: Command<{
        expiryLengthSeconds: number;
        breadcrumbStep: number | bigint;
    }, {
        errorCode: CommissioningError;
        debugText: string;
    }>;
    setRegulatoryConfig: Command<{
        breadcrumbStep: number | bigint;
        newRegulatoryConfig: RegulatoryLocationType;
        countryCode: string;
    }, {
        errorCode: CommissioningError;
        debugText: string;
    }>;
    commissioningComplete: Command<{}, {
        errorCode: CommissioningError;
        debugText: string;
    }>;
}, import("./Cluster").Events>;
export {};
