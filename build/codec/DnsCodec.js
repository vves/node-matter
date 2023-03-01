"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DnsCodec = exports.SrvRecord = exports.TxtRecord = exports.AAAARecord = exports.ARecord = exports.PtrRecord = void 0;
const net_1 = __importDefault(require("net"));
const matter_js_1 = require("@project-chip/matter.js");
const PtrRecord = (name, ptr) => ({ name, value: ptr, ttl: 120, recordType: 12, recordClass: 1 });
exports.PtrRecord = PtrRecord;
const ARecord = (name, ip) => ({ name, value: ip, ttl: 120, recordType: 1, recordClass: 1 });
exports.ARecord = ARecord;
const AAAARecord = (name, ip) => ({ name, value: ip, ttl: 120, recordType: 28, recordClass: 1 });
exports.AAAARecord = AAAARecord;
const TxtRecord = (name, entries) => ({ name, value: entries, ttl: 120, recordType: 16, recordClass: 1 });
exports.TxtRecord = TxtRecord;
const SrvRecord = (name, srv) => ({ name, value: srv, ttl: 120, recordType: 33, recordClass: 1 });
exports.SrvRecord = SrvRecord;
class DnsCodec {
    static decode(message) {
        try {
            const reader = new matter_js_1.DataReader(message, matter_js_1.Endian.Big);
            const transactionId = reader.readUInt16();
            const messageType = reader.readUInt16();
            const queriesCount = reader.readUInt16();
            const answersCount = reader.readUInt16();
            const authoritiesCount = reader.readUInt16();
            const additionalRecordsCount = reader.readUInt16();
            const queries = new Array();
            for (var i = 0; i < queriesCount; i++) {
                queries.push(this.decodeQuery(reader, message));
            }
            const answers = new Array();
            for (var i = 0; i < answersCount; i++) {
                answers.push(this.decodeRecord(reader, message));
            }
            const authorities = new Array();
            for (var i = 0; i < authoritiesCount; i++) {
                authorities.push(this.decodeRecord(reader, message));
            }
            const additionalRecords = new Array();
            for (var i = 0; i < additionalRecordsCount; i++) {
                additionalRecords.push(this.decodeRecord(reader, message));
            }
            return { transactionId, messageType, queries, answers, authorities, additionalRecords };
        }
        catch (error) {
            return undefined;
        }
    }
    static decodeQuery(reader, message) {
        const name = this.decodeQName(reader, message);
        const recordType = reader.readUInt16();
        const recordClass = reader.readUInt16();
        return { name, recordType, recordClass };
    }
    static decodeRecord(reader, message) {
        const name = this.decodeQName(reader, message);
        const recordType = reader.readUInt16();
        const recordClass = reader.readUInt16();
        const ttl = reader.readUInt32();
        const valueLength = reader.readUInt16();
        const valueBytes = reader.readByteArray(valueLength);
        const value = this.decodeRecordValue(valueBytes, recordType, message);
        return { name, recordType, recordClass, ttl, value };
    }
    static decodeQName(reader, message) {
        const qNameItems = new Array();
        while (true) {
            const itemLength = reader.readUInt8();
            if (itemLength === 0)
                break;
            if ((itemLength & 0xC0) !== 0) {
                const indexInMessage = reader.readUInt8() | ((itemLength & 0x3F) << 8);
                qNameItems.push(this.decodeQName(new matter_js_1.DataReader(message.slice(indexInMessage), matter_js_1.Endian.Big), message));
                break;
            }
            qNameItems.push(reader.readUtf8String(itemLength));
        }
        return qNameItems.join(".");
    }
    static decodeRecordValue(valueBytes, recordType, message) {
        switch (recordType) {
            case 12:
                return this.decodeQName(new matter_js_1.DataReader(valueBytes, matter_js_1.Endian.Big), message);
            case 33:
                return this.decodeSrvRecord(valueBytes, message);
            case 16:
                return this.decodeTxtRecord(valueBytes);
            case 28:
                return this.decodeAaaaRecord(valueBytes);
            case 1:
                return this.decodeARecord(valueBytes);
            default:
                return valueBytes;
        }
    }
    static decodeSrvRecord(valueBytes, message) {
        const reader = new matter_js_1.DataReader(valueBytes, matter_js_1.Endian.Big);
        const priority = reader.readUInt16();
        const weight = reader.readUInt16();
        const port = reader.readUInt16();
        const target = this.decodeQName(reader, message);
        return { priority, weight, port, target };
    }
    static decodeTxtRecord(valueBytes) {
        const reader = new matter_js_1.DataReader(valueBytes, matter_js_1.Endian.Big);
        const result = new Array();
        var bytesRead = 0;
        while (bytesRead < valueBytes.length) {
            const length = reader.readUInt8();
            result.push(reader.readUtf8String(length));
            bytesRead += length + 1;
        }
        return result;
    }
    static decodeAaaaRecord(valueBytes) {
        const reader = new matter_js_1.DataReader(valueBytes, matter_js_1.Endian.Big);
        const ipItems = new Array();
        for (var i = 0; i < 8; i++) {
            ipItems.push(reader.readUInt16().toString(16));
        }
        const zeroSequences = new Array();
        for (var i = 0; i < 8; i++) {
            if (ipItems[i] !== "0")
                continue;
            const start = i;
            i++;
            while (i < 8 && ipItems[i] === "0") {
                i++;
            }
            zeroSequences.push({ start, length: i - start });
        }
        if (zeroSequences.length > 0) {
            zeroSequences.sort((a, b) => a.length - b.length);
            const { start, length } = zeroSequences[0];
            for (var i = start; i < start + length; i++) {
                ipItems[i] = "";
            }
        }
        return ipItems.join(":");
    }
    static decodeARecord(valueBytes) {
        const reader = new matter_js_1.DataReader(valueBytes, matter_js_1.Endian.Big);
        const ipItems = new Array();
        for (var i = 0; i < 4; i++) {
            ipItems.push(reader.readUInt8().toString());
        }
        return ipItems.join(".");
    }
    static encode({ transactionId = 0, queries = [], answers = [], authorities = [], additionalRecords = [] }) {
        const writer = new matter_js_1.DataWriter(matter_js_1.Endian.Big);
        writer.writeUInt16(transactionId);
        writer.writeUInt16(queries.length > 0 ? 0 : 33792);
        writer.writeUInt16(queries.length);
        writer.writeUInt16(answers.length);
        writer.writeUInt16(0);
        writer.writeUInt16(additionalRecords.length);
        queries.forEach(({ name, recordClass, recordType }) => {
            writer.writeByteArray(this.encodeQName(name));
            writer.writeUInt16(recordType);
            writer.writeUInt16(recordClass);
        });
        [...answers, ...authorities, ...additionalRecords].forEach(({ name, recordType, recordClass, ttl, value }) => {
            writer.writeByteArray(this.encodeQName(name));
            writer.writeUInt16(recordType);
            writer.writeUInt16(recordClass);
            writer.writeUInt32(ttl);
            const encodedValue = this.encodeRecordValue(value, recordType);
            writer.writeUInt16(encodedValue.length);
            writer.writeByteArray(encodedValue);
        });
        return writer.toByteArray();
    }
    static encodeRecordValue(value, recordType) {
        switch (recordType) {
            case 12:
                return this.encodeQName(value);
            case 33:
                return this.encodeSrvRecord(value);
            case 16:
                return this.encodeTxtRecord(value);
            case 28:
                return this.encodeAaaaRecord(value);
            case 1:
                return this.encodeARecord(value);
            default:
                throw new Error(`Unsupported record type ${recordType}`);
        }
    }
    static encodeARecord(ip) {
        if (!net_1.default.isIPv4(ip))
            throw new Error(`Invalid A Record value: ${ip}`);
        const writer = new matter_js_1.DataWriter(matter_js_1.Endian.Big);
        ip.split(".").forEach(part => {
            writer.writeUInt8(parseInt(part));
        });
        return writer.toByteArray();
    }
    static encodeAaaaRecord(ip) {
        if (!net_1.default.isIPv6(ip))
            throw new Error(`Invalid AAAA Record value: ${ip}`);
        const writer = new matter_js_1.DataWriter(matter_js_1.Endian.Big);
        const parts = ip.split(":");
        parts.forEach(part => {
            if (part === "") {
                const compressedParts = 8 - parts.length;
                for (var i = 0; i < compressedParts; i++) {
                    writer.writeUInt16(0);
                }
            }
            writer.writeUInt16(parseInt(part, 16));
        });
        return writer.toByteArray();
    }
    static encodeTxtRecord(entries) {
        const writer = new matter_js_1.DataWriter(matter_js_1.Endian.Big);
        entries.forEach(entry => {
            writer.writeUInt8(entry.length);
            writer.writeUtf8String(entry);
        });
        return writer.toByteArray();
    }
    static encodeSrvRecord({ priority, weight, port, target }) {
        const writer = new matter_js_1.DataWriter(matter_js_1.Endian.Big);
        writer.writeUInt16(priority);
        writer.writeUInt16(weight);
        writer.writeUInt16(port);
        writer.writeByteArray(this.encodeQName(target));
        return writer.toByteArray();
    }
    static encodeQName(qname) {
        const writer = new matter_js_1.DataWriter(matter_js_1.Endian.Big);
        qname.split(".").forEach(label => {
            writer.writeUInt8(label.length);
            writer.writeUtf8String(label);
        });
        writer.writeUInt8(0);
        return writer.toByteArray();
    }
}
exports.DnsCodec = DnsCodec;
