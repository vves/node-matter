import { Schema, ByteArray } from "@project-chip/matter.js";
declare const enum BitRangeType {
    Flag = 0,
    Number = 1,
    Enum = 2
}
declare type BitRange<T> = {
    type: BitRangeType;
    offset: number;
    length: number;
};
declare const BitRange: <T>(type: BitRangeType, offset: number, length: number) => BitRange<T>;
export interface BitFlag extends BitRange<boolean> {
    type: BitRangeType.Flag;
}
export declare const BitFlag: (offset: number) => BitFlag;
export interface BitField extends BitRange<number> {
    type: BitRangeType.Number;
}
export declare const BitField: (offset: number, length: number) => BitField;
export interface BitFieldEnum<E extends number> extends BitRange<E> {
    type: BitRangeType.Enum;
}
export declare const BitFieldEnum: <E extends number>(offset: number, length: number) => BitFieldEnum<E>;
export declare type BitSchema = {
    [key: string]: BitFlag | BitField | BitFieldEnum<any>;
};
export declare type TypeFromBitSchema<T extends BitSchema> = {
    [K in keyof T]: T[K] extends BitFieldEnum<infer E> ? E : (T[K] extends BitField ? number : boolean);
};
export declare type TypeFromBitmapSchema<S extends Schema<any, any>> = S extends Schema<infer T, any> ? T : never;
export declare class BitmapSchemaInternal<T extends BitSchema> extends Schema<TypeFromBitSchema<T>, number> {
    private readonly bitSchemas;
    private readonly masks;
    constructor(bitSchemas: T);
    encodeInternal(value: TypeFromBitSchema<T>): number;
    decodeInternal(bitmap: number): TypeFromBitSchema<T>;
}
export declare class ByteArrayBitmapSchemaInternal<T extends BitSchema> extends Schema<TypeFromBitSchema<T>, ByteArray> {
    private readonly bitSchemas;
    private readonly byteArrayLength;
    private readonly maskOffset;
    constructor(bitSchemas: T);
    encodeInternal(value: TypeFromBitSchema<T>): Uint8Array;
    decodeInternal(bitmap: ByteArray): TypeFromBitSchema<T>;
}
export declare const BitmapSchema: <T extends BitSchema>(bitSchemas: T) => BitmapSchemaInternal<T>;
export declare const ByteArrayBitmapSchema: <T extends BitSchema>(bitSchemas: T) => ByteArrayBitmapSchemaInternal<T>;
export {};
