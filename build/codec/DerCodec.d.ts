import { ByteArray } from "@project-chip/matter.js";
export declare const OBJECT_ID_KEY = "_objectId";
export declare const TAG_ID_KEY = "_tag";
export declare const BYTES_KEY = "_bytes";
export declare const ELEMENTS_KEY = "_elements";
export declare const BITS_PADDING = "_padding";
export declare const ObjectId: (objectId: string) => {
    _tag: number;
    _bytes: Uint8Array;
};
export declare const DerObject: (objectId: string, content?: any) => any;
export declare const BitByteArray: (data: ByteArray, padding?: number) => {
    _tag: number;
    _bytes: Uint8Array;
    _padding: number;
};
export declare const ContextTagged: (tagId: number, value?: any) => {
    _tag: number;
    _bytes: Uint8Array;
};
export declare const ContextTaggedBytes: (tagId: number, value: ByteArray) => {
    _tag: number;
    _bytes: Uint8Array;
};
export declare type DerNode = {
    [TAG_ID_KEY]: number;
    [BYTES_KEY]: ByteArray;
    [ELEMENTS_KEY]?: DerNode[];
    [BITS_PADDING]?: number;
};
export declare class DerCodec {
    static encode(value: any): ByteArray;
    private static encodeDate;
    private static encodeBoolean;
    private static encodeArray;
    private static encodeOctetString;
    private static encodeObject;
    private static encodeString;
    private static encodeUnsignedInt;
    private static encodeLengthBytes;
    private static encodeAnsi1;
    static decode(data: ByteArray): DerNode;
    private static decodeRec;
    private static decodeAnsi1;
}
export declare const PublicKeyEcPrime256v1_X962: (key: ByteArray) => {
    type: {
        algorithm: {
            _tag: number;
            _bytes: Uint8Array;
        };
        curve: {
            _tag: number;
            _bytes: Uint8Array;
        };
    };
    bytes: {
        _tag: number;
        _bytes: Uint8Array;
        _padding: number;
    };
};
export declare const EcdsaWithSHA256_X962: any;
export declare const OrganisationName_X520: (name: string) => any[];
export declare const SubjectKeyIdentifier_X509: (identifier: ByteArray) => any;
export declare const AuthorityKeyIdentifier_X509: (identifier: ByteArray) => any;
export declare const BasicConstraints_X509: (constraints: any) => any;
export declare const ExtendedKeyUsage_X509: ({ clientAuth, serverAuth }: {
    clientAuth: boolean;
    serverAuth: boolean;
}) => any;
export declare const KeyUsage_Signature_X509: any;
export declare const KeyUsage_Signature_ContentCommited_X509: any;
