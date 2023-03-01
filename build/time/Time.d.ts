export declare type TimerCallback = () => Promise<any> | any;
export declare abstract class Time {
    static get: () => Time;
    abstract now(): Date;
    static readonly now: () => Date;
    abstract nowMs(): number;
    static readonly nowMs: () => number;
    abstract getTimer(durationMs: number, callback: TimerCallback): Timer;
    static readonly getTimer: (durationMs: number, callback: TimerCallback) => Timer;
    abstract getPeriodicTimer(intervalMs: number, callback: TimerCallback): Timer;
    static readonly getPeriodicTimer: (intervalMs: number, callback: TimerCallback) => Timer;
}
export interface Timer {
    start(): Timer;
    stop(): Timer;
}
