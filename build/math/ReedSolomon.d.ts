import { ByteArray } from "@project-chip/matter.js";
export declare class ReedSolomon {
    private readonly galoisField;
    computeErrorCorrection(data: ByteArray, ecLength: number): Uint8Array;
    private generatePolynom;
}
