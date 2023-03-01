"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onSameNetwork = exports.iPv6ToArray = exports.iPv4ToNumber = exports.isIPv6 = exports.isIPv4 = void 0;
const matter_js_1 = require("@project-chip/matter.js");
function isIPv4(ip) {
    return ip.includes(".");
}
exports.isIPv4 = isIPv4;
function isIPv6(ip) {
    return ip.includes(":");
}
exports.isIPv6 = isIPv6;
function iPv4ToNumber(ip) {
    const dataView = new matter_js_1.ByteArray(4).getDataView();
    const ipParts = ip.split(".");
    for (var i = 0; i < 4; i++) {
        dataView.setUint8(i, parseInt(ipParts[i]));
    }
    return dataView.getUint32(0);
}
exports.iPv4ToNumber = iPv4ToNumber;
function iPv6ToArray(ip) {
    const array = new Uint16Array(8);
    let ipParts = ip.split(":");
    const valueCount = ipParts.filter(value => value !== "").length;
    if (valueCount !== 8) {
        ipParts = ip.replace("::", ":".padEnd((8 - valueCount) * 2 + 1, "0:")).split(":");
    }
    let index = 0;
    ipParts.forEach(part => {
        if (part === "")
            return;
        array[index++] = parseInt(part, 16);
    });
    return array;
}
exports.iPv6ToArray = iPv6ToArray;
function onSameNetwork(ip1, ip2, mask) {
    if (isIPv4(ip1)) {
        if (!isIPv4(ip2) || !isIPv4(mask))
            return false;
        const ip1Number = iPv4ToNumber(ip1);
        const ip2Number = iPv4ToNumber(ip2);
        const maskNumber = iPv4ToNumber(mask);
        return (ip1Number & maskNumber) === (ip2Number & maskNumber);
    }
    else {
        if (isIPv4(ip2) || isIPv4(mask))
            return false;
        const ip1Array = iPv6ToArray(ip1);
        const ip2Array = iPv6ToArray(ip2);
        const maskArray = iPv6ToArray(mask);
        for (let i = 0; i < 16; i++) {
            const mask = maskArray[i];
            if (mask === 0)
                return true;
            if ((ip1Array[i] & mask) !== (ip2Array[i] & mask))
                return false;
        }
    }
}
exports.onSameNetwork = onSameNetwork;
