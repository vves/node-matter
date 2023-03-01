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
exports.SubscriptionHandler = void 0;
const InteractionMessenger_1 = require("./InteractionMessenger");
const InteractionServer_1 = require("./InteractionServer");
const Time_1 = require("../../time/Time");
const Logger_1 = require("../../log/Logger");
const logger = Logger_1.Logger.get("SubscriptionHandler");
const SUBSCRIPTION_MAX_INTERVAL_PUBLISHER_LIMIT_MS = 1000 * 60 * 60;
class SubscriptionHandler {
    constructor(subscriptionId, server, fabric, peerNodeId, attributes, minIntervalFloor, maxIntervalCeiling) {
        this.subscriptionId = subscriptionId;
        this.server = server;
        this.fabric = fabric;
        this.peerNodeId = peerNodeId;
        this.attributes = attributes;
        this.lastUpdateTimeMs = 0;
        this.outstandingAttributeUpdates = new Map();
        this.attributeListeners = new Map();
        this.sendUpdatesActivated = false;
        this.minIntervalFloorMs = minIntervalFloor * 1000;
        this.maxIntervalCeilingMs = maxIntervalCeiling * 1000;
        const halfMaxIntervalCeilingMs = (Math.max(SUBSCRIPTION_MAX_INTERVAL_PUBLISHER_LIMIT_MS, this.maxIntervalCeilingMs) - this.minIntervalFloorMs) / 2;
        this.maxInterval = Math.floor(this.minIntervalFloorMs + halfMaxIntervalCeilingMs + halfMaxIntervalCeilingMs * Math.random());
        this.sendInterval = Math.floor(this.maxInterval / 2);
        this.updateTimer = Time_1.Time.getTimer(this.sendInterval, () => this.sendUpdate());
        attributes.forEach(({ path, attribute }) => {
            const listener = (value, version) => this.attributeChangeListener(path, attribute.schema, version, value);
            this.attributeListeners.set((0, InteractionServer_1.attributePathToId)(path), listener);
            attribute.addMatterListener(listener);
        });
    }
    getMaxInterval() {
        return Math.ceil(this.maxInterval / 1000);
    }
    activateSendingUpdates() {
        this.sendUpdatesActivated = true;
        if (this.outstandingAttributeUpdates.size > 0) {
            this.sendUpdate();
        }
        else {
            this.updateTimer = Time_1.Time.getTimer(this.sendInterval, () => this.sendUpdate()).start();
        }
    }
    sendUpdate() {
        return __awaiter(this, void 0, void 0, function* () {
            this.updateTimer.stop();
            const now = Time_1.Time.nowMs();
            const timeSinceLastUpdateMs = now - this.lastUpdateTimeMs;
            if (timeSinceLastUpdateMs < this.minIntervalFloorMs) {
                this.updateTimer = Time_1.Time.getTimer(this.minIntervalFloorMs - timeSinceLastUpdateMs, () => this.sendUpdate()).start();
                return;
            }
            if (!this.sendUpdatesActivated) {
                return;
            }
            const updatesToSend = Array.from(this.outstandingAttributeUpdates.values());
            this.outstandingAttributeUpdates.clear();
            this.lastUpdateTimeMs = now;
            yield this.sendUpdateMessage(updatesToSend);
            this.updateTimer = Time_1.Time.getTimer(this.sendInterval, () => this.sendUpdate()).start();
        });
    }
    sendInitialReport(messenger, session) {
        return __awaiter(this, void 0, void 0, function* () {
            this.updateTimer.stop();
            const values = this.attributes.map(({ path, attribute }) => {
                const { value, version } = attribute.getWithVersion(session);
                return { path, value, version, schema: attribute.schema };
            }).filter(({ value }) => value !== undefined);
            this.lastUpdateTimeMs = Time_1.Time.nowMs();
            yield messenger.sendDataReport({
                suppressResponse: false,
                subscriptionId: this.subscriptionId,
                interactionModelRevision: 1,
                values: values.map(({ path, schema, value, version }) => ({
                    value: {
                        path,
                        version,
                        value: schema.encodeTlv(value),
                    },
                })),
            });
            yield messenger.waitForSuccess();
        });
    }
    attributeChangeListener(path, schema, version, value) {
        return __awaiter(this, void 0, void 0, function* () {
            this.outstandingAttributeUpdates.set((0, InteractionServer_1.attributePathToId)(path), { path, schema, version, value });
            yield this.sendUpdate();
        });
    }
    cancel() {
        this.sendUpdatesActivated = false;
        this.attributes.forEach(({ path, attribute }) => {
            const pathId = (0, InteractionServer_1.attributePathToId)(path);
            attribute.removeMatterListener(this.attributeListeners.get(pathId));
            this.attributeListeners.delete(pathId);
        });
        this.updateTimer.stop();
    }
    sendUpdateMessage(values) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.debug(`Sending subscription update message for ID ${this.subscriptionId} with ${values.length} values`);
            const exchange = this.server.initiateExchange(this.fabric, this.peerNodeId, InteractionServer_1.INTERACTION_PROTOCOL_ID);
            if (exchange === undefined)
                return;
            logger.debug(`Sending subscription changes for ID ${this.subscriptionId}: ${Logger_1.Logger.toJSON(values)}`);
            const messenger = new InteractionMessenger_1.InteractionServerMessenger(exchange);
            yield messenger.sendDataReport({
                suppressResponse: !values.length,
                subscriptionId: this.subscriptionId,
                interactionModelRevision: 1,
                values: values.map(({ path, schema, value, version }) => ({
                    value: {
                        path,
                        version,
                        value: schema.encodeTlv(value),
                    },
                })),
            });
            if (values.length) {
                yield messenger.waitForSuccess();
            }
            messenger.close();
        });
    }
}
exports.SubscriptionHandler = SubscriptionHandler;
