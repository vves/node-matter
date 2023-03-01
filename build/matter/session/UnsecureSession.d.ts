import { Packet, Message } from "../../codec/MessageCodec";
import { Fabric } from "../fabric/Fabric";
import { Session } from "./Session";
import { ByteArray } from "@project-chip/matter.js";
import { NodeId } from "../common/NodeId";
export declare class UnsecureSession<T> implements Session<T> {
    private readonly context;
    private readonly initiatorNodeId;
    constructor(context: T);
    isSecure(): boolean;
    notifyActivity(messageReceived: boolean): void;
    isPeerActive(): boolean;
    decode(packet: Packet): Message;
    encode(message: Message): Packet;
    getAttestationChallengeKey(): ByteArray;
    setFabric(fabric: Fabric): void;
    getName(): string;
    getMrpParameters(): {
        idleRetransmissionTimeoutMs: number;
        activeRetransmissionTimeoutMs: number;
        retransmissionRetries: number;
    };
    getContext(): T;
    getId(): number;
    getPeerSessionId(): number;
    getNodeId(): NodeId;
    getPeerNodeId(): undefined;
}
