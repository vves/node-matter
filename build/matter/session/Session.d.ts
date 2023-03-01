import { Message, Packet } from "../../codec/MessageCodec";
import { NodeId } from "../common/NodeId";
export declare const DEFAULT_IDLE_RETRANSMISSION_TIMEOUT_MS = 5000;
export declare const DEFAULT_ACTIVE_RETRANSMISSION_TIMEOUT_MS = 300;
export declare const DEFAULT_RETRANSMISSION_RETRIES = 5;
export declare const SLEEPY_ACTIVE_INTERVAL_MS = 300;
export declare const SLEEPY_IDLE_INTERVAL_MS = 300;
export declare const SLEEPY_ACTIVE_THRESHOLD_MS = 4000;
interface MrpParameters {
    idleRetransmissionTimeoutMs: number;
    activeRetransmissionTimeoutMs: number;
    retransmissionRetries: number;
}
export interface Session<T> {
    isSecure(): boolean;
    getName(): string;
    decode(packet: Packet): Message;
    encode(message: Message): Packet;
    getMrpParameters(): MrpParameters;
    getContext(): T;
    getId(): number;
    getPeerSessionId(): number;
    getNodeId(): NodeId | undefined;
    getPeerNodeId(): NodeId | undefined;
    notifyActivity(messageReceived: boolean): void;
    isPeerActive(): boolean;
}
export {};
