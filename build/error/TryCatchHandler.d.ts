import { ClassExtends } from "../util/Type";
declare type ErrorHandler<T> = (error: Error) => T;
export declare function tryCatch<T>(codeBlock: () => T, errorType: ClassExtends<Error>, fallbackValueOrFunction: ErrorHandler<T> | T): T;
export declare function tryCatchAsync<T>(codeBlock: () => Promise<T>, errorType: ClassExtends<Error>, fallbackValueOrFunction: ErrorHandler<T> | T): Promise<T>;
export {};
