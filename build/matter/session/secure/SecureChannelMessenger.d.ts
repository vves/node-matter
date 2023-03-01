import { MessageExchange } from "../../common/MessageExchange";
import { ByteArray, TlvSchema } from "@project-chip/matter.js";
export declare class SecureChannelMessenger<ContextT> {
    protected readonly exchange: MessageExchange<ContextT>;
    constructor(exchange: MessageExchange<ContextT>);
    nextMessage(expectedMessageType?: number): Promise<import("../../../codec/MessageCodec").Message>;
    nextMessageDecoded<T>(expectedMessageType: number, schema: TlvSchema<T>): Promise<T>;
    waitForSuccess(): Promise<void>;
    send<T>(message: T, type: number, schema: TlvSchema<T>): Promise<Uint8Array>;
    sendError(): Promise<void>;
    sendSuccess(): Promise<void>;
    getChannelName(): string;
    close(): void;
    private sendStatusReport;
    protected throwIfError(messageType: number, payload: ByteArray): void;
}
