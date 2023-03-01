export declare type Merge<A, B> = A & B extends infer AB ? {
    [K in keyof AB]: AB[K];
} : never;
export declare const Merge: <A, B>(a: A, b: B) => Merge<A, B>;
export declare type ClassExtends<C> = {
    new (...args: any[]): C;
};
