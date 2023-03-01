import { OperationalCredentialsCluster } from "../OperationalCredentialsCluster";
import { ClusterServerHandlers } from "./ClusterServer";
import { ByteArray } from "@project-chip/matter.js";
interface OperationalCredentialsServerConf {
    devicePrivateKey: ByteArray;
    deviceCertificate: ByteArray;
    deviceIntermediateCertificate: ByteArray;
    certificateDeclaration: ByteArray;
}
export declare const OperationalCredentialsClusterHandler: (conf: OperationalCredentialsServerConf) => ClusterServerHandlers<typeof OperationalCredentialsCluster>;
export {};
