import { Schema, ByteArray } from "@project-chip/matter.js";
declare class Base38Schema extends Schema<ByteArray, string> {
    protected encodeInternal(bytes: ByteArray): string;
    private encodeBase38;
    protected decodeInternal(encoded: string): ByteArray;
    private decodeBase38;
}
export declare const Base38: Base38Schema;
export {};
