"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ByteArrayBitmapSchema = exports.BitmapSchema = exports.ByteArrayBitmapSchemaInternal = exports.BitmapSchemaInternal = exports.BitFieldEnum = exports.BitField = exports.BitFlag = void 0;
const matter_js_1 = require("@project-chip/matter.js");
const BitRange = (type, offset, length) => ({ type, offset, length });
const BitFlag = (offset) => BitRange(0, offset, 1);
exports.BitFlag = BitFlag;
const BitField = (offset, length) => BitRange(1, offset, length);
exports.BitField = BitField;
const BitFieldEnum = (offset, length) => BitRange(2, offset, length);
exports.BitFieldEnum = BitFieldEnum;
class BitmapSchemaInternal extends matter_js_1.Schema {
    constructor(bitSchemas) {
        super();
        this.bitSchemas = bitSchemas;
        const masks = {};
        for (const name in this.bitSchemas) {
            const { offset, length } = this.bitSchemas[name];
            masks[name] = ((1 << length) - 1) << offset;
        }
        this.masks = masks;
    }
    encodeInternal(value) {
        let result = 0;
        for (const name in this.bitSchemas) {
            const { type, offset } = this.bitSchemas[name];
            switch (type) {
                case 0:
                    if (value[name])
                        result |= this.masks[name];
                    break;
                case 2:
                case 1:
                    result |= value[name] << offset;
            }
        }
        return result;
    }
    decodeInternal(bitmap) {
        const result = {};
        for (const name in this.bitSchemas) {
            const { type, offset } = this.bitSchemas[name];
            const mask = this.masks[name];
            if (type === 0) {
                result[name] = (bitmap & mask) !== 0;
            }
            else {
                result[name] = (bitmap & mask) >> offset;
            }
        }
        return result;
    }
}
exports.BitmapSchemaInternal = BitmapSchemaInternal;
class ByteArrayBitmapSchemaInternal extends matter_js_1.Schema {
    constructor(bitSchemas) {
        super();
        this.bitSchemas = bitSchemas;
        let maxBitLength = 0;
        const maskOffset = {};
        for (const name in this.bitSchemas) {
            const { type, offset, length } = this.bitSchemas[name];
            const bitOffset = offset % 8;
            const byteOffset = (offset - bitOffset) / 8;
            let mask;
            if (type === 0) {
                mask = 1 << bitOffset;
            }
            else {
                mask = (1 << length) - 1;
            }
            maskOffset[name] = { bitOffset, byteOffset, mask };
            maxBitLength = Math.max(maxBitLength, offset + length);
        }
        this.byteArrayLength = Math.ceil(maxBitLength / 8);
        this.maskOffset = maskOffset;
    }
    encodeInternal(value) {
        let result = new matter_js_1.ByteArray(this.byteArrayLength);
        for (const name in this.bitSchemas) {
            const { type } = this.bitSchemas[name];
            let { mask, bitOffset, byteOffset } = this.maskOffset[name];
            switch (type) {
                case 0:
                    if (value[name])
                        result[byteOffset] |= mask;
                    break;
                case 2:
                case 1:
                    let numValue = value[name] & mask;
                    while (numValue !== 0) {
                        result[byteOffset++] |= (numValue << bitOffset) & 0xFF;
                        const bitWritten = 8 - bitOffset;
                        bitOffset = 0;
                        numValue = numValue >> bitWritten;
                    }
            }
        }
        return result;
    }
    decodeInternal(bitmap) {
        if (bitmap.length !== this.byteArrayLength)
            throw new Error(`Unexpected length: ${bitmap.length}. Expected ${this.byteArrayLength}`);
        const result = {};
        for (const name in this.bitSchemas) {
            const { type } = this.bitSchemas[name];
            let { mask, bitOffset, byteOffset } = this.maskOffset[name];
            if (type === 0) {
                result[name] = (bitmap[byteOffset] & mask) !== 0;
            }
            else {
                let value = 0;
                let valueBitOffset = 0;
                while (mask !== 0) {
                    value |= ((bitmap[byteOffset++] >> bitOffset) & mask) << valueBitOffset;
                    const bitRead = 8 - bitOffset;
                    bitOffset = 0;
                    valueBitOffset += bitRead;
                    mask = mask >> bitRead;
                }
                result[name] = value;
            }
        }
        return result;
    }
}
exports.ByteArrayBitmapSchemaInternal = ByteArrayBitmapSchemaInternal;
const BitmapSchema = (bitSchemas) => new BitmapSchemaInternal(bitSchemas);
exports.BitmapSchema = BitmapSchema;
const ByteArrayBitmapSchema = (bitSchemas) => new ByteArrayBitmapSchemaInternal(bitSchemas);
exports.ByteArrayBitmapSchema = ByteArrayBitmapSchema;
