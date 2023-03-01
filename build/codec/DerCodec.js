"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyUsage_Signature_ContentCommited_X509 = exports.KeyUsage_Signature_X509 = exports.ExtendedKeyUsage_X509 = exports.BasicConstraints_X509 = exports.AuthorityKeyIdentifier_X509 = exports.SubjectKeyIdentifier_X509 = exports.OrganisationName_X520 = exports.EcdsaWithSHA256_X962 = exports.PublicKeyEcPrime256v1_X962 = exports.DerCodec = exports.ContextTaggedBytes = exports.ContextTagged = exports.BitByteArray = exports.DerObject = exports.ObjectId = exports.BITS_PADDING = exports.ELEMENTS_KEY = exports.BYTES_KEY = exports.TAG_ID_KEY = exports.OBJECT_ID_KEY = void 0;
const matter_js_1 = require("@project-chip/matter.js");
exports.OBJECT_ID_KEY = "_objectId";
exports.TAG_ID_KEY = "_tag";
exports.BYTES_KEY = "_bytes";
exports.ELEMENTS_KEY = "_elements";
exports.BITS_PADDING = "_padding";
const CONSTRUCTED = 0x20;
const ObjectId = (objectId) => ({ [exports.TAG_ID_KEY]: 6, [exports.BYTES_KEY]: matter_js_1.ByteArray.fromHex(objectId) });
exports.ObjectId = ObjectId;
const DerObject = (objectId, content = {}) => (Object.assign({ [exports.OBJECT_ID_KEY]: (0, exports.ObjectId)(objectId) }, content));
exports.DerObject = DerObject;
const BitByteArray = (data, padding = 0) => ({ [exports.TAG_ID_KEY]: 3, [exports.BYTES_KEY]: data, [exports.BITS_PADDING]: padding });
exports.BitByteArray = BitByteArray;
const ContextTagged = (tagId, value) => ({ [exports.TAG_ID_KEY]: tagId | 128 | CONSTRUCTED, [exports.BYTES_KEY]: value === undefined ? new matter_js_1.ByteArray(0) : DerCodec.encode(value) });
exports.ContextTagged = ContextTagged;
const ContextTaggedBytes = (tagId, value) => ({ [exports.TAG_ID_KEY]: tagId | 128, [exports.BYTES_KEY]: value });
exports.ContextTaggedBytes = ContextTaggedBytes;
class DerCodec {
    static encode(value) {
        if (Array.isArray(value)) {
            return this.encodeArray(value);
        }
        else if (value instanceof matter_js_1.ByteArray) {
            return this.encodeOctetString(value);
        }
        else if (value instanceof Date) {
            return this.encodeDate(value);
        }
        else if (typeof value === "object" && value[exports.TAG_ID_KEY] !== undefined) {
            return this.encodeAnsi1(value[exports.TAG_ID_KEY], (value[exports.BITS_PADDING] === undefined) ? value[exports.BYTES_KEY] : matter_js_1.ByteArray.concat(matter_js_1.ByteArray.of(value[exports.BITS_PADDING]), value[exports.BYTES_KEY]));
        }
        else if (typeof value === "object") {
            return this.encodeObject(value);
        }
        else if (typeof value === "string") {
            return this.encodeString(value);
        }
        else if (typeof value === "number") {
            return this.encodeUnsignedInt(value);
        }
        else if (typeof value === "boolean") {
            return this.encodeBoolean(value);
        }
        else if (value === undefined) {
            return new matter_js_1.ByteArray(0);
        }
        else {
            throw new Error(`Unsupported type ${typeof value}`);
        }
    }
    static encodeDate(date) {
        return this.encodeAnsi1(23, matter_js_1.ByteArray.fromString(date.toISOString().replace(/[-:\.T]/g, "").slice(2, 14) + "Z"));
    }
    static encodeBoolean(bool) {
        return this.encodeAnsi1(1, matter_js_1.ByteArray.of(bool ? 0xFF : 0));
    }
    static encodeArray(array) {
        return this.encodeAnsi1(17 | CONSTRUCTED, matter_js_1.ByteArray.concat(...array.map(element => this.encode(element))));
    }
    static encodeOctetString(value) {
        return this.encodeAnsi1(4, value);
    }
    static encodeObject(object) {
        const attributes = new Array();
        for (var key in object) {
            attributes.push(this.encode(object[key]));
        }
        return this.encodeAnsi1(16 | CONSTRUCTED, matter_js_1.ByteArray.concat(...attributes));
    }
    static encodeString(value) {
        return this.encodeAnsi1(12, matter_js_1.ByteArray.fromString(value));
    }
    static encodeUnsignedInt(value) {
        const byteArray = new matter_js_1.ByteArray(5);
        const dataView = byteArray.getDataView();
        dataView.setUint32(1, value);
        var start = 0;
        while (true) {
            if (dataView.getUint8(start) !== 0)
                break;
            if (dataView.getUint8(start + 1) >= 0x80)
                break;
            start++;
            if (start === 4)
                break;
        }
        return this.encodeAnsi1(2, byteArray.slice(start));
    }
    static encodeLengthBytes(value) {
        const byteArray = new matter_js_1.ByteArray(5);
        const dataView = byteArray.getDataView();
        dataView.setUint32(1, value);
        var start = 0;
        while (true) {
            if (dataView.getUint8(start) !== 0)
                break;
            start++;
            if (start === 4)
                break;
        }
        const lengthLength = byteArray.length - start;
        if (lengthLength > 1 || dataView.getUint8(start) >= 0x80) {
            start--;
            dataView.setUint8(start, 0x80 + lengthLength);
        }
        return byteArray.slice(start);
    }
    static encodeAnsi1(tag, data) {
        return matter_js_1.ByteArray.concat(matter_js_1.ByteArray.of(tag), this.encodeLengthBytes(data.length), data);
    }
    static decode(data) {
        return this.decodeRec(new matter_js_1.DataReader(data, matter_js_1.Endian.Big));
    }
    static decodeRec(reader) {
        const { tag, bytes } = this.decodeAnsi1(reader);
        if (tag === 3)
            return { [exports.TAG_ID_KEY]: tag, [exports.BYTES_KEY]: bytes.slice(1), [exports.BITS_PADDING]: bytes[0] };
        if ((tag & CONSTRUCTED) === 0)
            return { [exports.TAG_ID_KEY]: tag, [exports.BYTES_KEY]: bytes };
        const elementsReader = new matter_js_1.DataReader(bytes, matter_js_1.Endian.Big);
        const elements = [];
        while (elementsReader.getRemainingBytesCount() > 0) {
            elements.push(this.decodeRec(elementsReader));
        }
        return { [exports.TAG_ID_KEY]: tag, [exports.BYTES_KEY]: bytes, [exports.ELEMENTS_KEY]: elements };
    }
    static decodeAnsi1(reader) {
        const tag = reader.readUInt8();
        let length = reader.readUInt8();
        if ((length & 0x80) !== 0) {
            let lengthLength = length & 0x7F;
            length = 0;
            while (lengthLength > 0) {
                length = (length << 8) + reader.readUInt8();
                lengthLength--;
            }
        }
        const bytes = reader.readByteArray(length);
        return { tag, bytes };
    }
}
exports.DerCodec = DerCodec;
const PublicKeyEcPrime256v1_X962 = (key) => ({ type: { algorithm: (0, exports.ObjectId)("2A8648CE3D0201"), curve: (0, exports.ObjectId)("2A8648CE3D030107") }, bytes: (0, exports.BitByteArray)(key) });
exports.PublicKeyEcPrime256v1_X962 = PublicKeyEcPrime256v1_X962;
exports.EcdsaWithSHA256_X962 = (0, exports.DerObject)("2A8648CE3D040302");
const OrganisationName_X520 = (name) => [(0, exports.DerObject)("55040A", { name })];
exports.OrganisationName_X520 = OrganisationName_X520;
const SubjectKeyIdentifier_X509 = (identifier) => (0, exports.DerObject)("551d0e", { value: DerCodec.encode(identifier) });
exports.SubjectKeyIdentifier_X509 = SubjectKeyIdentifier_X509;
const AuthorityKeyIdentifier_X509 = (identifier) => (0, exports.DerObject)("551d23", { value: DerCodec.encode({ id: (0, exports.ContextTaggedBytes)(0, identifier) }) });
exports.AuthorityKeyIdentifier_X509 = AuthorityKeyIdentifier_X509;
const BasicConstraints_X509 = (constraints) => (0, exports.DerObject)("551d13", { critical: true, value: DerCodec.encode(constraints) });
exports.BasicConstraints_X509 = BasicConstraints_X509;
const ExtendedKeyUsage_X509 = ({ clientAuth, serverAuth }) => (0, exports.DerObject)("551d25", { critical: true, value: DerCodec.encode({
        client: clientAuth ? (0, exports.ObjectId)("2b06010505070302") : undefined,
        server: serverAuth ? (0, exports.ObjectId)("2b06010505070301") : undefined,
    }) });
exports.ExtendedKeyUsage_X509 = ExtendedKeyUsage_X509;
exports.KeyUsage_Signature_X509 = (0, exports.DerObject)("551d0f", { critical: true, value: DerCodec.encode((0, exports.BitByteArray)(matter_js_1.ByteArray.of(1 << 7), 7)) });
exports.KeyUsage_Signature_ContentCommited_X509 = (0, exports.DerObject)("551d0f", { critical: true, value: DerCodec.encode((0, exports.BitByteArray)(matter_js_1.ByteArray.of(0x03 << 1), 1)) });
