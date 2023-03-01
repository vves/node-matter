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
exports.UdpMulticastServer = void 0;
const Cache_1 = require("../util/Cache");
const Network_1 = require("./Network");
const Ip_1 = require("../util/Ip");
const Logger_1 = require("../log/Logger");
const logger = Logger_1.Logger.get("UdpMulticastServer");
class UdpMulticastServer {
    constructor(network, broadcastAddressIpv4, broadcastAddressIpv6, broadcastPort, serverIpv4, serverIpv6) {
        this.network = network;
        this.broadcastAddressIpv4 = broadcastAddressIpv4;
        this.broadcastAddressIpv6 = broadcastAddressIpv6;
        this.broadcastPort = broadcastPort;
        this.serverIpv4 = serverIpv4;
        this.serverIpv6 = serverIpv6;
        this.broadcastChannels = new Cache_1.Cache((netInterface, iPv4) => this.createBroadcastChannel(netInterface, iPv4), 5 * 60 * 1000);
    }
    static create({ netInterface, broadcastAddressIpv4, broadcastAddressIpv6, listeningPort }) {
        return __awaiter(this, void 0, void 0, function* () {
            const network = Network_1.Network.get();
            return new UdpMulticastServer(network, broadcastAddressIpv4, broadcastAddressIpv6, listeningPort, yield network.createUdpChannel({ type: "udp4", netInterface, listeningPort }), yield network.createUdpChannel({ type: "udp6", netInterface, listeningPort }));
        });
    }
    onMessage(listener) {
        this.serverIpv4.onData((netInterface, peerAddress, _port, message) => listener(message, peerAddress, netInterface));
        this.serverIpv6.onData((netInterface, peerAddress, _port, message) => listener(message, peerAddress, netInterface));
    }
    send(message, netInterface) {
        return __awaiter(this, void 0, void 0, function* () {
            const netInterfaces = netInterface !== undefined ? [netInterface] : this.network.getNetInterfaces();
            yield Promise.all(netInterfaces.map((netInterface) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const { ips } = (_a = this.network.getIpMac(netInterface)) !== null && _a !== void 0 ? _a : { ips: [] };
                yield Promise.all(ips.map((ip) => __awaiter(this, void 0, void 0, function* () {
                    const iPv4 = (0, Ip_1.isIPv4)(ip);
                    try {
                        yield (yield this.broadcastChannels.get(netInterface, iPv4)).send(iPv4 ? this.broadcastAddressIpv4 : this.broadcastAddressIpv6, this.broadcastPort, message);
                    }
                    catch (err) {
                        logger.info(`${netInterface}: ${err.message}`);
                    }
                })));
            })));
        });
    }
    createBroadcastChannel(netInterface, iPv4) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.network.createUdpChannel({ type: iPv4 ? "udp4" : "udp6", listeningPort: this.broadcastPort, netInterface });
        });
    }
    close() {
        this.serverIpv4.close();
        this.serverIpv6.close();
        this.broadcastChannels.close();
    }
}
exports.UdpMulticastServer = UdpMulticastServer;
