import { FabricIndex } from "../common/FabricIndex";
import { Attribute, Cluster, Command } from "./Cluster";
export declare const RESP_MAX = 900;
export declare const enum CertificateChainType {
    DeviceAttestation = 1,
    ProductAttestationIntermediate = 2
}
export declare const enum OperationalCertStatus {
    Success = 0,
    InvalidPublicKey = 1,
    InvalidNodeOpId = 2,
    InvalidOperationalCert = 3,
    MissingCsr = 4,
    TableFull = 5,
    InvalidAdminSubject = 6,
    FabricConflict = 9,
    LabelConflict = 10,
    InvalidFabricIndex = 11
}
export declare const TlvAttestation: import("@project-chip/matter.js").ObjectSchema<{
    declaration: import("@project-chip/matter.js").FieldType<Uint8Array>;
    attestationNonce: import("@project-chip/matter.js").FieldType<Uint8Array>;
    timestamp: import("@project-chip/matter.js").FieldType<number>;
    firmwareInfo: import("@project-chip/matter.js").OptionalFieldType<Uint8Array>;
}>;
export declare const TlvCertSigningRequest: import("@project-chip/matter.js").ObjectSchema<{
    certSigningRequest: import("@project-chip/matter.js").FieldType<Uint8Array>;
    certSigningRequestNonce: import("@project-chip/matter.js").FieldType<Uint8Array>;
    vendorReserved1: import("@project-chip/matter.js").OptionalFieldType<Uint8Array>;
    vendorReserved2: import("@project-chip/matter.js").OptionalFieldType<Uint8Array>;
    vendorReserved3: import("@project-chip/matter.js").OptionalFieldType<Uint8Array>;
}>;
export declare const OperationalCredentialsCluster: Cluster<import("@project-chip/matter.js").BitSchema, {
    nocs: Attribute<{
        noc: Uint8Array;
        icac: Uint8Array | null;
    }[]>;
    fabrics: Attribute<{
        label: string;
        vendorId: import("../common/VendorId").VendorId;
        fabricId: import("../common/FabricId").FabricId;
        nodeId: import("../common/NodeId").NodeId;
        fabricIndex: FabricIndex;
        rootPublicKey: Uint8Array;
    }[]>;
    supportedFabrics: Attribute<number>;
    commissionedFabrics: Attribute<number>;
    trustedRootCertificates: Attribute<Uint8Array[]>;
    currentFabricIndex: Attribute<FabricIndex>;
    clusterRevision: Attribute<number>;
    featureMap: Attribute<import("@project-chip/matter.js").TypeFromBitSchema<import("@project-chip/matter.js").BitSchema>>;
    attributeList: Attribute<import("../common/AttributeId").AttributeId[]>;
    eventList: Attribute<import("../common/EventId").EventId[]>;
    acceptedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
    generatedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
}, {
    requestAttestation: Command<{
        attestationNonce: Uint8Array;
    }, {
        elements: Uint8Array;
        signature: Uint8Array;
    }>;
    requestCertChain: Command<{
        type: CertificateChainType;
    }, {
        certificate: Uint8Array;
    }>;
    requestCertSigning: Command<{
        certSigningRequestNonce: Uint8Array;
        isForUpdateNOC?: boolean | undefined;
    }, {
        elements: Uint8Array;
        signature: Uint8Array;
    }>;
    addOperationalCert: Command<{
        operationalCert: Uint8Array;
        identityProtectionKey: Uint8Array;
        caseAdminNode: import("../common/NodeId").NodeId;
        adminVendorId: import("../common/VendorId").VendorId;
        intermediateCaCert?: Uint8Array | undefined;
    }, {
        status: OperationalCertStatus;
        debugText?: string | undefined;
        fabricIndex?: FabricIndex | undefined;
    }>;
    updateOperationalCert: Command<{
        operationalCert: Uint8Array;
        intermediateCaCert?: Uint8Array | undefined;
    }, {
        status: OperationalCertStatus;
        debugText?: string | undefined;
        fabricIndex?: FabricIndex | undefined;
    }>;
    updateFabricLabel: Command<{
        label: string;
    }, {
        status: OperationalCertStatus;
        debugText?: string | undefined;
        fabricIndex?: FabricIndex | undefined;
    }>;
    removeFabric: Command<{
        fabricIndex: FabricIndex;
    }, {
        status: OperationalCertStatus;
        debugText?: string | undefined;
        fabricIndex?: FabricIndex | undefined;
    }>;
    addRootCert: Command<{
        certificate: Uint8Array;
    }, void>;
}, import("./Cluster").Events>;
