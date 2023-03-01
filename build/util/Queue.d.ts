import { Stream } from "./Stream";
export declare class Queue<T> implements Stream<T> {
    private readonly queue;
    private pendingRead?;
    private closed;
    read(): Promise<T>;
    write(data: T): Promise<void>;
    close(): void;
}
