"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
const Time_1 = require("../time/Time");
class Cache {
    constructor(generator, expirationMs) {
        this.generator = generator;
        this.expirationMs = expirationMs;
        this.values = new Map();
        this.timestamps = new Map();
        this.periodicTimer = Time_1.Time.getPeriodicTimer(expirationMs, () => this.expire()).start();
    }
    get(...params) {
        const key = params.join(",");
        var value = this.values.get(key);
        if (value === undefined) {
            value = this.generator(...params);
            this.values.set(key, value);
        }
        this.timestamps.set(key, Date.now());
        return value;
    }
    clear() {
        this.values.clear();
        this.timestamps.clear();
    }
    close() {
        this.clear();
        this.periodicTimer.stop();
    }
    expire() {
        const now = Date.now();
        [...this.timestamps.entries()].forEach(([key, timestamp]) => {
            if (now - timestamp < this.expirationMs)
                return;
            this.values.delete(key);
            this.timestamps.delete(key);
        });
    }
}
exports.Cache = Cache;
