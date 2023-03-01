export declare const KDFSR1_KEY_INFO: Uint8Array;
export declare const KDFSR2_KEY_INFO: Uint8Array;
export declare const RESUME1_MIC_NONCE: Uint8Array;
export declare const RESUME2_MIC_NONCE: Uint8Array;
export declare const KDFSR2_INFO: Uint8Array;
export declare const KDFSR3_INFO: Uint8Array;
export declare const TBE_DATA2_NONCE: Uint8Array;
export declare const TBE_DATA3_NONCE: Uint8Array;
export declare const TlvCaseSigma1: import("@project-chip/matter.js").ObjectSchema<{
    random: import("@project-chip/matter.js").FieldType<Uint8Array>;
    sessionId: import("@project-chip/matter.js").FieldType<number>;
    destinationId: import("@project-chip/matter.js").FieldType<Uint8Array>;
    ecdhPublicKey: import("@project-chip/matter.js").FieldType<Uint8Array>;
    mrpParams: import("@project-chip/matter.js").OptionalFieldType<{
        idleRetransTimeoutMs?: number | undefined;
        activeRetransTimeoutMs?: number | undefined;
    }>;
    resumptionId: import("@project-chip/matter.js").OptionalFieldType<Uint8Array>;
    resumeMic: import("@project-chip/matter.js").OptionalFieldType<Uint8Array>;
}>;
export declare const TlvCaseSigma2: import("@project-chip/matter.js").ObjectSchema<{
    random: import("@project-chip/matter.js").FieldType<Uint8Array>;
    sessionId: import("@project-chip/matter.js").FieldType<number>;
    ecdhPublicKey: import("@project-chip/matter.js").FieldType<Uint8Array>;
    encrypted: import("@project-chip/matter.js").FieldType<Uint8Array>;
    mrpParams: import("@project-chip/matter.js").OptionalFieldType<{
        idleRetransTimeoutMs?: number | undefined;
        activeRetransTimeoutMs?: number | undefined;
    }>;
}>;
export declare const TlvCaseSigma2Resume: import("@project-chip/matter.js").ObjectSchema<{
    resumptionId: import("@project-chip/matter.js").FieldType<Uint8Array>;
    resumeMic: import("@project-chip/matter.js").FieldType<Uint8Array>;
    sessionId: import("@project-chip/matter.js").FieldType<number>;
}>;
export declare const TlvCaseSigma3: import("@project-chip/matter.js").ObjectSchema<{
    encrypted: import("@project-chip/matter.js").FieldType<Uint8Array>;
}>;
export declare const TlvSignedData: import("@project-chip/matter.js").ObjectSchema<{
    nodeOpCert: import("@project-chip/matter.js").FieldType<Uint8Array>;
    intermediateCACert: import("@project-chip/matter.js").OptionalFieldType<Uint8Array>;
    ecdhPublicKey: import("@project-chip/matter.js").FieldType<Uint8Array>;
    peerEcdhPublicKey: import("@project-chip/matter.js").FieldType<Uint8Array>;
}>;
export declare const TlvEncryptedDataSigma2: import("@project-chip/matter.js").ObjectSchema<{
    nodeOpCert: import("@project-chip/matter.js").FieldType<Uint8Array>;
    intermediateCACert: import("@project-chip/matter.js").OptionalFieldType<Uint8Array>;
    signature: import("@project-chip/matter.js").FieldType<Uint8Array>;
    resumptionId: import("@project-chip/matter.js").FieldType<Uint8Array>;
}>;
export declare const TlvEncryptedDataSigma3: import("@project-chip/matter.js").ObjectSchema<{
    nodeOpCert: import("@project-chip/matter.js").FieldType<Uint8Array>;
    intermediateCACert: import("@project-chip/matter.js").OptionalFieldType<Uint8Array>;
    signature: import("@project-chip/matter.js").FieldType<Uint8Array>;
}>;
