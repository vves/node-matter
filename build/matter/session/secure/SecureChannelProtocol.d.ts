import { Message } from "../../../codec/MessageCodec";
import { ProtocolHandler } from "../../common/ProtocolHandler";
import { MessageExchange } from "../../common/MessageExchange";
import { CaseServer } from "./CaseServer";
import { PaseServer } from "./PaseServer";
import { MatterDevice } from "../../MatterDevice";
export declare class SecureChannelProtocol implements ProtocolHandler<MatterDevice> {
    private paseCommissioner;
    private readonly caseCommissioner;
    constructor(paseCommissioner: PaseServer, caseCommissioner: CaseServer);
    getId(): number;
    updatePaseCommissioner(paseServer: PaseServer): void;
    onNewExchange(exchange: MessageExchange<MatterDevice>, message: Message): Promise<void>;
    static isStandaloneAck(protocolId: number, messageType: number): boolean;
}
