"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WindowCoveringCluster = exports.WindowCoveringSafetyStatus = exports.WindowCoveringMode = exports.WindowCoveringOperationalStatus = exports.WindowCoveringConfigStatus = exports.WindowCoveringEndProductType = exports.WindowCoveringType = exports.WindowCoveringFeatures = void 0;
const matter_js_1 = require("@project-chip/matter.js");
const InteractionMessages_1 = require("../interaction/InteractionMessages");
const Cluster_1 = require("./Cluster");
const WCPercent = matter_js_1.TlvUInt16.bound({ min: 0, max: 100 });
const WCPercent100ths = matter_js_1.TlvUInt16.bound({ min: 0, max: 10000 });
exports.WindowCoveringFeatures = {
    lift: (0, matter_js_1.BitFlag)(0),
    tilt: (0, matter_js_1.BitFlag)(1),
    positionAwareLift: (0, matter_js_1.BitFlag)(2),
    absolutePosition: (0, matter_js_1.BitFlag)(3),
    positionAwareTilt: (0, matter_js_1.BitFlag)(4)
};
var WindowCoveringType;
(function (WindowCoveringType) {
    WindowCoveringType[WindowCoveringType["RollerShade"] = 0] = "RollerShade";
    WindowCoveringType[WindowCoveringType["RollerShade2Motor"] = 1] = "RollerShade2Motor";
    WindowCoveringType[WindowCoveringType["RollerShadeExterior"] = 2] = "RollerShadeExterior";
    WindowCoveringType[WindowCoveringType["RollerShadeExterior2Motor"] = 3] = "RollerShadeExterior2Motor";
    WindowCoveringType[WindowCoveringType["Drapery"] = 4] = "Drapery";
    WindowCoveringType[WindowCoveringType["Awning"] = 5] = "Awning";
    WindowCoveringType[WindowCoveringType["Shutter"] = 6] = "Shutter";
    WindowCoveringType[WindowCoveringType["TiltOnlyBlind"] = 7] = "TiltOnlyBlind";
    WindowCoveringType[WindowCoveringType["LiftAndTiltBlind"] = 8] = "LiftAndTiltBlind";
    WindowCoveringType[WindowCoveringType["ProjectorScreen"] = 9] = "ProjectorScreen";
    WindowCoveringType[WindowCoveringType["Unknown"] = 255] = "Unknown";
})(WindowCoveringType = exports.WindowCoveringType || (exports.WindowCoveringType = {}));
var WindowCoveringEndProductType;
(function (WindowCoveringEndProductType) {
    WindowCoveringEndProductType[WindowCoveringEndProductType["RollerShade"] = 0] = "RollerShade";
    WindowCoveringEndProductType[WindowCoveringEndProductType["RomanShade"] = 1] = "RomanShade";
    WindowCoveringEndProductType[WindowCoveringEndProductType["BalloonShade"] = 2] = "BalloonShade";
    WindowCoveringEndProductType[WindowCoveringEndProductType["WovenWood"] = 3] = "WovenWood";
    WindowCoveringEndProductType[WindowCoveringEndProductType["PleatedShade"] = 4] = "PleatedShade";
    WindowCoveringEndProductType[WindowCoveringEndProductType["CellularShade"] = 5] = "CellularShade";
    WindowCoveringEndProductType[WindowCoveringEndProductType["LayeredShade"] = 6] = "LayeredShade";
    WindowCoveringEndProductType[WindowCoveringEndProductType["LayeredShade2D"] = 7] = "LayeredShade2D";
    WindowCoveringEndProductType[WindowCoveringEndProductType["SheerShade"] = 8] = "SheerShade";
    WindowCoveringEndProductType[WindowCoveringEndProductType["TiltOnlyInteriorBlind"] = 9] = "TiltOnlyInteriorBlind";
    WindowCoveringEndProductType[WindowCoveringEndProductType["InteriorBlind"] = 10] = "InteriorBlind";
    WindowCoveringEndProductType[WindowCoveringEndProductType["VerticalBlindStripCurtain"] = 11] = "VerticalBlindStripCurtain";
    WindowCoveringEndProductType[WindowCoveringEndProductType["InteriorVenetianBlind"] = 12] = "InteriorVenetianBlind";
    WindowCoveringEndProductType[WindowCoveringEndProductType["ExteriorVenetianBlind"] = 13] = "ExteriorVenetianBlind";
    WindowCoveringEndProductType[WindowCoveringEndProductType["LateralLeftCurtain"] = 14] = "LateralLeftCurtain";
    WindowCoveringEndProductType[WindowCoveringEndProductType["LateralRightCurtain"] = 15] = "LateralRightCurtain";
    WindowCoveringEndProductType[WindowCoveringEndProductType["CentralCurtain"] = 16] = "CentralCurtain";
    WindowCoveringEndProductType[WindowCoveringEndProductType["RollerShutter"] = 17] = "RollerShutter";
    WindowCoveringEndProductType[WindowCoveringEndProductType["ExteriorVerticalScreen"] = 18] = "ExteriorVerticalScreen";
    WindowCoveringEndProductType[WindowCoveringEndProductType["AwningTerrace"] = 19] = "AwningTerrace";
    WindowCoveringEndProductType[WindowCoveringEndProductType["AwningVerticalScreen"] = 20] = "AwningVerticalScreen";
    WindowCoveringEndProductType[WindowCoveringEndProductType["TiltOnlyPergola"] = 21] = "TiltOnlyPergola";
    WindowCoveringEndProductType[WindowCoveringEndProductType["SwingingShutter"] = 22] = "SwingingShutter";
    WindowCoveringEndProductType[WindowCoveringEndProductType["SlidingShutter"] = 23] = "SlidingShutter";
    WindowCoveringEndProductType[WindowCoveringEndProductType["Unknown"] = 255] = "Unknown";
})(WindowCoveringEndProductType = exports.WindowCoveringEndProductType || (exports.WindowCoveringEndProductType = {}));
exports.WindowCoveringConfigStatus = {
    operational: (0, matter_js_1.BitFlag)(0),
    reversed: (0, matter_js_1.BitFlag)(2),
    liftPositionAware: (0, matter_js_1.BitFlag)(3),
    tiltPositionAware: (0, matter_js_1.BitFlag)(4),
    liftPositionType: (0, matter_js_1.BitFlag)(5),
    tiltPositionType: (0, matter_js_1.BitFlag)(6),
};
var WindowCoveringOperationalStatus;
(function (WindowCoveringOperationalStatus) {
    WindowCoveringOperationalStatus[WindowCoveringOperationalStatus["Stopped"] = 0] = "Stopped";
    WindowCoveringOperationalStatus[WindowCoveringOperationalStatus["Opening"] = 1] = "Opening";
    WindowCoveringOperationalStatus[WindowCoveringOperationalStatus["Closing"] = 2] = "Closing";
})(WindowCoveringOperationalStatus = exports.WindowCoveringOperationalStatus || (exports.WindowCoveringOperationalStatus = {}));
exports.WindowCoveringMode = {
    reversed: (0, matter_js_1.BitFlag)(0),
    calibrateMode: (0, matter_js_1.BitFlag)(1),
    maintenanceMode: (0, matter_js_1.BitFlag)(2),
    ledFeedback: (0, matter_js_1.BitFlag)(3)
};
exports.WindowCoveringSafetyStatus = {
    remoteLockout: (0, matter_js_1.BitFlag)(0),
    tamperDetection: (0, matter_js_1.BitFlag)(1),
    failedCommunication: (0, matter_js_1.BitFlag)(2),
    positionFailure: (0, matter_js_1.BitFlag)(3),
    thermalProtection: (0, matter_js_1.BitFlag)(4),
    obstacleDetected: (0, matter_js_1.BitFlag)(5),
    powerIssue: (0, matter_js_1.BitFlag)(6),
    stopInput: (0, matter_js_1.BitFlag)(7),
    motorJammed: (0, matter_js_1.BitFlag)(8),
    hardwareFailure: (0, matter_js_1.BitFlag)(9),
    manualOperation: (0, matter_js_1.BitFlag)(10),
    protection: (0, matter_js_1.BitFlag)(11)
};
const GoToLiftValueParams = (0, matter_js_1.TlvObject)({
    value: (0, matter_js_1.TlvField)(0, matter_js_1.TlvUInt16)
});
const GotoLiftPercentParams = (0, matter_js_1.TlvObject)({
    percent: (0, matter_js_1.TlvOptionalField)(0, WCPercent100ths),
    percent100ths: (0, matter_js_1.TlvOptionalField)(1, WCPercent100ths)
});
const GotoTiltValueParams = GoToLiftValueParams;
const GotoTiltPercentParams = GotoLiftPercentParams;
const SceneTableExtensions = {};
exports.WindowCoveringCluster = (0, Cluster_1.Cluster)({
    id: 0x102,
    name: "Window Covering",
    revision: 5,
    features: exports.WindowCoveringFeatures,
    attributes: {
        type: (0, Cluster_1.Attribute)(0x0000, (0, matter_js_1.TlvEnum)(), { persistent: true }),
        physicalClosedLimitLift: (0, Cluster_1.OptionalAttribute)(0x0001, matter_js_1.TlvUInt16),
        physicalClosedLimitTilt: (0, Cluster_1.OptionalAttribute)(0x0002, matter_js_1.TlvUInt16),
        currentPositionLift: (0, Cluster_1.OptionalAttribute)(0x0003, matter_js_1.TlvUInt16),
        currentPositionTilt: (0, Cluster_1.OptionalAttribute)(0x0004, matter_js_1.TlvUInt16),
        numOfActuationsLift: (0, Cluster_1.OptionalAttribute)(0x0005, matter_js_1.TlvUInt16),
        numOfActuationsTilt: (0, Cluster_1.OptionalAttribute)(0x0006, matter_js_1.TlvUInt16),
        configStatus: (0, Cluster_1.Attribute)(0x0007, (0, matter_js_1.TlvBitmap)(matter_js_1.TlvUInt8, exports.WindowCoveringConfigStatus)),
        currentPositionLiftPercent: (0, Cluster_1.Attribute)(0x0008, WCPercent),
        currentPositionTiltPercent: (0, Cluster_1.Attribute)(0x0009, WCPercent),
        operationalStatus: (0, Cluster_1.Attribute)(0x000a, (0, matter_js_1.TlvEnum)(), {
            persistent: true,
            default: WindowCoveringOperationalStatus.Stopped
        }),
        targetPositionLiftPercent100ths: (0, Cluster_1.Attribute)(0x000b, WCPercent100ths),
        targetPositionTiltPercent100ths: (0, Cluster_1.Attribute)(0x000c, WCPercent100ths),
        endProductType: (0, Cluster_1.WritableAttribute)(0x000d, (0, matter_js_1.TlvEnum)(), { persistent: true }),
        currentPositionLiftPercent100ths: (0, Cluster_1.Attribute)(0x000e, WCPercent100ths),
        currentPositionTiltPercent100ths: (0, Cluster_1.Attribute)(0x000f, WCPercent100ths),
        installedOpenLimitLift: (0, Cluster_1.OptionalAttribute)(0x0010, matter_js_1.TlvUInt16),
        installedClosedLimitLift: (0, Cluster_1.OptionalAttribute)(0x0011, matter_js_1.TlvUInt16),
        installedOpenLimitTilt: (0, Cluster_1.OptionalAttribute)(0x0012, matter_js_1.TlvUInt16),
        installedClosedLimitTilt: (0, Cluster_1.OptionalAttribute)(0x0013, matter_js_1.TlvUInt16),
        mode: (0, Cluster_1.Attribute)(0x0017, (0, matter_js_1.TlvBitmap)(matter_js_1.TlvUInt8, exports.WindowCoveringMode), { persistent: true }),
        safetyStatus: (0, Cluster_1.OptionalAttribute)(0x001a, (0, matter_js_1.TlvBitmap)(matter_js_1.TlvUInt16, exports.WindowCoveringSafetyStatus))
    },
    commands: {
        open: (0, Cluster_1.Command)(0x00, Cluster_1.TlvNoArguments, 0, InteractionMessages_1.TlvStatusResponse),
        close: (0, Cluster_1.Command)(0x01, Cluster_1.TlvNoArguments, 1, InteractionMessages_1.TlvStatusResponse),
        stop: (0, Cluster_1.Command)(0x02, Cluster_1.TlvNoArguments, 2, InteractionMessages_1.TlvStatusResponse),
        gotoLiftValue: (0, Cluster_1.OptionalCommand)(0x04, GoToLiftValueParams, 4, InteractionMessages_1.TlvStatusResponse),
        gotoLiftPercent: (0, Cluster_1.OptionalCommand)(0x05, GotoLiftPercentParams, 5, InteractionMessages_1.TlvStatusResponse),
        gotoTiltValue: (0, Cluster_1.OptionalCommand)(0x07, GotoTiltValueParams, 7, InteractionMessages_1.TlvStatusResponse),
        gotoTiltPercent: (0, Cluster_1.OptionalCommand)(0x08, GotoTiltPercentParams, 8, InteractionMessages_1.TlvStatusResponse)
    },
});
