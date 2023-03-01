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
exports.MdnsScanner = void 0;
const DnsCodec_1 = require("../../codec/DnsCodec");
const UdpMulticastServer_1 = require("../../net/UdpMulticastServer");
const MdnsServer_1 = require("../../net/MdnsServer");
const MdnsConsts_1 = require("./MdnsConsts");
const Promises_1 = require("../../util/Promises");
const Time_1 = require("../../time/Time");
class MdnsScanner {
    constructor(multicastServer) {
        this.multicastServer = multicastServer;
        this.matterDeviceRecords = new Map();
        this.recordWaiters = new Map();
        multicastServer.onMessage((message, remoteIp) => this.handleDnsMessage(message, remoteIp));
        this.periodicTimer = Time_1.Time.getPeriodicTimer(60 * 1000, () => this.expire()).start();
    }
    static create(netInterface) {
        return __awaiter(this, void 0, void 0, function* () {
            return new MdnsScanner(yield UdpMulticastServer_1.UdpMulticastServer.create({
                netInterface: netInterface,
                broadcastAddressIpv4: MdnsServer_1.MDNS_BROADCAST_IPV4,
                broadcastAddressIpv6: MdnsServer_1.MDNS_BROADCAST_IPV6,
                listeningPort: MdnsServer_1.MDNS_BROADCAST_PORT,
            }));
        });
    }
    findDevice({ operationalId }, nodeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const operationalIdString = operationalId.toHex().toUpperCase();
            const deviceMatterQname = (0, MdnsConsts_1.getDeviceMatterQname)(operationalIdString, nodeId.toString());
            const record = this.matterDeviceRecords.get(deviceMatterQname);
            if (record !== undefined)
                return { ip: record.ip, port: record.port };
            const { promise, resolver } = yield (0, Promises_1.getPromiseResolver)();
            const timer = Time_1.Time.getTimer(5 * 1000, () => {
                this.recordWaiters.delete(deviceMatterQname);
                resolver(undefined);
            }).start();
            this.recordWaiters.set(deviceMatterQname, resolver);
            this.multicastServer.send(DnsCodec_1.DnsCodec.encode({ queries: [{ name: deviceMatterQname, recordClass: 1, recordType: 33 }] }));
            const result = yield promise;
            timer.stop();
            return result;
        });
    }
    close() {
        this.multicastServer.close();
        this.periodicTimer.stop();
        [...this.recordWaiters.values()].forEach(waiter => waiter(undefined));
    }
    handleDnsMessage(messageBytes, remoteIp) {
        const message = DnsCodec_1.DnsCodec.decode(messageBytes);
        if (message === undefined)
            return;
        if (message.messageType !== 33792)
            return;
        const answers = [...message.answers, ...message.additionalRecords];
        const srvRecord = answers.find(({ name, recordType }) => recordType === 33 && name.endsWith(MdnsConsts_1.MATTER_SERVICE_QNAME));
        if (srvRecord === undefined)
            return;
        const { name: matterName, ttl, value: { target, port: matterPort } } = srvRecord;
        const aRecord = answers.find(({ name, recordType }) => recordType === 1 && name === target);
        if (aRecord === undefined)
            return;
        const matterIp = aRecord.value;
        const record = { ip: matterIp, port: matterPort, expires: Date.now() + ttl * 1000 };
        this.matterDeviceRecords.set(matterName, record);
        const waiter = this.recordWaiters.get(matterName);
        if (waiter === undefined)
            return;
        waiter({ ip: matterIp, port: matterPort });
        this.recordWaiters.delete(matterName);
    }
    expire() {
        const now = Date.now();
        [...this.matterDeviceRecords.entries()].forEach(([key, { expires }]) => {
            if (now < expires)
                return;
            this.matterDeviceRecords.delete(key);
        });
    }
}
exports.MdnsScanner = MdnsScanner;
