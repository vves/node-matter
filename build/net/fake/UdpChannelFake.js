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
exports.UdpChannelFake = void 0;
const SimulatedNetwork_1 = require("./SimulatedNetwork");
const Ip_1 = require("../../util/Ip");
class UdpChannelFake {
    constructor(localAddress, listeningAddress, listeningPort) {
        this.localAddress = localAddress;
        this.listeningAddress = listeningAddress;
        this.listeningPort = listeningPort;
        this.netListeners = new Array();
        this.simulatedNetwork = SimulatedNetwork_1.SimulatedNetwork.get();
    }
    static create(network, { listeningAddress, listeningPort, netInterface, type }) {
        return __awaiter(this, void 0, void 0, function* () {
            const { ips } = network.getIpMac(netInterface !== null && netInterface !== void 0 ? netInterface : SimulatedNetwork_1.FAKE_INTERFACE_NAME);
            const ipv4 = type === "udp4";
            const localAddress = ips.filter(ip => (0, Ip_1.isIPv4)(ip) || !ipv4)[0];
            if (localAddress === undefined)
                throw new Error("No matching IP on the specified interface");
            return new UdpChannelFake(localAddress, listeningAddress, listeningPort);
        });
    }
    onData(listener) {
        const netListener = this.simulatedNetwork.onUdpData(this.listeningAddress, this.listeningPort, listener);
        this.netListeners.push(netListener);
        return netListener;
    }
    send(address, port, data) {
        return __awaiter(this, void 0, void 0, function* () {
            this.simulatedNetwork.sendUdp(this.localAddress, this.listeningPort, address, port, data);
        });
    }
    close() {
        this.netListeners.forEach(netListener => netListener.close());
        this.netListeners.length = 0;
    }
}
exports.UdpChannelFake = UdpChannelFake;
