import { Attribute, OptionalAttribute, Cluster } from "./Cluster";
export declare const RelativeHumidityCluster: Cluster<import("@project-chip/matter.js").BitSchema, {
    measuredValue: Attribute<number | null>;
    minMeasuredValue: Attribute<number | null>;
    maxMeasuredValue: Attribute<number | null>;
    tolerance: OptionalAttribute<number>;
    clusterRevision: Attribute<number>;
    featureMap: Attribute<import("@project-chip/matter.js").TypeFromBitSchema<import("@project-chip/matter.js").BitSchema>>;
    attributeList: Attribute<import("../common/AttributeId").AttributeId[]>;
    eventList: Attribute<import("../common/EventId").EventId[]>;
    acceptedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
    generatedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
}, import("./Cluster").Commands, import("./Cluster").Events>;
export declare const LeafWetnessMeasurementCluster: Cluster<import("@project-chip/matter.js").BitSchema, {
    measuredValue: Attribute<number | null>;
    minMeasuredValue: Attribute<number | null>;
    maxMeasuredValue: Attribute<number | null>;
    tolerance: OptionalAttribute<number>;
    clusterRevision: Attribute<number>;
    featureMap: Attribute<import("@project-chip/matter.js").TypeFromBitSchema<import("@project-chip/matter.js").BitSchema>>;
    attributeList: Attribute<import("../common/AttributeId").AttributeId[]>;
    eventList: Attribute<import("../common/EventId").EventId[]>;
    acceptedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
    generatedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
}, import("./Cluster").Commands, import("./Cluster").Events>;
export declare const SoilMoistureMeasurementCluster: Cluster<import("@project-chip/matter.js").BitSchema, {
    measuredValue: Attribute<number | null>;
    minMeasuredValue: Attribute<number | null>;
    maxMeasuredValue: Attribute<number | null>;
    tolerance: OptionalAttribute<number>;
    clusterRevision: Attribute<number>;
    featureMap: Attribute<import("@project-chip/matter.js").TypeFromBitSchema<import("@project-chip/matter.js").BitSchema>>;
    attributeList: Attribute<import("../common/AttributeId").AttributeId[]>;
    eventList: Attribute<import("../common/EventId").EventId[]>;
    acceptedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
    generatedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
}, import("./Cluster").Commands, import("./Cluster").Events>;
