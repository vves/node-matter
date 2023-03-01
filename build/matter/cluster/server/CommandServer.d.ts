import { MatterDevice } from "../../MatterDevice";
import { Session } from "../../session/Session";
import { TlvSchema, TlvStream } from "@project-chip/matter.js";
import { Message } from "../../../codec/MessageCodec";
export declare const enum ResultCode {
    Success = 0
}
export declare class CommandServer<RequestT, ResponseT> {
    readonly invokeId: number;
    readonly responseId: number;
    readonly name: string;
    protected readonly requestSchema: TlvSchema<RequestT>;
    protected readonly responseSchema: TlvSchema<ResponseT>;
    protected readonly handler: (request: RequestT, session: Session<MatterDevice>, message: Message) => Promise<ResponseT> | ResponseT;
    constructor(invokeId: number, responseId: number, name: string, requestSchema: TlvSchema<RequestT>, responseSchema: TlvSchema<ResponseT>, handler: (request: RequestT, session: Session<MatterDevice>, message: Message) => Promise<ResponseT> | ResponseT);
    invoke(session: Session<MatterDevice>, args: TlvStream, message: Message): Promise<{
        code: ResultCode;
        responseId: number;
        response: TlvStream;
    }>;
}
