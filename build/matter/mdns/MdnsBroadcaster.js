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
exports.MdnsBroadcaster = void 0;
const DnsCodec_1 = require("../../codec/DnsCodec");
const Crypto_1 = require("../../crypto/Crypto");
const MdnsConsts_1 = require("./MdnsConsts");
const MdnsServer_1 = require("../../net/MdnsServer");
const Network_1 = require("../../net/Network");
const Ip_1 = require("../../util/Ip");
const Logger_1 = require("../../log/Logger");
const logger = Logger_1.Logger.get("MdnsBroadcaster");
class MdnsBroadcaster {
    constructor(mdnsServer) {
        this.mdnsServer = mdnsServer;
        this.network = Network_1.Network.get();
    }
    static create(multicastInterface) {
        return __awaiter(this, void 0, void 0, function* () {
            return new MdnsBroadcaster(yield MdnsServer_1.MdnsServer.create(multicastInterface));
        });
    }
    setCommissionMode(mode, deviceName, deviceType, vendorId, productId, discriminator) {
        logger.debug(`announce commissioning mode ${mode} ${deviceName} ${deviceType} ${vendorId.id} ${productId} ${discriminator}`);
        const shortDiscriminator = (discriminator >> 8) & 0x0F;
        const instanceId = Crypto_1.Crypto.getRandomData(8).toHex().toUpperCase();
        const vendorQname = `_V${vendorId.id}._sub.${MdnsConsts_1.MATTER_COMMISSION_SERVICE_QNAME}`;
        const deviceTypeQname = `_T${deviceType}._sub.${MdnsConsts_1.MATTER_COMMISSION_SERVICE_QNAME}`;
        const shortDiscriminatorQname = `_S${shortDiscriminator}._sub.${MdnsConsts_1.MATTER_COMMISSION_SERVICE_QNAME}`;
        const longDiscriminatorQname = `_L${discriminator}._sub.${MdnsConsts_1.MATTER_COMMISSION_SERVICE_QNAME}`;
        const commissionModeQname = `_CM._sub.${MdnsConsts_1.MATTER_COMMISSION_SERVICE_QNAME}`;
        const deviceQname = `${instanceId}.${MdnsConsts_1.MATTER_COMMISSION_SERVICE_QNAME}`;
        this.mdnsServer.setRecordsGenerator(netInterface => {
            const ipMac = this.network.getIpMac(netInterface);
            if (ipMac === undefined)
                return [];
            const { mac, ips } = ipMac;
            const hostname = mac.replace(/:/g, "").toUpperCase() + "0000.local";
            logger.debug(`on IP Addr: ${ips}`);
            logger.debug(`using hostname ${hostname}`);
            const records = [
                (0, DnsCodec_1.PtrRecord)(MdnsConsts_1.SERVICE_DISCOVERY_QNAME, MdnsConsts_1.MATTER_COMMISSION_SERVICE_QNAME),
                (0, DnsCodec_1.PtrRecord)(MdnsConsts_1.SERVICE_DISCOVERY_QNAME, vendorQname),
                (0, DnsCodec_1.PtrRecord)(MdnsConsts_1.SERVICE_DISCOVERY_QNAME, deviceTypeQname),
                (0, DnsCodec_1.PtrRecord)(MdnsConsts_1.SERVICE_DISCOVERY_QNAME, shortDiscriminatorQname),
                (0, DnsCodec_1.PtrRecord)(MdnsConsts_1.SERVICE_DISCOVERY_QNAME, longDiscriminatorQname),
                (0, DnsCodec_1.PtrRecord)(MdnsConsts_1.SERVICE_DISCOVERY_QNAME, commissionModeQname),
                (0, DnsCodec_1.PtrRecord)(MdnsConsts_1.MATTER_COMMISSION_SERVICE_QNAME, deviceQname),
                (0, DnsCodec_1.PtrRecord)(vendorQname, deviceQname),
                (0, DnsCodec_1.PtrRecord)(deviceTypeQname, deviceQname),
                (0, DnsCodec_1.PtrRecord)(shortDiscriminatorQname, deviceQname),
                (0, DnsCodec_1.PtrRecord)(longDiscriminatorQname, deviceQname),
                (0, DnsCodec_1.PtrRecord)(commissionModeQname, deviceQname),
                (0, DnsCodec_1.SrvRecord)(deviceQname, { priority: 0, weight: 0, port: 5540, target: hostname }),
                (0, DnsCodec_1.TxtRecord)(deviceQname, [
                    `VP=${vendorId.id}+${productId}`,
                    `DT=${deviceType}`,
                    `DN=${deviceName}`,
                    "SII=5000",
                    "SAI=300",
                    "T=1",
                    `D=${discriminator}`,
                    `CM=${mode}`,
                    "PH=33",
                    "PI=",
                ]),
            ];
            ips.forEach(ip => {
                if ((0, Ip_1.isIPv4)(ip)) {
                    records.push((0, DnsCodec_1.ARecord)(hostname, ip));
                }
                else {
                    records.push((0, DnsCodec_1.AAAARecord)(hostname, ip));
                }
            });
            return records;
        });
    }
    setFabric(operationalId, nodeId) {
        const operationalIdString = operationalId.toHex().toUpperCase();
        const fabricQname = (0, MdnsConsts_1.getFabricQname)(operationalIdString);
        const deviceMatterQname = (0, MdnsConsts_1.getDeviceMatterQname)(operationalIdString, nodeId.toString());
        logger.debug(`Set fabric ${operationalId.toHex()} ${nodeId.id}: ${deviceMatterQname} for announcement`);
        this.mdnsServer.setRecordsGenerator(netInterface => {
            const ipMac = this.network.getIpMac(netInterface);
            if (ipMac === undefined)
                return [];
            const { mac, ips } = ipMac;
            const hostname = mac.replace(/:/g, "").toUpperCase() + "0000.local";
            const records = [
                (0, DnsCodec_1.PtrRecord)(MdnsConsts_1.SERVICE_DISCOVERY_QNAME, MdnsConsts_1.MATTER_SERVICE_QNAME),
                (0, DnsCodec_1.PtrRecord)(MdnsConsts_1.SERVICE_DISCOVERY_QNAME, fabricQname),
                (0, DnsCodec_1.PtrRecord)(MdnsConsts_1.MATTER_SERVICE_QNAME, deviceMatterQname),
                (0, DnsCodec_1.PtrRecord)(fabricQname, deviceMatterQname),
                (0, DnsCodec_1.SrvRecord)(deviceMatterQname, { priority: 0, weight: 0, port: 5540, target: hostname }),
                (0, DnsCodec_1.TxtRecord)(deviceMatterQname, ["SII=5000", "SAI=300", "T=1"]),
            ];
            ips.forEach(ip => {
                if ((0, Ip_1.isIPv4)(ip)) {
                    records.push((0, DnsCodec_1.ARecord)(hostname, ip));
                }
                else {
                    if (ip.startsWith('fe80::')) {
                        records.push((0, DnsCodec_1.AAAARecord)(hostname, ip));
                    }
                }
            });
            return records;
        });
    }
    announce() {
        this.mdnsServer.announce()
            .catch(error => logger.error(error));
    }
    close() {
        this.mdnsServer.close();
    }
}
exports.MdnsBroadcaster = MdnsBroadcaster;
