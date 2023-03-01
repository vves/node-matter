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
exports.SimulatedNetwork = exports.FAKE_INTERFACE_NAME = void 0;
const Singleton_1 = require("../../util/Singleton");
const Logger_1 = require("../../log/Logger");
const logger = Logger_1.Logger.get("SimulatedNetwork");
exports.FAKE_INTERFACE_NAME = "fakeInterface";
class SimulatedNetwork {
    constructor() {
        this.listenersMap = new Map();
    }
    onUdpData(address, port, listener) {
        const ipPort = `${address !== null && address !== void 0 ? address : "*"}:${port}`;
        let listeners = this.listenersMap.get(ipPort);
        if (listeners === undefined) {
            listeners = new Array();
            this.listenersMap.set(ipPort, listeners);
        }
        listeners.push(listener);
        return {
            close: () => this.offUdpData(address, port, listener),
        };
    }
    offUdpData(address, port, listenerToRemove) {
        const ipPort = `${address !== null && address !== void 0 ? address : "*"}:${port}`;
        const listeners = this.listenersMap.get(ipPort);
        if (listeners === undefined)
            return;
        const newListeners = listeners.filter(listener => listener !== listenerToRemove);
        if (newListeners.length === 0) {
            this.listenersMap.delete(ipPort);
            return;
        }
        this.listenersMap.set(ipPort, newListeners);
    }
    sendUdp(localAddress, localPort, remoteAddress, remotePort, data) {
        return __awaiter(this, void 0, void 0, function* () {
            [`${remoteAddress}:${remotePort}`, `*:${remotePort}`].forEach(ipPort => {
                var _a;
                return (_a = this.listenersMap.get(ipPort)) === null || _a === void 0 ? void 0 : _a.forEach(listener => {
                    try {
                        listener(exports.FAKE_INTERFACE_NAME, localAddress, localPort, data);
                    }
                    catch (error) {
                        logger.error(error);
                    }
                });
            });
        });
    }
}
exports.SimulatedNetwork = SimulatedNetwork;
SimulatedNetwork.get = (0, Singleton_1.singleton)(() => new SimulatedNetwork());
