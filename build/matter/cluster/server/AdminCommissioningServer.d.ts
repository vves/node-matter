import { SecureChannelProtocol } from "../../session/secure/SecureChannelProtocol";
import { AdminCommissioningCluster } from "../AdminCommissioningCluster";
import { ClusterServerHandlers } from "./ClusterServer";
export declare const AdminCommissioningHandler: (secureChannelProtocol: SecureChannelProtocol) => ClusterServerHandlers<typeof AdminCommissioningCluster>;
