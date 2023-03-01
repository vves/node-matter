import { TlvSchema } from "@project-chip/matter.js";
import { MatterDevice } from "../../MatterDevice";
import { SecureSession } from "../../session/SecureSession";
import { Session } from "../../session/Session";
export declare class AttributeServer<T> {
    readonly id: number;
    readonly name: string;
    readonly schema: TlvSchema<T>;
    private readonly validator;
    readonly isWritable: boolean;
    private value;
    private version;
    private readonly matterListeners;
    private readonly listeners;
    constructor(id: number, name: string, schema: TlvSchema<T>, validator: (value: T, name: string) => void, isWritable: boolean, defaultValue: T);
    set(value: T, session?: Session<MatterDevice>): void;
    setLocal(value: T): void;
    get(session?: Session<MatterDevice>): T;
    getWithVersion(session?: Session<MatterDevice>): {
        version: number;
        value: T;
    };
    getLocal(): T;
    addMatterListener(listener: (value: T, version: number) => void): void;
    removeMatterListener(listener: (value: T, version: number) => void): void;
    addListener(listener: (newValue: T, oldValue: T) => void): void;
    removeListener(listener: (newValue: T, oldValue: T) => void): void;
}
export declare class AttributeGetterServer<T> extends AttributeServer<T> {
    readonly getter: (session?: Session<MatterDevice>) => T;
    constructor(id: number, name: string, schema: TlvSchema<T>, validator: (value: T, name: string) => void, isWritable: boolean, defaultValue: T, getter: (session?: Session<MatterDevice>) => T);
    setLocal(value: T): void;
    get(session?: SecureSession<MatterDevice>): T;
}
