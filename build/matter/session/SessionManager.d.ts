import { NodeId } from "../common/NodeId";
import { Fabric } from "../fabric/Fabric";
import { SecureSession } from "./SecureSession";
import { Session } from "./Session";
import { UnsecureSession } from "./UnsecureSession";
import { ByteArray } from "@project-chip/matter.js";
export declare const UNDEFINED_NODE_ID: NodeId;
export declare const UNICAST_UNSECURE_SESSION_ID = 0;
export interface ResumptionRecord {
    sharedSecret: ByteArray;
    resumptionId: ByteArray;
    fabric: Fabric;
    peerNodeId: NodeId;
}
export declare class SessionManager<ContextT> {
    private readonly context;
    private readonly unsecureSession;
    private readonly sessions;
    private nextSessionId;
    private resumptionRecords;
    constructor(context: ContextT);
    createSecureSession(sessionId: number, fabric: Fabric | undefined, peerNodeId: NodeId, peerSessionId: number, sharedSecret: ByteArray, salt: ByteArray, isInitiator: boolean, isResumption: boolean, idleRetransTimeoutMs?: number, activeRetransTimeoutMs?: number): Promise<SecureSession<ContextT>>;
    getNextAvailableSessionId(): number;
    getSession(sessionId: number): Session<ContextT> | undefined;
    getSessionForNode(fabric: Fabric, nodeId: NodeId): Session<ContextT> | undefined;
    getUnsecureSession(): UnsecureSession<ContextT>;
    findResumptionRecordById(resumptionId: ByteArray): ResumptionRecord | undefined;
    findResumptionRecordByNodeId(nodeId: NodeId): ResumptionRecord | undefined;
    saveResumptionRecord(resumptionRecord: ResumptionRecord): void;
}
