import { Fabric } from "../../fabric/Fabric";
import { MessageExchange } from "../../common/MessageExchange";
import { MatterController } from "../../MatterController";
import { NodeId } from "../../common/NodeId";
export declare class CaseClient {
    constructor();
    pair(client: MatterController, exchange: MessageExchange<MatterController>, fabric: Fabric, peerNodeId: NodeId): Promise<import("../SecureSession").SecureSession<MatterController>>;
}
