import { Merge } from "../../../util/Type";
import { MatterDevice } from "../../MatterDevice";
import { Session } from "../../session/Session";
import { Cluster, Command, Commands, AttributeJsType, Attributes, Attribute, OptionalAttribute, OptionalCommand, OptionalWritableAttribute, WritableAttribute, GlobalAttributes } from "../Cluster";
import { AttributeServer } from "./AttributeServer";
declare type MandatoryAttributeNames<A extends Attributes> = {
    [K in keyof A]: A[K] extends OptionalAttribute<any> ? never : K;
}[keyof A];
declare type OptionalAttributeNames<A extends Attributes> = {
    [K in keyof A]: A[K] extends OptionalAttribute<any> ? K : never;
}[keyof A];
export declare type AttributeServers<A extends Attributes> = {
    [P in MandatoryAttributeNames<A>]: AttributeServer<AttributeJsType<A[P]>>;
};
export declare type AttributeInitialValues<A extends Attributes> = Merge<Omit<{
    [P in MandatoryAttributeNames<A>]: AttributeJsType<A[P]>;
}, keyof GlobalAttributes<any>>, {
    [P in OptionalAttributeNames<A>]?: AttributeJsType<A[P]>;
}>;
declare type MandatoryCommandNames<C extends Commands> = {
    [K in keyof C]: C[K] extends OptionalCommand<any, any> ? never : K;
}[keyof C];
declare type OptionalCommandNames<C extends Commands> = {
    [K in keyof C]: C[K] extends OptionalCommand<any, any> ? K : never;
}[keyof C];
declare type AttributeGetters<A extends Attributes> = {
    [P in keyof A as `get${Capitalize<string & P>}`]?: (session?: Session<MatterDevice>) => AttributeJsType<A[P]>;
};
declare type CommandHandler<C extends Command<any, any>, A extends AttributeServers<any>> = C extends Command<infer RequestT, infer ResponseT> ? (args: {
    request: RequestT;
    attributes: A;
    session: Session<MatterDevice>;
}) => Promise<ResponseT> : never;
declare type CommandHandlers<T extends Commands, A extends AttributeServers<any>> = Merge<{
    [P in MandatoryCommandNames<T>]: CommandHandler<T[P], A>;
}, {
    [P in OptionalCommandNames<T>]?: CommandHandler<T[P], A>;
}>;
export declare type ClusterServerHandlers<C extends Cluster<any, any, any, any>> = Merge<CommandHandlers<C["commands"], AttributeServers<C["attributes"]>>, AttributeGetters<C["attributes"]>>;
declare type OptionalAttributeConf<T extends Attributes> = {
    [K in OptionalAttributeNames<T>]?: true;
};
declare type MakeAttributeMandatory<A extends Attribute<any>> = A extends OptionalWritableAttribute<infer T> ? WritableAttribute<T> : (A extends OptionalAttribute<infer T> ? Attribute<T> : A);
declare type MakeAttributesMandatory<T extends Attributes, C extends OptionalAttributeConf<T>> = {
    [K in keyof T]: K extends keyof C ? MakeAttributeMandatory<T[K]> : T[K];
};
declare const MakeAttributesMandatory: <T extends Attributes, C extends OptionalAttributeConf<T>>(attributes: T, conf: C) => MakeAttributesMandatory<T, C>;
declare type UseOptionalAttributes<C extends Cluster<any, any, any, any>, A extends OptionalAttributeConf<C["attributes"]>> = Cluster<C["features"], MakeAttributesMandatory<C["attributes"], A>, C["commands"], C["events"]>;
export declare const UseOptionalAttributes: <C extends Cluster<any, any, any, any>, A extends OptionalAttributeConf<C["attributes"]>>(cluster: C, conf: A) => UseOptionalAttributes<C, A>;
export {};
