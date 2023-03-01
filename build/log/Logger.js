"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.Level = void 0;
const matter_js_1 = require("@project-chip/matter.js");
const Time_1 = require("../time/Time");
var Level;
(function (Level) {
    Level[Level["DEBUG"] = 0] = "DEBUG";
    Level[Level["INFO"] = 1] = "INFO";
    Level[Level["WARN"] = 2] = "WARN";
    Level[Level["ERROR"] = 3] = "ERROR";
    Level[Level["FATAL"] = 4] = "FATAL";
})(Level = exports.Level || (exports.Level = {}));
function logFormater(now, level, logger, values) {
    const formattedNow = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")} ${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}.${now.getMilliseconds().toString().padStart(3, "0")}`;
    const formattedValues = values.map(value => {
        if (value instanceof matter_js_1.ByteArray) {
            return value.toHex();
        }
        else if (value instanceof Error) {
            return value.stack;
        }
        return value.toString();
    });
    return `${formattedNow} ${Level[level]} ${logger} ${formattedValues.join(" ")}`;
}
function consoleLogger(level, formatedLog) {
    switch (level) {
        case Level.DEBUG:
            console.debug(formatedLog);
            break;
        case Level.INFO:
            console.info(formatedLog);
            break;
        case Level.WARN:
            console.warn(formatedLog);
            break;
        case Level.ERROR:
            console.error(formatedLog);
            break;
        case Level.FATAL:
            console.error(formatedLog);
            break;
    }
}
class Logger {
    constructor(name) {
        this.name = name;
        this.debug = (...values) => this.log(Level.DEBUG, values);
        this.info = (...values) => this.log(Level.INFO, values);
        this.warn = (...values) => this.log(Level.WARN, values);
        this.error = (...values) => this.log(Level.ERROR, values);
        this.fatal = (...values) => this.log(Level.FATAL, values);
    }
    static get(name) {
        return new Logger(name);
    }
    static toJSON(data) {
        return JSON.stringify(data, (_, v) => typeof v === 'bigint' ? v.toString() : v);
    }
    log(level, values) {
        var _a;
        if (level < ((_a = Logger.logLevels[this.name]) !== null && _a !== void 0 ? _a : Logger.defaultLogLevel))
            return;
        Logger.log(level, Logger.logFormater(Time_1.Time.now(), level, this.name, values));
    }
}
exports.Logger = Logger;
Logger.logFormater = logFormater;
Logger.log = consoleLogger;
Logger.defaultLogLevel = Level.DEBUG;
Logger.logLevels = {};
