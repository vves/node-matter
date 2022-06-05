import { Packet, Message, MessageCodec } from "../codec/MessageCodec";
import { Fabric } from "../fabric/Fabric";
import { Session } from "./SessionManager";

export class UnsecureSession implements Session {
    decode(packet: Packet): Message {
        return MessageCodec.decodePayload(packet);
    }

    encode(message: Message): Packet {
        return MessageCodec.encodePayload(message);
    }

    getAttestationChallengeKey(): Buffer {
        throw new Error("Not supported on an unsecure session");
    }

    setFabric(fabric: Fabric): void {
        throw new Error("Not supported on an unsecure session");
    }

    getName() {
        return "unsecure";
    }
}