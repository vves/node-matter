"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkNode = void 0;
const os_1 = require("os");
const UdpChannelNode_1 = require("./UdpChannelNode");
const Network_1 = require("../Network");
const Ip_js_1 = require("../../util/Ip.js");
const Cache_js_1 = require("../../util/Cache.js");
class NetworkNode extends Network_1.Network {
    static getMulticastInterface(netInterface, ipv4) {
        if (ipv4) {
            const netInterfaceInfo = (0, os_1.networkInterfaces)()[netInterface];
            if (netInterfaceInfo === undefined)
                throw new Error(`Unknown interface: ${netInterface}`);
            for (const { address, family } of netInterfaceInfo) {
                if (family === "IPv4") {
                    return address;
                }
            }
            throw new Error(`No IPv4 addresses on interface: ${netInterface}`);
        }
        else {
            return `::%${netInterface}`;
        }
    }
    static getNetInterfaceForIp(ip) {
        return this.netInterfaces.get(ip);
    }
    static getNetInterfaceForIpInternal(ip) {
        if (ip.indexOf("%") !== -1) {
            return ip.split("%")[1];
        }
        else {
            const interfaces = (0, os_1.networkInterfaces)();
            for (const name in interfaces) {
                const netInterfaces = interfaces[name];
                for (const { address, netmask } of netInterfaces) {
                    if ((0, Ip_js_1.onSameNetwork)(ip, address, netmask)) {
                        return name;
                    }
                }
            }
            return undefined;
        }
    }
    getNetInterfaces() {
        const result = new Array();
        const interfaces = (0, os_1.networkInterfaces)();
        for (const name in interfaces) {
            const netInterfaces = interfaces[name];
            if (netInterfaces.length === 0)
                continue;
            if (netInterfaces[0].internal)
                continue;
            result.push(name);
        }
        return result;
    }
    getIpMac(netInterface) {
        const netInterfaceInfo = (0, os_1.networkInterfaces)()[netInterface];
        if (netInterfaceInfo === undefined)
            return undefined;
        return { mac: netInterfaceInfo[0].mac, ips: netInterfaceInfo.map(({ address }) => address) };
    }
    createUdpChannel(options) {
        return UdpChannelNode_1.UdpChannelNode.create(options);
    }
}
exports.NetworkNode = NetworkNode;
_a = NetworkNode;
NetworkNode.netInterfaces = new Cache_js_1.Cache((ip) => _a.getNetInterfaceForIpInternal(ip), 5 * 60 * 1000);
