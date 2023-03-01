import { MatterDevice } from "../../MatterDevice";
import { ProtocolHandler } from "../../common/ProtocolHandler";
import { MessageExchange } from "../../common/MessageExchange";
export declare class CaseServer implements ProtocolHandler<MatterDevice> {
    onNewExchange(exchange: MessageExchange<MatterDevice>): Promise<void>;
    getId(): number;
    private handleSigma1;
}
