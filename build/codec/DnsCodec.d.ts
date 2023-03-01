import { ByteArray } from "@project-chip/matter.js";
export declare const PtrRecord: (name: string, ptr: string) => Record<string>;
export declare const ARecord: (name: string, ip: string) => Record<string>;
export declare const AAAARecord: (name: string, ip: string) => Record<string>;
export declare const TxtRecord: (name: string, entries: string[]) => Record<string[]>;
export declare const SrvRecord: (name: string, srv: SrvRecordValue) => Record<SrvRecordValue>;
export interface SrvRecordValue {
    priority: number;
    weight: number;
    port: number;
    target: string;
}
export interface Query {
    name: string;
    recordType: RecordType;
    recordClass: RecordClass;
}
export interface Record<T> {
    name: string;
    recordType: RecordType;
    recordClass: RecordClass;
    ttl: number;
    value: T;
}
export interface DnsMessage {
    transactionId: number;
    messageType: MessageType;
    queries: Query[];
    answers: Record<any>[];
    authorities: Record<any>[];
    additionalRecords: Record<any>[];
}
export declare const enum MessageType {
    Query = 0,
    Response = 33792
}
export declare const enum RecordType {
    A = 1,
    PTR = 12,
    TXT = 16,
    AAAA = 28,
    SRV = 33,
    ANY = 255
}
export declare const enum RecordClass {
    IN = 1
}
export declare class DnsCodec {
    static decode(message: ByteArray): DnsMessage | undefined;
    private static decodeQuery;
    private static decodeRecord;
    private static decodeQName;
    private static decodeRecordValue;
    private static decodeSrvRecord;
    private static decodeTxtRecord;
    private static decodeAaaaRecord;
    private static decodeARecord;
    static encode({ transactionId, queries, answers, authorities, additionalRecords }: Partial<DnsMessage>): ByteArray;
    private static encodeRecordValue;
    private static encodeARecord;
    private static encodeAaaaRecord;
    private static encodeTxtRecord;
    private static encodeSrvRecord;
    private static encodeQName;
}
