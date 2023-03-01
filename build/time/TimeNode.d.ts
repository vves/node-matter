import { Time, Timer, TimerCallback } from "./Time";
export declare class TimeNode extends Time {
    now(): Date;
    nowMs(): number;
    getTimer(durationMs: number, callback: TimerCallback): Timer;
    getPeriodicTimer(intervalMs: number, callback: TimerCallback): Timer;
}
