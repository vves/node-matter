import { MatterController } from "../../MatterController";
import { MatterDevice } from "../../MatterDevice";
import { TlvCaseSigma1, TlvCaseSigma2Resume, TlvCaseSigma2, TlvCaseSigma3 } from "./CaseMessages";
import { SecureChannelMessenger } from "./SecureChannelMessenger";
import { TypeFromSchema } from "@project-chip/matter.js";
export declare class CaseServerMessenger extends SecureChannelMessenger<MatterDevice> {
    readSigma1(): Promise<{
        sigma1Bytes: Uint8Array;
        sigma1: {
            sessionId: number;
            random: Uint8Array;
            destinationId: Uint8Array;
            ecdhPublicKey: Uint8Array;
            mrpParams?: {
                idleRetransTimeoutMs?: number | undefined;
                activeRetransTimeoutMs?: number | undefined;
            } | undefined;
            resumptionId?: Uint8Array | undefined;
            resumeMic?: Uint8Array | undefined;
        };
    }>;
    sendSigma2(sigma2: TypeFromSchema<typeof TlvCaseSigma2>): Promise<Uint8Array>;
    sendSigma2Resume(sigma2Resume: TypeFromSchema<typeof TlvCaseSigma2Resume>): Promise<Uint8Array>;
    readSigma3(): Promise<{
        sigma3Bytes: Uint8Array;
        sigma3: {
            encrypted: Uint8Array;
        };
    }>;
}
export declare class CaseClientMessenger extends SecureChannelMessenger<MatterController> {
    sendSigma1(sigma1: TypeFromSchema<typeof TlvCaseSigma1>): Promise<Uint8Array>;
    readSigma2(): Promise<{
        sigma2Bytes: Uint8Array;
        sigma2: {
            encrypted: Uint8Array;
            sessionId: number;
            random: Uint8Array;
            ecdhPublicKey: Uint8Array;
            mrpParams?: {
                idleRetransTimeoutMs?: number | undefined;
                activeRetransTimeoutMs?: number | undefined;
            } | undefined;
        };
        sigma2Resume?: undefined;
    } | {
        sigma2Resume: {
            sessionId: number;
            resumptionId: Uint8Array;
            resumeMic: Uint8Array;
        };
        sigma2Bytes?: undefined;
        sigma2?: undefined;
    }>;
    sendSigma3(sigma3: TypeFromSchema<typeof TlvCaseSigma3>): Promise<Uint8Array>;
}
