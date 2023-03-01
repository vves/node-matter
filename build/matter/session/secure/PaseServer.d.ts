import { ProtocolHandler } from "../../common/ProtocolHandler";
import { MessageExchange } from "../../common/MessageExchange";
import { PbkdfParameters } from "../../../crypto/Spake2p";
import { MatterDevice } from "../../MatterDevice";
import { ByteArray } from "@project-chip/matter.js";
import BN from "bn.js";
export declare class PaseServer implements ProtocolHandler<MatterDevice> {
    private readonly w0;
    private readonly L;
    private readonly pbkdfParameters?;
    static fromPin(setupPinCode: number, pbkdfParameters: PbkdfParameters): Promise<PaseServer>;
    static fromVerificationValue(verificationValue: ByteArray, pbkdfParameters?: PbkdfParameters): PaseServer;
    constructor(w0: BN, L: ByteArray, pbkdfParameters?: PbkdfParameters | undefined);
    getId(): number;
    onNewExchange(exchange: MessageExchange<MatterDevice>): Promise<void>;
    private handlePairingRequest;
}
