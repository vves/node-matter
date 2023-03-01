"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkFake = void 0;
const Network_1 = require("../Network");
const UdpChannelFake_1 = require("./UdpChannelFake");
const SimulatedNetwork_1 = require("./SimulatedNetwork");
class NetworkFake extends Network_1.Network {
    constructor(mac, ips) {
        super();
        this.mac = mac;
        this.ips = ips;
    }
    getNetInterfaces() {
        return [SimulatedNetwork_1.FAKE_INTERFACE_NAME];
    }
    getIpMac(_netInterface) {
        return { mac: this.mac, ips: this.ips };
    }
    createUdpChannel(options) {
        return UdpChannelFake_1.UdpChannelFake.create(this, options);
    }
}
exports.NetworkFake = NetworkFake;
