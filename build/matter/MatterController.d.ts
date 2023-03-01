import { ResumptionRecord } from "./session/SessionManager";
import { NetInterface } from "../net/NetInterface";
import { InteractionClient } from "./interaction/InteractionClient";
import { Scanner } from "./common/Scanner";
import { Fabric } from "./fabric/Fabric";
import { NodeId } from "./common/NodeId";
import { ByteArray } from "@project-chip/matter.js";
export declare class MatterController {
    private readonly scanner;
    private readonly netInterfaceIpv4;
    private readonly netInterfaceIpv6;
    private readonly certificateManager;
    private readonly fabric;
    static create(scanner: Scanner, netInterfaceIpv4: NetInterface, netInterfaceIpv6: NetInterface): Promise<MatterController>;
    private readonly sessionManager;
    private readonly channelManager;
    private readonly exchangeManager;
    private readonly paseClient;
    private readonly caseClient;
    constructor(scanner: Scanner, netInterfaceIpv4: NetInterface, netInterfaceIpv6: NetInterface, certificateManager: RootCertificateManager, fabric: Fabric);
    commission(commissionAddress: string, commissionPort: number, discriminator: number, setupPin: number): Promise<NodeId>;
    connect(nodeId: NodeId): Promise<InteractionClient>;
    private ensureSuccess;
    getNextAvailableSessionId(): number;
    createSecureSession(sessionId: number, fabric: Fabric | undefined, peerNodeId: NodeId, peerSessionId: number, sharedSecret: ByteArray, salt: ByteArray, isInitiator: boolean, isResumption: boolean, idleRetransTimeoutMs?: number, activeRetransTimeoutMs?: number): Promise<import("./session/SecureSession").SecureSession<this>>;
    getResumptionRecord(resumptionId: ByteArray): ResumptionRecord | undefined;
    findResumptionRecordByNodeId(nodeId: NodeId): ResumptionRecord | undefined;
    saveResumptionRecord(resumptionRecord: ResumptionRecord): void;
    close(): void;
}
declare class RootCertificateManager {
    private readonly rootCertId;
    private readonly rootKeyPair;
    private readonly rootKeyIdentifier;
    private readonly rootCertBytes;
    private nextCertificateId;
    getRootCert(): Uint8Array;
    private generateRootCert;
    generateNoc(publicKey: ByteArray, fabricId: bigint, nodeId: NodeId): Uint8Array;
}
export {};
