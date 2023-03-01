import { Attribute, OptionalWritableAttribute, Cluster } from "./Cluster";
import { BitFlag } from "@project-chip/matter.js";
export declare const OccupancyBitmap: import("@project-chip/matter.js").TlvWrapper<import("@project-chip/matter.js").TypeFromBitSchema<{
    occupied: BitFlag;
}>, number>;
export declare const enum OccupancySensorType {
    PIR = 0,
    Ultrasonic = 1,
    PIRAndUltrasonic = 2,
    PhysicalContact = 3
}
export declare const OccupancySensorTypeBitmap: import("@project-chip/matter.js").TlvWrapper<import("@project-chip/matter.js").TypeFromBitSchema<{
    PIR: BitFlag;
    ultrasonic: BitFlag;
    physicalContact: BitFlag;
}>, number>;
export declare const OccupancySensingCluster: Cluster<import("@project-chip/matter.js").BitSchema, {
    occupancy: Attribute<import("@project-chip/matter.js").TypeFromBitSchema<{
        occupied: BitFlag;
    }>>;
    occupancySensorType: Attribute<OccupancySensorType>;
    occupancySensorTypeBitmap: Attribute<import("@project-chip/matter.js").TypeFromBitSchema<{
        PIR: BitFlag;
        ultrasonic: BitFlag;
        physicalContact: BitFlag;
    }>>;
    pirOccupiedToUnoccupiedDelay: OptionalWritableAttribute<number>;
    pirUnoccupiedToOccupiedDelay: OptionalWritableAttribute<number>;
    pirUnoccupiedToOccupiedThreshold: OptionalWritableAttribute<number>;
    ultrasonicOccupiedToUnoccupiedDelay: OptionalWritableAttribute<number>;
    ultrasonicUnoccupiedToOccupiedDelay: OptionalWritableAttribute<number>;
    ultrasonicUnoccupiedToOccupiedThreshold: OptionalWritableAttribute<number>;
    physicalContactOccupiedToUnoccupiedDelay: OptionalWritableAttribute<number | null>;
    physicalContactUnoccupiedToOccupiedDelay: OptionalWritableAttribute<number | null>;
    physicalContactUnoccupiedToOccupiedThreshold: OptionalWritableAttribute<number>;
    clusterRevision: Attribute<number>;
    featureMap: Attribute<import("@project-chip/matter.js").TypeFromBitSchema<import("@project-chip/matter.js").BitSchema>>;
    attributeList: Attribute<import("../common/AttributeId").AttributeId[]>;
    eventList: Attribute<import("../common/EventId").EventId[]>;
    acceptedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
    generatedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
}, import("./Cluster").Commands, import("./Cluster").Events>;
