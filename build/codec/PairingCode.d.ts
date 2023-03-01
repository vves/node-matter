import { Schema } from "@project-chip/matter.js";
import { BitField, BitFieldEnum, BitFlag, TypeFromBitmapSchema } from "./BitmapSchema";
export declare enum CommissionningFlowType {
    Standard = 0,
    UserIntent = 1,
    Custom = 2
}
export declare const DiscoveryCapabilitiesSchema: import("./BitmapSchema").BitmapSchemaInternal<{
    softAccessPoint: BitFlag;
    ble: BitFlag;
    onIpNetwork: BitFlag;
}>;
declare const QrCodeDataSchema: import("./BitmapSchema").ByteArrayBitmapSchemaInternal<{
    version: BitField;
    vendorId: BitField;
    productId: BitField;
    flowType: BitFieldEnum<CommissionningFlowType>;
    discoveryCapabilities: BitField;
    discriminator: BitField;
    passcode: BitField;
}>;
export declare type QrCodeData = TypeFromBitmapSchema<typeof QrCodeDataSchema>;
declare class QrPairingCodeSchema extends Schema<QrCodeData, string> {
    protected encodeInternal(payloadData: QrCodeData): string;
    protected decodeInternal(encoded: string): QrCodeData;
}
export declare const QrPairingCodeCodec: QrPairingCodeSchema;
export declare type ManualPairingData = {
    discriminator: number;
    passcode: number;
    vendorId?: number;
    productId?: number;
};
declare class ManualPairingCodeSchema extends Schema<ManualPairingData, string> {
    protected encodeInternal({ discriminator, passcode, vendorId, productId }: ManualPairingData): string;
    protected decodeInternal(_encoded: string): ManualPairingData;
}
export declare const ManualPairingCodeCodec: ManualPairingCodeSchema;
export {};
