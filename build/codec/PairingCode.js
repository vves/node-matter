"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManualPairingCodeCodec = exports.QrPairingCodeCodec = exports.DiscoveryCapabilitiesSchema = exports.CommissionningFlowType = void 0;
const matter_js_1 = require("@project-chip/matter.js");
const Base38_1 = require("./Base38");
const BitmapSchema_1 = require("./BitmapSchema");
const Verhoeff_1 = require("../math/Verhoeff");
var CommissionningFlowType;
(function (CommissionningFlowType) {
    CommissionningFlowType[CommissionningFlowType["Standard"] = 0] = "Standard";
    CommissionningFlowType[CommissionningFlowType["UserIntent"] = 1] = "UserIntent";
    CommissionningFlowType[CommissionningFlowType["Custom"] = 2] = "Custom";
})(CommissionningFlowType = exports.CommissionningFlowType || (exports.CommissionningFlowType = {}));
exports.DiscoveryCapabilitiesSchema = (0, BitmapSchema_1.BitmapSchema)({
    softAccessPoint: (0, BitmapSchema_1.BitFlag)(0),
    ble: (0, BitmapSchema_1.BitFlag)(1),
    onIpNetwork: (0, BitmapSchema_1.BitFlag)(2),
});
const QrCodeDataSchema = (0, BitmapSchema_1.ByteArrayBitmapSchema)({
    version: (0, BitmapSchema_1.BitField)(0, 3),
    vendorId: (0, BitmapSchema_1.BitField)(3, 16),
    productId: (0, BitmapSchema_1.BitField)(19, 16),
    flowType: (0, BitmapSchema_1.BitFieldEnum)(35, 2),
    discoveryCapabilities: (0, BitmapSchema_1.BitField)(37, 8),
    discriminator: (0, BitmapSchema_1.BitField)(45, 12),
    passcode: (0, BitmapSchema_1.BitField)(57, 27),
});
const PREFIX = "MT:";
class QrPairingCodeSchema extends matter_js_1.Schema {
    encodeInternal(payloadData) {
        return PREFIX + Base38_1.Base38.encode(QrCodeDataSchema.encode(payloadData));
    }
    decodeInternal(encoded) {
        if (!encoded.startsWith(PREFIX))
            throw new Error("The pairing code should start with MT:");
        return QrCodeDataSchema.decode(Base38_1.Base38.decode(encoded.slice(PREFIX.length)));
    }
}
exports.QrPairingCodeCodec = new QrPairingCodeSchema();
class ManualPairingCodeSchema extends matter_js_1.Schema {
    encodeInternal({ discriminator, passcode, vendorId, productId }) {
        let result = "";
        const hasVendorProductIds = (vendorId !== undefined) && (productId !== undefined);
        result += ((discriminator >> 10) | (hasVendorProductIds ? (1 << 2) : 0));
        result += (((discriminator & 0x300) << 6) | (passcode & 0x3FFF)).toString().padStart(5, "0");
        result += (passcode >> 14).toString().padStart(4, "0");
        if (hasVendorProductIds) {
            result += vendorId.toString().padStart(5, "0");
            result += productId.toString().padStart(5, "0");
        }
        result += new Verhoeff_1.Verhoeff().computeChecksum(result);
        return result;
    }
    decodeInternal(_encoded) {
        throw new Error("Not implemented");
    }
}
exports.ManualPairingCodeCodec = new ManualPairingCodeSchema();
