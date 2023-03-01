import { Attribute, Cluster, Command } from "./Cluster";
import { BitFlag } from "@project-chip/matter.js";
export declare const enum StartUpOnOff {
    Off = 0,
    On = 1,
    Toggle = 2
}
export declare const enum EffectIdentifier {
    DelayedAllOff = 0,
    DyingLight = 1
}
export declare const enum DelayedAllOffEffectVariant {
    Fade = 0,
    NoFade = 1,
    DimDownThenFade = 2
}
export declare const enum DyingLightEffectVariant {
    DimUpThenFade = 0
}
export declare const OnOffCluster: Cluster<{
    lightingLevelControl: BitFlag;
}, {
    onOff: Attribute<boolean>;
    clusterRevision: Attribute<number>;
    featureMap: Attribute<import("@project-chip/matter.js").TypeFromBitSchema<{
        lightingLevelControl: BitFlag;
    }>>;
    attributeList: Attribute<import("../common/AttributeId").AttributeId[]>;
    eventList: Attribute<import("../common/EventId").EventId[]>;
    acceptedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
    generatedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
}, {
    off: Command<{}, void>;
    on: Command<{}, void>;
    toggle: Command<{}, void>;
}, import("./Cluster").Events>;
