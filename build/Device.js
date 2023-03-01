#!/usr/bin/env node
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
const Singleton_1 = require("./util/Singleton");
const Time_1 = require("./time/Time");
const TimeNode_1 = require("./time/TimeNode");
Time_1.Time.get = (0, Singleton_1.singleton)(() => new TimeNode_1.TimeNode());
const MatterDevice_1 = require("./matter/MatterDevice");
const UdpInterface_1 = require("./net/UdpInterface");
const SecureChannelProtocol_1 = require("./matter/session/secure/SecureChannelProtocol");
const PaseServer_1 = require("./matter/session/secure/PaseServer");
const Crypto_1 = require("./crypto/Crypto");
const CaseServer_1 = require("./matter/session/secure/CaseServer");
const InteractionServer_1 = require("./matter/interaction/InteractionServer");
const BasicInformationCluster_1 = require("./matter/cluster/BasicInformationCluster");
const GeneralCommissioningCluster_1 = require("./matter/cluster/GeneralCommissioningCluster");
const OperationalCredentialsCluster_1 = require("./matter/cluster/OperationalCredentialsCluster");
const DeviceTypes_1 = require("./matter/common/DeviceTypes");
const MdnsBroadcaster_1 = require("./matter/mdns/MdnsBroadcaster");
const Network_1 = require("./net/Network");
const NetworkNode_1 = require("./net/node/NetworkNode");
const CommandLine_1 = require("./util/CommandLine");
const OnOffCluster_1 = require("./matter/cluster/OnOffCluster");
const GeneralCommissioningServer_1 = require("./matter/cluster/server/GeneralCommissioningServer");
const OperationalCredentialsServer_1 = require("./matter/cluster/server/OperationalCredentialsServer");
const MdnsScanner_1 = require("./matter/mdns/MdnsScanner");
const package_json_1 = __importDefault(require("../package.json"));
const Logger_1 = require("./log/Logger");
const VendorId_1 = require("./matter/common/VendorId");
const OnOffServer_1 = require("./matter/cluster/server/OnOffServer");
const matter_js_1 = require("@project-chip/matter.js");
const PairingCode_js_1 = require("./codec/PairingCode.js");
const QrCode_js_1 = require("./codec/QrCode.js");
const NetworkCommissioningCluster_1 = require("./matter/cluster/NetworkCommissioningCluster");
const AdminCommissioningCluster_1 = require("./matter/cluster/AdminCommissioningCluster");
const AdminCommissioningServer_1 = require("./matter/cluster/server/AdminCommissioningServer");
const NetworkCommissioningServer_1 = require("./matter/cluster/server/NetworkCommissioningServer");
const FabricIndex_1 = require("./matter/common/FabricIndex");
const Platform_1 = require("./util/Platform");
const DevicePrivateKey = matter_js_1.ByteArray.fromHex("727F1005CBA47ED7822A9D930943621617CFD3B79D9AF528B801ECF9F1992204");
const DeviceCertificate = matter_js_1.ByteArray.fromHex("308201e83082018fa0030201020208143c9d1689f498f0300a06082a8648ce3d04030230463118301606035504030c0f4d617474657220546573742050414931143012060a2b0601040182a27c02010c044646463131143012060a2b0601040182a27c02020c04383030303020170d3231303632383134323334335a180f39393939313233313233353935395a304b311d301b06035504030c144d6174746572205465737420444143203030303731143012060a2b0601040182a27c02010c044646463131143012060a2b0601040182a27c02020c04383030303059301306072a8648ce3d020106082a8648ce3d0301070342000462e2b6e1baff8d74a6fd8216c4cb67a3363a31e691492792e61aee610261481396725ef95e142686ba98f339b0ff65bc338bec7b9e8be0bdf3b2774982476220a360305e300c0603551d130101ff04023000300e0603551d0f0101ff040403020780301d0603551d0e04160414ee95ad96983a9ea95bcd2b00dc5e671727690383301f0603551d23041830168014af42b7094debd515ec6ecf33b81115225f325288300a06082a8648ce3d040302034700304402202f51cf53bf7777df7318094b9db595eebf2fa881c8c572847b1e689ece654264022029782708ee6b32c7f08ff63dbe618e9a580bb14c183bc288777adf9e2dcff5e6");
const ProductIntermediateCertificate = matter_js_1.ByteArray.fromHex("308201d43082017aa00302010202083e6ce6509ad840cd300a06082a8648ce3d04030230303118301606035504030c0f4d617474657220546573742050414131143012060a2b0601040182a27c02010c04464646313020170d3231303632383134323334335a180f39393939313233313233353935395a30463118301606035504030c0f4d617474657220546573742050414931143012060a2b0601040182a27c02010c044646463131143012060a2b0601040182a27c02020c04383030303059301306072a8648ce3d020106082a8648ce3d0301070342000480ddf11b228f3e31f63bcf5798da14623aebbde82ef378eeadbfb18fe1abce31d08ed4b20604b6ccc6d9b5fab64e7de10cb74be017c9ec1516056d70f2cd0b22a366306430120603551d130101ff040830060101ff020100300e0603551d0f0101ff040403020106301d0603551d0e04160414af42b7094debd515ec6ecf33b81115225f325288301f0603551d230418301680146afd22771f511fecbf1641976710dcdc31a1717e300a06082a8648ce3d040302034800304502210096c9c8cf2e01886005d8f5bc72c07b75fd9a57695ac4911131138bea033ce50302202554943be57d53d6c475f7d23ebfcfc2036cd29ba6393ec7efad8714ab718219");
const CertificateDeclaration = matter_js_1.ByteArray.fromHex("3082021906092a864886f70d010702a082020a30820206020103310d300b06096086480165030402013082017106092a864886f70d010701a08201620482015e152400012501f1ff3602050080050180050280050380050480050580050680050780050880050980050a80050b80050c80050d80050e80050f80051080051180051280051380051480051580051680051780051880051980051a80051b80051c80051d80051e80051f80052080052180052280052380052480052580052680052780052880052980052a80052b80052c80052d80052e80052f80053080053180053280053380053480053580053680053780053880053980053a80053b80053c80053d80053e80053f80054080054180054280054380054480054580054680054780054880054980054a80054b80054c80054d80054e80054f80055080055180055280055380055480055580055680055780055880055980055a80055b80055c80055d80055e80055f80056080056180056280056380182403162c04135a494732303134325a423333303030332d32342405002406002507942624080018317d307b020103801462fa823359acfaa9963e1cfa140addf504f37160300b0609608648016503040201300a06082a8648ce3d04030204473045022024e5d1f47a7d7b0d206a26ef699b7c9757b72d469089de3192e678c745e7f60c022100f8aa2fa711fcb79b97e397ceda667bae464e2bd3ffdfc3cced7aa8ca5f4c1a7c");
Network_1.Network.get = (0, Singleton_1.singleton)(() => new NetworkNode_1.NetworkNode());
const logger = Logger_1.Logger.get("Device");
class Device {
    start(networkInterface) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info(`node-matter@${package_json_1.default.version}`);
            const deviceName = "Matter test device";
            const deviceType = 257;
            const vendorName = "node-matter";
            const passcode = 20202021;
            const discriminator = 3840;
            const vendorId = new VendorId_1.VendorId(0xFFF1);
            const productName = "Matter Test DAC 0007";
            const productId = 0X8000;
            const onOffClusterServer = new InteractionServer_1.ClusterServer(OnOffCluster_1.OnOffCluster, { lightingLevelControl: false }, { onOff: false }, (0, OnOffServer_1.OnOffClusterHandler)());
            onOffClusterServer.attributes.onOff.addListener(on => { var _a; return (_a = (0, CommandLine_1.commandExecutor)(on ? "on" : "off")) === null || _a === void 0 ? void 0 : _a(); });
            const secureChannelProtocol = new SecureChannelProtocol_1.SecureChannelProtocol(yield PaseServer_1.PaseServer.fromPin(passcode, { iterations: 1000, salt: Crypto_1.Crypto.getRandomData(32) }), new CaseServer_1.CaseServer());
            (new MatterDevice_1.MatterDevice(deviceName, deviceType, vendorId, productId, discriminator))
                .addNetInterface(yield UdpInterface_1.UdpInterface.create(5540, "udp4"))
                .addNetInterface(yield UdpInterface_1.UdpInterface.create(5540, "udp6"))
                .addScanner(yield MdnsScanner_1.MdnsScanner.create())
                .addBroadcaster(yield MdnsBroadcaster_1.MdnsBroadcaster.create(networkInterface))
                .addProtocolHandler(secureChannelProtocol)
                .addProtocolHandler(new InteractionServer_1.InteractionServer()
                .addEndpoint(0x00, DeviceTypes_1.DEVICE.ROOT, [
                new InteractionServer_1.ClusterServer(BasicInformationCluster_1.BasicInformationCluster, {}, {
                    dataModelRevision: 1,
                    vendorName,
                    vendorId,
                    productName,
                    productId,
                    nodeLabel: "",
                    hardwareVersion: 0,
                    hardwareVersionString: "0",
                    location: "US",
                    localConfigDisabled: false,
                    softwareVersion: 1,
                    softwareVersionString: "v1",
                    capabilityMinima: {
                        caseSessionsPerFabric: 3,
                        subscriptionsPerFabric: 3,
                    },
                    serialNumber: `node-matter-${package_json_1.default.version}`,
                }, {}),
                new InteractionServer_1.ClusterServer(GeneralCommissioningCluster_1.GeneralCommissioningCluster, {}, {
                    breadcrumb: BigInt(0),
                    commissioningInfo: {
                        failSafeExpiryLengthSeconds: 60,
                        maxCumulativeFailsafeSeconds: 900,
                    },
                    regulatoryConfig: 0,
                    locationCapability: 2,
                    supportsConcurrentConnections: true,
                }, GeneralCommissioningServer_1.GeneralCommissioningClusterHandler),
                new InteractionServer_1.ClusterServer(OperationalCredentialsCluster_1.OperationalCredentialsCluster, {}, {
                    nocs: [],
                    fabrics: [],
                    supportedFabrics: 254,
                    commissionedFabrics: 0,
                    trustedRootCertificates: [],
                    currentFabricIndex: FabricIndex_1.FabricIndex.NO_FABRIC,
                }, (0, OperationalCredentialsServer_1.OperationalCredentialsClusterHandler)({
                    devicePrivateKey: DevicePrivateKey,
                    deviceCertificate: DeviceCertificate,
                    deviceIntermediateCertificate: ProductIntermediateCertificate,
                    certificateDeclaration: CertificateDeclaration,
                })),
                new InteractionServer_1.ClusterServer(NetworkCommissioningCluster_1.NetworkCommissioningCluster, {
                    wifi: false,
                    thread: false,
                    ethernet: true,
                }, {
                    maxNetworks: 1,
                    connectMaxTimeSeconds: 20,
                    interfaceEnabled: true,
                    lastConnectErrorValue: 0,
                    lastNetworkId: Buffer.alloc(32),
                    lastNetworkingStatus: 0,
                    networks: [{ networkId: Buffer.alloc(32), connected: true }],
                    scanMaxTimeSeconds: 5,
                }, (0, NetworkCommissioningServer_1.NetworkCommissioningHandler)()),
                new InteractionServer_1.ClusterServer(AdminCommissioningCluster_1.AdminCommissioningCluster, {
                    basic: true,
                }, {
                    windowStatus: 0,
                    adminFabricIndex: null,
                    adminVendorId: null,
                }, (0, AdminCommissioningServer_1.AdminCommissioningHandler)(secureChannelProtocol))
            ])
                .addEndpoint(0x01, DeviceTypes_1.DEVICE.ON_OFF_LIGHT, [onOffClusterServer]))
                .start();
            logger.info("Listening");
            const qrPairingCode = PairingCode_js_1.QrPairingCodeCodec.encode({
                version: 0,
                vendorId: vendorId.id,
                productId,
                flowType: PairingCode_js_1.CommissionningFlowType.Standard,
                discriminator,
                passcode,
                discoveryCapabilities: PairingCode_js_1.DiscoveryCapabilitiesSchema.encode({
                    ble: false,
                    softAccessPoint: false,
                    onIpNetwork: true,
                }),
            });
            console.log(QrCode_js_1.QrCode.encode(qrPairingCode));
            console.log(`QR Code URL: https://project-chip.github.io/connectedhomeip/qrcode.html?data=${qrPairingCode}`);
            console.log(`Manual pairing code: ${PairingCode_js_1.ManualPairingCodeCodec.encode({ discriminator, passcode })}`);
        });
    }
}
const demo = () => __awaiter(void 0, void 0, void 0, function* () {
    const cli = new Platform_1.Platform();
    const selectedInterface = yield cli.selectInterface();
    new Device().start(selectedInterface);
});
demo();
