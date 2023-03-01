import { Attribute, Attributes, Command, Commands, AttributeJsType, WritableAttribute, OptionalAttribute, OptionalWritableAttribute, RequestType, ResponseType } from "../Cluster";
declare type SignatureFromCommandSpec<C extends Command<any, any>> = (request: RequestType<C>) => Promise<ResponseType<C>>;
declare type GetterTypeFromSpec<A extends Attribute<any>> = A extends OptionalAttribute<infer T> ? (T | undefined) : AttributeJsType<A>;
declare type AttributeGetters<A extends Attributes> = {
    [P in keyof A as `get${Capitalize<string & P>}`]: () => Promise<GetterTypeFromSpec<A[P]>>;
};
declare type WritableAttributeNames<A extends Attributes> = {
    [K in keyof A]: A[K] extends WritableAttribute<any> ? K : never;
}[keyof A] | {
    [K in keyof A]: A[K] extends OptionalWritableAttribute<any> ? K : never;
}[keyof A];
declare type AttributeSetters<A extends Attributes> = {
    [P in WritableAttributeNames<A> as `set${Capitalize<string & P>}`]: (value: AttributeJsType<A[P]>) => Promise<void>;
};
declare type AttributeSubscribers<A extends Attributes> = {
    [P in keyof A as `subscribe${Capitalize<string & P>}`]: (listener: (value: AttributeJsType<A[P]>, version: number) => void, minIntervalS: number, maxIntervalS: number) => Promise<void>;
};
export declare type ClusterClient<CommandsT extends Commands, AttributesT extends Attributes> = AttributeGetters<AttributesT> & AttributeSetters<AttributesT> & AttributeSubscribers<AttributesT> & {
    [P in keyof CommandsT]: SignatureFromCommandSpec<CommandsT[P]>;
};
export {};
