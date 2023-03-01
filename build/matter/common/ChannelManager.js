"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelManager = void 0;
const ExchangeManager_1 = require("./ExchangeManager");
class ChannelManager {
    constructor() {
        this.channels = new Map();
    }
    setChannel(fabric, nodeId, channel) {
        this.channels.set(`${fabric.fabricId}/${nodeId}`, channel);
    }
    getChannel(fabric, nodeId) {
        const result = this.channels.get(`${fabric.fabricId}/${nodeId}`);
        if (result === undefined)
            throw new Error(`Can't find a channel to node ${nodeId}`);
        return result;
    }
    getOrCreateChannel(byteArrayChannel, session) {
        if (!session.isSecure())
            return new ExchangeManager_1.MessageChannel(byteArrayChannel, session);
        const secureSession = session;
        const fabric = secureSession.getFabric();
        const nodeId = secureSession.getPeerNodeId();
        if (fabric === undefined)
            return new ExchangeManager_1.MessageChannel(byteArrayChannel, session);
        let result = this.channels.get(`${fabric.fabricId}/${nodeId}`);
        if (result === undefined || result.session.getId() !== session.getId()) {
            result = new ExchangeManager_1.MessageChannel(byteArrayChannel, session);
            this.setChannel(fabric, nodeId, result);
        }
        return result;
    }
}
exports.ChannelManager = ChannelManager;
