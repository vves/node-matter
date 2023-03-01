"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeFake = void 0;
const Promises_1 = require("../util/Promises");
const Time_1 = require("./Time");
class TimerFake {
    constructor(timeFake, durationMs, callback) {
        this.timeFake = timeFake;
        this.durationMs = durationMs;
        this.callback = callback;
    }
    start() {
        this.timeFake.callbackAtTime(this.timeFake.nowMs() + this.durationMs, this.callback);
        return this;
    }
    stop() {
        this.timeFake.removeCallback(this.callback);
        return this;
    }
}
class IntervalFake extends TimerFake {
    constructor(timeFake, durationMs, callback) {
        const intervalCallback = () => __awaiter(this, void 0, void 0, function* () {
            timeFake.callbackAtTime(timeFake.nowMs() + durationMs, intervalCallback);
            yield callback();
        });
        super(timeFake, durationMs, intervalCallback);
    }
}
class TimeFake extends Time_1.Time {
    constructor(timeMs) {
        super();
        this.timeMs = timeMs;
        this.callbacks = new Array();
    }
    now() {
        return new Date(this.timeMs);
    }
    nowMs() {
        return this.timeMs;
    }
    getTimer(durationMs, callback) {
        return new TimerFake(this, durationMs, callback);
    }
    getPeriodicTimer(intervalMs, callback) {
        return new IntervalFake(this, intervalMs, callback);
    }
    advanceTime(ms) {
        return __awaiter(this, void 0, void 0, function* () {
            const newTimeMs = this.timeMs + ms;
            while (true) {
                if (this.callbacks.length === 0)
                    break;
                const { atMs, callback } = this.callbacks[0];
                if (atMs > newTimeMs)
                    break;
                this.callbacks.shift();
                this.timeMs = atMs;
                yield callback();
            }
            this.timeMs = newTimeMs;
        });
    }
    yield() {
        return __awaiter(this, void 0, void 0, function* () {
            const { promise, resolver } = yield (0, Promises_1.getPromiseResolver)();
            resolver();
            yield promise;
        });
    }
    callbackAtTime(atMs, callback) {
        this.callbacks.push({ atMs, callback });
        this.callbacks.sort(({ atMs: atMsA }, { atMs: atMsB }) => atMsA - atMsB);
    }
    removeCallback(callbackToRemove) {
        const index = this.callbacks.findIndex(({ callback }) => callbackToRemove === callback);
        if (index === -1)
            return;
        this.callbacks.splice(index, 1);
    }
}
exports.TimeFake = TimeFake;
