import { KeyPair } from "../../crypto/Crypto";
import { NodeId } from "../common/NodeId";
import { ByteArray, TypeFromSchema } from "@project-chip/matter.js";
export declare function matterToJsDate(date: number): Date;
export declare function jsToMatterDate(date: Date, addYears?: number): number;
export declare const FabricId_Matter: (id: bigint | number) => any[];
export declare const NodeId_Matter: (nodeId: NodeId) => any[];
export declare const RcacId_Matter: (id: bigint | number) => any[];
export declare const TlvRootCertificate: import("@project-chip/matter.js").ObjectSchema<{
    serialNumber: import("@project-chip/matter.js").FieldType<Uint8Array>;
    signatureAlgorithm: import("@project-chip/matter.js").FieldType<number>;
    issuer: import("@project-chip/matter.js").FieldType<{
        issuerRcacId?: number | bigint | undefined;
    }>;
    notBefore: import("@project-chip/matter.js").FieldType<number>;
    notAfter: import("@project-chip/matter.js").FieldType<number>;
    subject: import("@project-chip/matter.js").FieldType<{
        rcacId: number | bigint;
    }>;
    publicKeyAlgorithm: import("@project-chip/matter.js").FieldType<number>;
    ellipticCurveIdentifier: import("@project-chip/matter.js").FieldType<number>;
    ellipticCurvePublicKey: import("@project-chip/matter.js").FieldType<Uint8Array>;
    extensions: import("@project-chip/matter.js").FieldType<{
        basicConstraints: {
            isCa: boolean;
            pathLen?: number | undefined;
        };
        keyUsage: number;
        subjectKeyIdentifier: Uint8Array;
        authorityKeyIdentifier: Uint8Array;
        extendedKeyUsage?: number[] | undefined;
        futureExtension?: Uint8Array | undefined;
    }>;
    signature: import("@project-chip/matter.js").FieldType<Uint8Array>;
}>;
export declare const TlvOperationalCertificate: import("@project-chip/matter.js").ObjectSchema<{
    serialNumber: import("@project-chip/matter.js").FieldType<Uint8Array>;
    signatureAlgorithm: import("@project-chip/matter.js").FieldType<number>;
    issuer: import("@project-chip/matter.js").FieldType<{
        issuerRcacId?: number | bigint | undefined;
    }>;
    notBefore: import("@project-chip/matter.js").FieldType<number>;
    notAfter: import("@project-chip/matter.js").FieldType<number>;
    subject: import("@project-chip/matter.js").FieldType<{
        fabricId: number | bigint;
        nodeId: NodeId;
    }>;
    publicKeyAlgorithm: import("@project-chip/matter.js").FieldType<number>;
    ellipticCurveIdentifier: import("@project-chip/matter.js").FieldType<number>;
    ellipticCurvePublicKey: import("@project-chip/matter.js").FieldType<Uint8Array>;
    extensions: import("@project-chip/matter.js").FieldType<{
        basicConstraints: {
            isCa: boolean;
            pathLen?: number | undefined;
        };
        keyUsage: number;
        subjectKeyIdentifier: Uint8Array;
        authorityKeyIdentifier: Uint8Array;
        extendedKeyUsage?: number[] | undefined;
        futureExtension?: Uint8Array | undefined;
    }>;
    signature: import("@project-chip/matter.js").FieldType<Uint8Array>;
}>;
export declare type RootCertificate = TypeFromSchema<typeof TlvRootCertificate>;
export declare type OperationalCertificate = TypeFromSchema<typeof TlvOperationalCertificate>;
declare type Unsigned<Type> = {
    [Property in keyof Type as Exclude<Property, "signature">]: Type[Property];
};
export declare class CertificateManager {
    static rootCertToAsn1({ serialNumber, notBefore, notAfter, issuer: { issuerRcacId }, subject: { rcacId }, ellipticCurvePublicKey, extensions: { subjectKeyIdentifier, authorityKeyIdentifier } }: Unsigned<RootCertificate>): Uint8Array;
    static nocCertToAsn1({ serialNumber, notBefore, notAfter, issuer: { issuerRcacId }, subject: { fabricId, nodeId }, ellipticCurvePublicKey, extensions: { subjectKeyIdentifier, authorityKeyIdentifier } }: Unsigned<OperationalCertificate>): Uint8Array;
    static validateRootCertificate(rootCert: RootCertificate): void;
    static validateNocCertificate(rootCert: RootCertificate, nocCert: OperationalCertificate): void;
    static createCertificateSigningRequest(keys: KeyPair): Uint8Array;
    static getPublicKeyFromCsr(csr: ByteArray): Uint8Array;
}
export {};
