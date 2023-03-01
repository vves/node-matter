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
exports.Queue = void 0;
const Promises_1 = require("./Promises");
const Stream_1 = require("./Stream");
class Queue {
    constructor() {
        this.queue = new Array();
        this.closed = false;
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            const { promise, resolver, rejecter } = yield (0, Promises_1.getPromiseResolver)();
            if (this.closed)
                throw new Stream_1.EndOfStreamError();
            const data = this.queue.shift();
            if (data !== undefined) {
                return data;
            }
            this.pendingRead = { resolver, rejecter };
            return promise;
        });
    }
    write(data) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.closed)
                throw new Stream_1.EndOfStreamError();
            if (this.pendingRead !== undefined) {
                this.pendingRead.resolver(data);
                this.pendingRead = undefined;
                return;
            }
            this.queue.push(data);
        });
    }
    close() {
        if (this.closed)
            return;
        this.closed = true;
        if (this.pendingRead === undefined)
            return;
        this.pendingRead.rejecter(new Stream_1.EndOfStreamError());
    }
}
exports.Queue = Queue;
