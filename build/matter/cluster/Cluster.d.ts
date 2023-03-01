import { Merge } from "../../util/Type";
import { BitSchema, TlvFields, TlvSchema, TypeFromBitSchema, TypeFromFields } from "@project-chip/matter.js";
import { AttributeId } from "../common/AttributeId";
import { EventId } from "../common/EventId";
import { CommandId } from "../common/CommandId";
export declare const enum AccessLevel {
    View = 0,
    Manage = 1,
    Administer = 2
}
export interface Attribute<T> {
    id: number;
    schema: TlvSchema<T>;
    optional: boolean;
    readAcl: AccessLevel;
    writable: boolean;
    persistent: boolean;
    omitChanges: boolean;
    writeAcl?: AccessLevel;
    default?: T;
}
export interface OptionalAttribute<T> extends Attribute<T> {
    optional: true;
}
export interface WritableAttribute<T> extends Attribute<T> {
    writable: true;
}
export interface OptionalWritableAttribute<T> extends OptionalAttribute<T> {
    writable: true;
}
export declare type AttributeJsType<T extends Attribute<any>> = T extends Attribute<infer JsType> ? JsType : never;
interface AttributeOptions<T> {
    persistent?: boolean;
    omitChanges?: boolean;
    default?: T;
    readAcl?: AccessLevel;
    writeAcl?: AccessLevel;
}
export declare const Attribute: <T, V extends T>(id: number, schema: TlvSchema<T>, { persistent, omitChanges, default: conformanceValue, readAcl }?: AttributeOptions<V>) => Attribute<T>;
export declare const OptionalAttribute: <T, V extends T>(id: number, schema: TlvSchema<T>, { persistent, omitChanges, default: conformanceValue, readAcl }?: AttributeOptions<V>) => OptionalAttribute<T>;
export declare const WritableAttribute: <T, V extends T>(id: number, schema: TlvSchema<T>, { persistent, omitChanges, default: conformanceValue, readAcl, writeAcl }?: AttributeOptions<V>) => WritableAttribute<T>;
export declare const OptionalWritableAttribute: <T, V extends T>(id: number, schema: TlvSchema<T>, { persistent, omitChanges, default: conformanceValue, readAcl, writeAcl }?: AttributeOptions<V>) => OptionalWritableAttribute<T>;
export declare const TlvNoArguments: import("@project-chip/matter.js").ObjectSchema<{}>;
export declare const TlvNoResponse: import("@project-chip/matter.js").VoidSchema;
export interface Command<RequestT, ResponseT> {
    optional: boolean;
    requestId: number;
    requestSchema: TlvSchema<RequestT>;
    responseId: number;
    responseSchema: TlvSchema<ResponseT>;
}
export interface OptionalCommand<RequestT, ResponseT> extends Command<RequestT, ResponseT> {
    optional: true;
}
export declare type ResponseType<T extends Command<any, any>> = T extends OptionalCommand<any, infer ResponseT> ? ResponseT | undefined : (T extends Command<any, infer ResponseT> ? ResponseT : never);
export declare type RequestType<T extends Command<any, any>> = T extends Command<infer RequestT, any> ? RequestT : never;
export declare const Command: <RequestT, ResponseT>(requestId: number, requestSchema: TlvSchema<RequestT>, responseId: number, responseSchema: TlvSchema<ResponseT>) => Command<RequestT, ResponseT>;
export declare const OptionalCommand: <RequestT, ResponseT>(requestId: number, requestSchema: TlvSchema<RequestT>, responseId: number, responseSchema: TlvSchema<ResponseT>) => OptionalCommand<RequestT, ResponseT>;
export declare const enum EventPriority {
    Critical = 0,
    Info = 1
}
export interface Event<T> {
    id: number;
    schema: TlvSchema<T>;
    priority: EventPriority;
    optional: boolean;
}
export interface OptionalEvent<T> extends Event<T> {
    optional: true;
}
export declare const Event: <FT extends TlvFields>(id: number, priority: EventPriority, data?: FT) => Event<import("@project-chip/matter.js/dist/dts/util/Type").Merge<{ [K_1 in { [K in keyof FT]: FT[K] extends import("@project-chip/matter.js").OptionalFieldType<any> ? never : K; }[keyof FT]]: FT[K_1] extends import("@project-chip/matter.js").FieldType<infer T> ? T : never; }, { [K_3 in { [K_2 in keyof FT]: FT[K_2] extends import("@project-chip/matter.js").OptionalFieldType<any> ? K_2 : never; }[keyof FT]]?: (FT[K_3] extends import("@project-chip/matter.js").FieldType<infer T> ? T : never) | undefined; }>>;
export declare const OptionalEvent: <FT extends TlvFields>(id: number, priority: EventPriority, data?: FT) => Event<import("@project-chip/matter.js/dist/dts/util/Type").Merge<{ [K_1 in { [K in keyof FT]: FT[K] extends import("@project-chip/matter.js").OptionalFieldType<any> ? never : K; }[keyof FT]]: FT[K_1] extends import("@project-chip/matter.js").FieldType<infer T> ? T : never; }, { [K_3 in { [K_2 in keyof FT]: FT[K_2] extends import("@project-chip/matter.js").OptionalFieldType<any> ? K_2 : never; }[keyof FT]]?: (FT[K_3] extends import("@project-chip/matter.js").FieldType<infer T> ? T : never) | undefined; }>>;
export interface Attributes {
    [key: string]: Attribute<any>;
}
export interface Commands {
    [key: string]: Command<any, any>;
}
export interface Events {
    [key: string]: Event<any>;
}
export declare type GlobalAttributes<F extends BitSchema> = {
    clusterRevision: Attribute<number>;
    featureMap: Attribute<TypeFromBitSchema<F>>;
    attributeList: Attribute<AttributeId[]>;
    eventList: Attribute<EventId[]>;
    acceptedCommandList: Attribute<CommandId[]>;
    generatedCommandList: Attribute<CommandId[]>;
};
export declare const GlobalAttributes: <F extends BitSchema>(features: F) => GlobalAttributes<F>;
export interface Cluster<F extends BitSchema, A extends Attributes, C extends Commands, E extends Events> {
    id: number;
    name: string;
    revision: number;
    features: BitSchema;
    attributes: A;
    commands: C;
    events: E;
}
export declare const Cluster: <F extends BitSchema, A extends Attributes, C extends Commands, E extends Events>({ id, name, revision, features, attributes, commands, events, }: {
    id: number;
    name: string;
    revision: number;
    features?: F | undefined;
    attributes?: A | undefined;
    commands?: C | undefined;
    events?: E | undefined;
}) => Cluster<F, Merge<A, GlobalAttributes<F>>, C, E>;
export {};
