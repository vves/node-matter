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
exports.UdpInterface = void 0;
const Network_1 = require("./Network");
class UdpInterface {
    constructor(server) {
        this.server = server;
    }
    static create(port, type, address) {
        return __awaiter(this, void 0, void 0, function* () {
            return new UdpInterface(yield Network_1.Network.get().createUdpChannel({ listeningPort: port, type, netInterface: address, listeningAddress: address }));
        });
    }
    openChannel(address, port) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve(new UdpConnection(this.server, address, port));
        });
    }
    onData(listener) {
        return this.server.onData((_netInterface, peerAddress, peerPort, data) => listener(new UdpConnection(this.server, peerAddress, peerPort), data));
    }
}
exports.UdpInterface = UdpInterface;
class UdpConnection {
    constructor(server, peerAddress, peerPort) {
        this.server = server;
        this.peerAddress = peerAddress;
        this.peerPort = peerPort;
    }
    send(data) {
        return this.server.send(this.peerAddress, this.peerPort, data);
    }
    getName() {
        return `udp://${this.peerAddress}:${this.peerPort}`;
    }
}
