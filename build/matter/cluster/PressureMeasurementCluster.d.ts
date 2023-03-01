import { Attribute, OptionalAttribute, Cluster } from "./Cluster";
import { BitFlag } from "@project-chip/matter.js";
export declare const PressureMeasurementCluster: Cluster<{
    extended: BitFlag;
}, {
    measuredValue: Attribute<number | null>;
    minMeasuredValue: Attribute<number | null>;
    maxMeasuredValue: Attribute<number | null>;
    tolerance: OptionalAttribute<number>;
    scaledValue: OptionalAttribute<number | null>;
    minScaledValue: OptionalAttribute<number | null>;
    maxScaledValue: OptionalAttribute<number | null>;
    scaledTolerance: OptionalAttribute<number>;
    scale: OptionalAttribute<number>;
    clusterRevision: Attribute<number>;
    featureMap: Attribute<import("@project-chip/matter.js").TypeFromBitSchema<{
        extended: BitFlag;
    }>>;
    attributeList: Attribute<import("../common/AttributeId").AttributeId[]>;
    eventList: Attribute<import("../common/EventId").EventId[]>;
    acceptedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
    generatedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
}, import("./Cluster").Commands, import("./Cluster").Events>;
