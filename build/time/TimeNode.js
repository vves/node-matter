"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeNode = void 0;
const Time_1 = require("./Time");
class TimerNode {
    constructor(intervalMs, callback, periodic) {
        this.intervalMs = intervalMs;
        this.callback = callback;
        this.periodic = periodic;
    }
    start() {
        this.timerId = (this.periodic ? setInterval : setTimeout)(this.callback, this.intervalMs);
        return this;
    }
    stop() {
        (this.periodic ? clearInterval : clearTimeout)(this.timerId);
        return this;
    }
}
class TimeNode extends Time_1.Time {
    now() {
        return new Date();
    }
    nowMs() {
        return this.now().getTime();
    }
    getTimer(durationMs, callback) {
        return new TimerNode(durationMs, callback, false);
    }
    getPeriodicTimer(intervalMs, callback) {
        return new TimerNode(intervalMs, callback, true);
    }
}
exports.TimeNode = TimeNode;
