import { MatterError } from "../error/MatterError";
export declare class EndOfStreamError extends MatterError {
}
export interface Stream<T> {
    read(): Promise<T>;
    write(data: T): Promise<void>;
}
