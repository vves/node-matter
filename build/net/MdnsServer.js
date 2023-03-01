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
exports.MdnsServer = exports.MDNS_BROADCAST_PORT = exports.MDNS_BROADCAST_IPV6 = exports.MDNS_BROADCAST_IPV4 = void 0;
const DnsCodec_1 = require("../codec/DnsCodec");
const Network_1 = require("./Network");
const UdpMulticastServer_1 = require("./UdpMulticastServer");
const Cache_1 = require("../util/Cache");
exports.MDNS_BROADCAST_IPV4 = "224.0.0.251";
exports.MDNS_BROADCAST_IPV6 = "ff02::fb";
exports.MDNS_BROADCAST_PORT = 5353;
class MdnsServer {
    constructor(multicastServer, netInterface) {
        this.multicastServer = multicastServer;
        this.netInterface = netInterface;
        this.network = Network_1.Network.get();
        this.recordsGenerator = () => [];
        this.records = new Cache_1.Cache((multicastInterface) => this.recordsGenerator(multicastInterface), 5 * 60 * 1000);
        multicastServer.onMessage((message, remoteIp, netInterface) => this.handleDnsMessage(message, remoteIp, netInterface));
    }
    static create(netInterface) {
        return __awaiter(this, void 0, void 0, function* () {
            return new MdnsServer(yield UdpMulticastServer_1.UdpMulticastServer.create({
                netInterface: netInterface,
                broadcastAddressIpv4: exports.MDNS_BROADCAST_IPV4,
                broadcastAddressIpv6: exports.MDNS_BROADCAST_IPV6,
                listeningPort: exports.MDNS_BROADCAST_PORT
            }), netInterface);
        });
    }
    handleDnsMessage(messageBytes, remoteIp, netInterface) {
        if (netInterface === undefined)
            return;
        const records = this.records.get(netInterface);
        if (records.length === 0)
            return;
        const message = DnsCodec_1.DnsCodec.decode(messageBytes);
        if (message === undefined)
            return;
        const { transactionId, messageType, queries } = message;
        if (messageType !== 0)
            return;
        const answers = message.queries.flatMap(query => this.queryRecords(query, records));
        if (answers.length === 0)
            return;
        const additionalRecords = records.filter(record => !answers.includes(record));
        this.multicastServer.send(DnsCodec_1.DnsCodec.encode({ transactionId, answers, additionalRecords }), netInterface);
    }
    announce() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(this.getMulticastInterfacesForAnnounce().map(netInterface => {
                const records = this.records.get(netInterface);
                const answers = records.filter(({ recordType }) => recordType === 12);
                const additionalRecords = records.filter(({ recordType }) => recordType !== 12);
                return this.multicastServer.send(DnsCodec_1.DnsCodec.encode({ answers, additionalRecords }), netInterface);
            }));
        });
    }
    setRecordsGenerator(generator) {
        this.records.clear();
        this.recordsGenerator = generator;
    }
    close() {
        this.records.close();
        this.multicastServer.close();
    }
    getMulticastInterfacesForAnnounce() {
        return this.netInterface === undefined ? this.network.getNetInterfaces() : [this.netInterface];
    }
    queryRecords({ name, recordType }, records) {
        if (recordType === 255) {
            return records.filter(record => record.name === name);
        }
        else {
            return records.filter(record => record.name === name && record.recordType === recordType);
        }
    }
}
exports.MdnsServer = MdnsServer;
