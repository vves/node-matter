import { Schema } from "@project-chip/matter.js";
export declare class QrCodeSchema extends Schema<string, string> {
    protected encodeInternal(data: string): string;
    private getCode;
    protected decodeInternal(encoded: string): string;
}
export declare const QrCode: QrCodeSchema;
