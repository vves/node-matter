"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Time = void 0;
class Time {
}
exports.Time = Time;
Time.get = () => { throw new Error("No provider configured"); };
Time.now = () => Time.get().now();
Time.nowMs = () => Time.get().nowMs();
Time.getTimer = (durationMs, callback) => Time.get().getTimer(durationMs, callback);
Time.getPeriodicTimer = (intervalMs, callback) => Time.get().getPeriodicTimer(intervalMs, callback);
