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
exports.MatterDevice = void 0;
const SessionManager_1 = require("./session/SessionManager");
const FabricManager_1 = require("./fabric/FabricManager");
const ExchangeManager_1 = require("./common/ExchangeManager");
const Node_1 = require("../util/Node");
const ChannelManager_1 = require("./common/ChannelManager");
(0, Node_1.requireMinNodeVersion)(16);
class MatterDevice {
    constructor(deviceName, deviceType, vendorId, productId, discriminator) {
        this.deviceName = deviceName;
        this.deviceType = deviceType;
        this.vendorId = vendorId;
        this.productId = productId;
        this.discriminator = discriminator;
        this.scanners = new Array();
        this.broadcasters = new Array();
        this.netInterfaces = new Array();
        this.fabricManager = new FabricManager_1.FabricManager();
        this.sessionManager = new SessionManager_1.SessionManager(this);
        this.channelManager = new ChannelManager_1.ChannelManager();
        this.exchangeManager = new ExchangeManager_1.ExchangeManager(this.sessionManager, this.channelManager);
    }
    addScanner(scanner) {
        this.scanners.push(scanner);
        return this;
    }
    addBroadcaster(broadcaster) {
        broadcaster.setCommissionMode(1, this.deviceName, this.deviceType, this.vendorId, this.productId, this.discriminator);
        this.broadcasters.push(broadcaster);
        return this;
    }
    addNetInterface(netInterface) {
        this.exchangeManager.addNetInterface(netInterface);
        this.netInterfaces.push(netInterface);
        return this;
    }
    addProtocolHandler(protocol) {
        this.exchangeManager.addProtocolHandler(protocol);
        return this;
    }
    start() {
        this.broadcasters.forEach(broadcaster => broadcaster.announce());
    }
    getNextAvailableSessionId() {
        return this.sessionManager.getNextAvailableSessionId();
    }
    createSecureSession(sessionId, fabric, peerNodeId, peerSessionId, sharedSecret, salt, isInitiator, isResumption, idleRetransTimeoutMs, activeRetransTimeoutMs) {
        return this.sessionManager.createSecureSession(sessionId, fabric, peerNodeId, peerSessionId, sharedSecret, salt, isInitiator, isResumption, idleRetransTimeoutMs, activeRetransTimeoutMs);
    }
    findFabricFromDestinationId(destinationId, peerRandom) {
        return this.fabricManager.findFabricFromDestinationId(destinationId, peerRandom);
    }
    addFabric(fabric) {
        const fabricIndex = this.fabricManager.addFabric(fabric);
        this.broadcasters.forEach(broadcaster => {
            broadcaster.setFabric(fabric.operationalId, fabric.nodeId);
            broadcaster.announce();
        });
        return fabricIndex;
    }
    removeFabric(fabricIndex) {
        this.fabricManager.removeFabric(fabricIndex);
    }
    initiateExchange(fabric, nodeId, protocolId) {
        return this.exchangeManager.initiateExchange(fabric, nodeId, protocolId);
    }
    findResumptionRecordById(resumptionId) {
        return this.sessionManager.findResumptionRecordById(resumptionId);
    }
    saveResumptionRecord(resumptionRecord) {
        return this.sessionManager.saveResumptionRecord(resumptionRecord);
    }
    armFailSafe() {
        return this.fabricManager.armFailSafe();
    }
    getFabricBuilder() {
        return this.fabricManager.getFabricBuilder();
    }
    getFabrics() {
        return this.fabricManager.getFabrics();
    }
    completeCommission() {
        return this.fabricManager.completeCommission();
    }
    openCommissioningModeWindow(mode, discriminator) {
        this.broadcasters.forEach(broadcaster => {
            broadcaster.setCommissionMode(mode, this.deviceName, this.deviceType, this.vendorId, this.productId, discriminator);
            broadcaster.announce();
        });
    }
    findDevice(fabric, nodeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const matterServer = yield this.scanners[0].findDevice(fabric, nodeId);
            if (matterServer === undefined)
                return undefined;
            const { ip, port } = matterServer;
            const session = this.sessionManager.getSessionForNode(fabric, nodeId);
            if (session === undefined)
                return undefined;
            return { session, channel: yield this.netInterfaces[0].openChannel(ip, port) };
        });
    }
    stop() {
        this.exchangeManager.close();
        this.broadcasters.forEach(broadcaster => broadcaster.close());
    }
}
exports.MatterDevice = MatterDevice;
