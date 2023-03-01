import { Time, Timer, TimerCallback } from "./Time";
export declare class TimeFake extends Time {
    private timeMs;
    private readonly callbacks;
    constructor(timeMs: number);
    now(): Date;
    nowMs(): number;
    getTimer(durationMs: number, callback: TimerCallback): Timer;
    getPeriodicTimer(intervalMs: number, callback: TimerCallback): Timer;
    advanceTime(ms: number): Promise<void>;
    yield(): Promise<void>;
    callbackAtTime(atMs: number, callback: TimerCallback): void;
    removeCallback(callbackToRemove: TimerCallback): void;
}
