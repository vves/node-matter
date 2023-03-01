export declare const TlvPbkdfParamRequest: import("@project-chip/matter.js").ObjectSchema<{
    random: import("@project-chip/matter.js").FieldType<Uint8Array>;
    sessionId: import("@project-chip/matter.js").FieldType<number>;
    passcodeId: import("@project-chip/matter.js").FieldType<number>;
    hasPbkdfParameters: import("@project-chip/matter.js").FieldType<boolean>;
    mrpParameters: import("@project-chip/matter.js").OptionalFieldType<{
        idleRetransTimeoutMs?: number | undefined;
        activeRetransTimeoutMs?: number | undefined;
    }>;
}>;
export declare const TlvPbkdfParamResponse: import("@project-chip/matter.js").ObjectSchema<{
    peerRandom: import("@project-chip/matter.js").FieldType<Uint8Array>;
    random: import("@project-chip/matter.js").FieldType<Uint8Array>;
    sessionId: import("@project-chip/matter.js").FieldType<number>;
    pbkdfParameters: import("@project-chip/matter.js").OptionalFieldType<{
        iterations: number;
        salt: Uint8Array;
    }>;
    mrpParameters: import("@project-chip/matter.js").OptionalFieldType<{
        idleRetransTimeoutMs?: number | undefined;
        activeRetransTimeoutMs?: number | undefined;
    }>;
}>;
export declare const TlvPasePake1: import("@project-chip/matter.js").ObjectSchema<{
    x: import("@project-chip/matter.js").FieldType<Uint8Array>;
}>;
export declare const TlvPasePake2: import("@project-chip/matter.js").ObjectSchema<{
    y: import("@project-chip/matter.js").FieldType<Uint8Array>;
    verifier: import("@project-chip/matter.js").FieldType<Uint8Array>;
}>;
export declare const TlvPasePake3: import("@project-chip/matter.js").ObjectSchema<{
    verifier: import("@project-chip/matter.js").FieldType<Uint8Array>;
}>;
