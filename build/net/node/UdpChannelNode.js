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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UdpChannelNode = void 0;
const dgram_1 = __importDefault(require("dgram"));
const Logger_1 = require("../../log/Logger");
const NetworkNode_1 = require("./NetworkNode");
const logger = Logger_1.Logger.get("UdpChannelNode");
function createDgramSocket(address, port, options) {
    const socket = dgram_1.default.createSocket(options);
    return new Promise((resolve, reject) => {
        const handleBindError = (error) => {
            socket.close();
            reject(error);
        };
        socket.on("error", handleBindError);
        socket.bind(port, address, () => {
            socket.removeListener("error", handleBindError);
            socket.on("error", error => logger.error(error));
            resolve(socket);
        });
    });
}
class UdpChannelNode {
    constructor(socket, netInterface) {
        this.socket = socket;
        this.netInterface = netInterface;
    }
    static create({ listeningPort, type, listeningAddress, netInterface }) {
        return __awaiter(this, void 0, void 0, function* () {
            const socket = yield createDgramSocket(listeningAddress, listeningPort, { type, reuseAddr: true });
            if (netInterface !== undefined)
                socket.setMulticastInterface(NetworkNode_1.NetworkNode.getMulticastInterface(netInterface, type === "udp4"));
            return new UdpChannelNode(socket);
        });
    }
    onData(listener) {
        const messageListener = (data, { address, port }) => {
            var _a;
            const netInterface = (_a = this.netInterface) !== null && _a !== void 0 ? _a : NetworkNode_1.NetworkNode.getNetInterfaceForIp(address);
            if (netInterface === undefined)
                return;
            listener(netInterface, address, port, data);
        };
        this.socket.on("message", messageListener);
        return {
            close: () => {
                this.socket.removeListener("message", messageListener);
            }
        };
    }
    send(address, port, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.socket.send(data, port, address, error => {
                    if (error !== null) {
                        reject(error);
                        return;
                    }
                    resolve();
                });
            });
        });
    }
    close() {
        this.socket.close();
    }
}
exports.UdpChannelNode = UdpChannelNode;
