/// <reference types="node" />
import { KeyPair } from "../../crypto/Crypto";
import { NodeId } from "../common/NodeId";
import { VendorId } from "../common/VendorId";
import { ByteArray } from "@project-chip/matter.js";
import { FabricId } from "../common/FabricId";
import { FabricIndex } from "../common/FabricIndex";
export declare class Fabric {
    readonly fabricIndex: FabricIndex;
    readonly fabricId: FabricId;
    readonly nodeId: NodeId;
    readonly rootNodeId: NodeId;
    readonly operationalId: ByteArray;
    readonly rootPublicKey: ByteArray;
    private readonly keyPair;
    readonly rootVendorId: VendorId;
    private readonly rootCert;
    readonly identityProtectionKey: ByteArray;
    readonly operationalIdentityProtectionKey: ByteArray;
    readonly intermediateCACert: ByteArray | undefined;
    readonly operationalCert: ByteArray;
    label: string;
    constructor(fabricIndex: FabricIndex, fabricId: FabricId, nodeId: NodeId, rootNodeId: NodeId, operationalId: ByteArray, rootPublicKey: ByteArray, keyPair: KeyPair, rootVendorId: VendorId, rootCert: ByteArray, identityProtectionKey: ByteArray, operationalIdentityProtectionKey: ByteArray, intermediateCACert: ByteArray | undefined, operationalCert: ByteArray, label: string);
    getPublicKey(): Uint8Array;
    sign(data: ByteArray): Buffer;
    verifyCredentials(operationalCert: ByteArray, intermediateCACert: ByteArray | undefined): void;
    getDestinationId(nodeId: NodeId, random: ByteArray): Buffer;
}
export declare class FabricBuilder {
    private readonly fabricIndex;
    private keyPair;
    private rootVendorId?;
    private rootCert?;
    private intermediateCACert?;
    private operationalCert?;
    private fabricId?;
    private nodeId?;
    private rootNodeId?;
    private rootPublicKey?;
    private identityProtectionKey?;
    constructor(fabricIndex: FabricIndex);
    getPublicKey(): Uint8Array;
    createCertificateSigningRequest(): Uint8Array;
    setRootCert(rootCert: ByteArray): this;
    setOperationalCert(operationalCert: ByteArray): this;
    setIntermediateCACert(certificate: ByteArray): this;
    setRootVendorId(rootVendorId: VendorId): this;
    setRootNodeId(rootNodeId: NodeId): this;
    setIdentityProtectionKey(key: ByteArray): this;
    build(): Promise<Fabric>;
}
