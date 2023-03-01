export declare function getPromiseResolver<T>(): Promise<{
    promise: Promise<T>;
    resolver: (value: T) => void;
    rejecter: (reason?: any) => void;
}>;
