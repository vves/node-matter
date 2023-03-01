export declare enum Level {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    FATAL = 4
}
export declare class Logger {
    private readonly name;
    static logFormater: (now: Date, level: Level, logger: string, ...values: any[]) => string;
    static log: (level: Level, formatedLog: string) => void;
    static defaultLogLevel: Level;
    static logLevels: {
        [logger: string]: Level;
    };
    static get(name: string): Logger;
    static toJSON(data: any): string;
    constructor(name: string);
    debug: (...values: any[]) => void;
    info: (...values: any[]) => void;
    warn: (...values: any[]) => void;
    error: (...values: any[]) => void;
    fatal: (...values: any[]) => void;
    private log;
}
