import { MessageExchange } from "../../common/MessageExchange";
import { MatterController } from "../../MatterController";
export declare class PaseClient {
    pair(client: MatterController, exchange: MessageExchange<MatterController>, setupPin: number): Promise<import("../SecureSession").SecureSession<MatterController>>;
}
