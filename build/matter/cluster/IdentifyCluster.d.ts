import { Attribute, WritableAttribute, Cluster, Command, OptionalCommand } from "./Cluster";
import { BitFlag } from "@project-chip/matter.js";
export declare const enum IdentifyType {
    None = 0,
    VisibleLight = 1,
    VisibleLED = 2,
    AudibleBeep = 3,
    Display = 4,
    Actuator = 5
}
export declare const enum EffectIdentifier {
    Blink = 0,
    Breathe = 1,
    Okay = 2,
    ChannelChange = 11,
    FinishEffect = 254,
    StopEffect = 255
}
export declare const enum EffectVariant {
    Default = 0
}
export declare const IdentifyCluster: Cluster<{
    query: BitFlag;
}, {
    identifyTime: WritableAttribute<number>;
    identifyType: Attribute<IdentifyType>;
    clusterRevision: Attribute<number>;
    featureMap: Attribute<import("@project-chip/matter.js").TypeFromBitSchema<{
        query: BitFlag;
    }>>;
    attributeList: Attribute<import("../common/AttributeId").AttributeId[]>;
    eventList: Attribute<import("../common/EventId").EventId[]>;
    acceptedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
    generatedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
}, {
    identify: Command<{
        identifyTime: number;
    }, void>;
    triggerEffect: OptionalCommand<{
        effectIdentifier: EffectIdentifier;
        effectVariant: EffectVariant;
    }, void>;
}, import("./Cluster").Events>;
