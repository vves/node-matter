import { MatterController } from "../../MatterController";
import { MatterDevice } from "../../MatterDevice";
import { TlvPasePake1, TlvPasePake2, TlvPasePake3, TlvPbkdfParamRequest, TlvPbkdfParamResponse } from "./PaseMessages";
import { SecureChannelMessenger } from "./SecureChannelMessenger";
import { TypeFromSchema } from "@project-chip/matter.js";
export declare const DEFAULT_PASSCODE_ID = 0;
export declare const SPAKE_CONTEXT: Uint8Array;
declare type PbkdfParamRequest = TypeFromSchema<typeof TlvPbkdfParamRequest>;
declare type PbkdfParamResponse = TypeFromSchema<typeof TlvPbkdfParamResponse>;
declare type PasePake1 = TypeFromSchema<typeof TlvPasePake1>;
declare type PasePake2 = TypeFromSchema<typeof TlvPasePake2>;
declare type PasePake3 = TypeFromSchema<typeof TlvPasePake3>;
export declare class PaseServerMessenger extends SecureChannelMessenger<MatterDevice> {
    readPbkdfParamRequest(): Promise<{
        requestPayload: Uint8Array;
        request: {
            sessionId: number;
            random: Uint8Array;
            passcodeId: number;
            hasPbkdfParameters: boolean;
            mrpParameters?: {
                idleRetransTimeoutMs?: number | undefined;
                activeRetransTimeoutMs?: number | undefined;
            } | undefined;
        };
    }>;
    sendPbkdfParamResponse(response: PbkdfParamResponse): Promise<Uint8Array>;
    readPasePake1(): Promise<{
        x: Uint8Array;
    }>;
    sendPasePake2(pasePake2: PasePake2): Promise<Uint8Array>;
    readPasePake3(): Promise<{
        verifier: Uint8Array;
    }>;
}
export declare class PaseClientMessenger extends SecureChannelMessenger<MatterController> {
    sendPbkdfParamRequest(request: PbkdfParamRequest): Promise<Uint8Array>;
    readPbkdfParamResponse(): Promise<{
        responsePayload: Uint8Array;
        response: {
            sessionId: number;
            random: Uint8Array;
            peerRandom: Uint8Array;
            mrpParameters?: {
                idleRetransTimeoutMs?: number | undefined;
                activeRetransTimeoutMs?: number | undefined;
            } | undefined;
            pbkdfParameters?: {
                iterations: number;
                salt: Uint8Array;
            } | undefined;
        };
    }>;
    sendPasePake1(pasePake1: PasePake1): Promise<Uint8Array>;
    readPasePake2(): Promise<{
        y: Uint8Array;
        verifier: Uint8Array;
    }>;
    sendPasePake3(pasePake3: PasePake3): Promise<Uint8Array>;
}
export {};
