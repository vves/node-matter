import { Message } from "../../codec/MessageCodec";
import { MessageExchange } from "./MessageExchange";
export interface ProtocolHandler<ContextT> {
    getId(): number;
    onNewExchange(exchange: MessageExchange<ContextT>, message: Message): Promise<void>;
}
