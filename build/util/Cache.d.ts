export declare class Cache<T> {
    private readonly generator;
    private readonly expirationMs;
    private readonly values;
    private readonly timestamps;
    private readonly periodicTimer;
    constructor(generator: (...params: any[]) => T, expirationMs: number);
    get(...params: any[]): T;
    clear(): void;
    close(): void;
    private expire;
}
