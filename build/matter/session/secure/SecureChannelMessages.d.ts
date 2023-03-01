export declare const SECURE_CHANNEL_PROTOCOL_ID = 0;
export declare const enum MessageType {
    StandaloneAck = 16,
    PbkdfParamRequest = 32,
    PbkdfParamResponse = 33,
    PasePake1 = 34,
    PasePake2 = 35,
    PasePake3 = 36,
    Sigma1 = 48,
    Sigma2 = 49,
    Sigma3 = 50,
    Sigma2Resume = 51,
    StatusReport = 64
}
export declare const enum ProtocolStatusCode {
    Success = 0,
    NoSharedTrustRoots = 1,
    InvalidParam = 2,
    CloseSession = 3,
    Busy = 4
}
export declare const enum GeneralStatusCode {
    Success = 0,
    Error = 1,
    BadPrecondition = 2,
    OutOfRange = 3,
    BadRequest = 4,
    Unsupported = 5,
    Unexpected = 6,
    ResourceExhausted = 7,
    Busy = 8,
    Timeout = 9,
    Continue = 10,
    Aborted = 11,
    InvalidArgument = 12,
    NotFound = 13,
    AlreadyExists = 14,
    PermissionDenied = 15,
    DataLoss = 16
}
