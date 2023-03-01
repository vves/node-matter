import { BitFlag } from "@project-chip/matter.js";
import { Attribute, Cluster, Command, OptionalAttribute, OptionalCommand, WritableAttribute } from "./Cluster";
export declare enum WindowCoveringType {
    RollerShade = 0,
    RollerShade2Motor = 1,
    RollerShadeExterior = 2,
    RollerShadeExterior2Motor = 3,
    Drapery = 4,
    Awning = 5,
    Shutter = 6,
    TiltOnlyBlind = 7,
    LiftAndTiltBlind = 8,
    ProjectorScreen = 9,
    Unknown = 255
}
export declare enum WindowCoveringEndProductType {
    RollerShade = 0,
    RomanShade = 1,
    BalloonShade = 2,
    WovenWood = 3,
    PleatedShade = 4,
    CellularShade = 5,
    LayeredShade = 6,
    LayeredShade2D = 7,
    SheerShade = 8,
    TiltOnlyInteriorBlind = 9,
    InteriorBlind = 10,
    VerticalBlindStripCurtain = 11,
    InteriorVenetianBlind = 12,
    ExteriorVenetianBlind = 13,
    LateralLeftCurtain = 14,
    LateralRightCurtain = 15,
    CentralCurtain = 16,
    RollerShutter = 17,
    ExteriorVerticalScreen = 18,
    AwningTerrace = 19,
    AwningVerticalScreen = 20,
    TiltOnlyPergola = 21,
    SwingingShutter = 22,
    SlidingShutter = 23,
    Unknown = 255
}
export declare const WindowCoveringConfigStatus: {
    operational: BitFlag;
    reversed: BitFlag;
    liftPositionAware: BitFlag;
    tiltPositionAware: BitFlag;
    liftPositionType: BitFlag;
    tiltPositionType: BitFlag;
};
export declare enum WindowCoveringOperationalStatus {
    Stopped = 0,
    Opening = 1,
    Closing = 2
}
export declare const WindowCoveringMode: {
    reversed: BitFlag;
    calibrateMode: BitFlag;
    maintenanceMode: BitFlag;
    ledFeedback: BitFlag;
};
export declare const WindowCoveringSafetyStatus: {
    remoteLockout: BitFlag;
    tamperDetection: BitFlag;
    failedCommunication: BitFlag;
    positionFailure: BitFlag;
    thermalProtection: BitFlag;
    obstacleDetected: BitFlag;
    powerIssue: BitFlag;
    stopInput: BitFlag;
    motorJammed: BitFlag;
    hardwareFailure: BitFlag;
    manualOperation: BitFlag;
    protection: BitFlag;
};
export declare const WindowCoveringCluster: Cluster<{
    lift: BitFlag;
    tilt: BitFlag;
    positionAwareLift: BitFlag;
    absolutePosition: BitFlag;
    positionAwareTilt: BitFlag;
}, {
    type: Attribute<WindowCoveringType>;
    physicalClosedLimitLift: OptionalAttribute<number>;
    physicalClosedLimitTilt: OptionalAttribute<number>;
    currentPositionLift: OptionalAttribute<number>;
    currentPositionTilt: OptionalAttribute<number>;
    numOfActuationsLift: OptionalAttribute<number>;
    numOfActuationsTilt: OptionalAttribute<number>;
    configStatus: Attribute<import("@project-chip/matter.js").TypeFromBitSchema<{
        operational: BitFlag;
        reversed: BitFlag;
        liftPositionAware: BitFlag;
        tiltPositionAware: BitFlag;
        liftPositionType: BitFlag;
        tiltPositionType: BitFlag;
    }>>;
    currentPositionLiftPercent: Attribute<number>;
    currentPositionTiltPercent: Attribute<number>;
    operationalStatus: Attribute<WindowCoveringOperationalStatus>;
    targetPositionLiftPercent100ths: Attribute<number>;
    targetPositionTiltPercent100ths: Attribute<number>;
    endProductType: WritableAttribute<WindowCoveringEndProductType>;
    currentPositionLiftPercent100ths: Attribute<number>;
    currentPositionTiltPercent100ths: Attribute<number>;
    installedOpenLimitLift: OptionalAttribute<number>;
    installedClosedLimitLift: OptionalAttribute<number>;
    installedOpenLimitTilt: OptionalAttribute<number>;
    installedClosedLimitTilt: OptionalAttribute<number>;
    mode: Attribute<import("@project-chip/matter.js").TypeFromBitSchema<{
        reversed: BitFlag;
        calibrateMode: BitFlag;
        maintenanceMode: BitFlag;
        ledFeedback: BitFlag;
    }>>;
    safetyStatus: OptionalAttribute<import("@project-chip/matter.js").TypeFromBitSchema<{
        remoteLockout: BitFlag;
        tamperDetection: BitFlag;
        failedCommunication: BitFlag;
        positionFailure: BitFlag;
        thermalProtection: BitFlag;
        obstacleDetected: BitFlag;
        powerIssue: BitFlag;
        stopInput: BitFlag;
        motorJammed: BitFlag;
        hardwareFailure: BitFlag;
        manualOperation: BitFlag;
        protection: BitFlag;
    }>>;
    clusterRevision: Attribute<number>;
    featureMap: Attribute<import("@project-chip/matter.js").TypeFromBitSchema<{
        lift: BitFlag;
        tilt: BitFlag;
        positionAwareLift: BitFlag;
        absolutePosition: BitFlag;
        positionAwareTilt: BitFlag;
    }>>;
    attributeList: Attribute<import("../common/AttributeId").AttributeId[]>;
    eventList: Attribute<import("../common/EventId").EventId[]>;
    acceptedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
    generatedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
}, {
    open: Command<{}, {
        status: import("../interaction/InteractionMessages").StatusCode;
        interactionModelRevision: number;
    }>;
    close: Command<{}, {
        status: import("../interaction/InteractionMessages").StatusCode;
        interactionModelRevision: number;
    }>;
    stop: Command<{}, {
        status: import("../interaction/InteractionMessages").StatusCode;
        interactionModelRevision: number;
    }>;
    gotoLiftValue: OptionalCommand<{
        value: number;
    }, {
        status: import("../interaction/InteractionMessages").StatusCode;
        interactionModelRevision: number;
    }>;
    gotoLiftPercent: OptionalCommand<{
        percent?: number | undefined;
        percent100ths?: number | undefined;
    }, {
        status: import("../interaction/InteractionMessages").StatusCode;
        interactionModelRevision: number;
    }>;
    gotoTiltValue: OptionalCommand<{
        value: number;
    }, {
        status: import("../interaction/InteractionMessages").StatusCode;
        interactionModelRevision: number;
    }>;
    gotoTiltPercent: OptionalCommand<{
        percent?: number | undefined;
        percent100ths?: number | undefined;
    }, {
        status: import("../interaction/InteractionMessages").StatusCode;
        interactionModelRevision: number;
    }>;
}, import("./Cluster").Events>;
