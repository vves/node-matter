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
exports.InteractionClient = exports.SubscriptionClient = exports.ClusterClient = void 0;
const String_1 = require("../../util/String");
const Cluster_1 = require("../cluster/Cluster");
const InteractionMessenger_1 = require("./InteractionMessenger");
const InteractionServer_1 = require("./InteractionServer");
function ClusterClient(interactionClient, endpointId, clusterDef) {
    const result = {};
    const { id: clusterId, commands, attributes } = clusterDef;
    for (const attributeName in attributes) {
        const attribute = attributes[attributeName];
        const capitalizedAttributeName = (0, String_1.capitalize)(attributeName);
        result[`get${capitalizedAttributeName}`] = () => __awaiter(this, void 0, void 0, function* () { return interactionClient.get(endpointId, clusterId, attribute); });
        result[`set${capitalizedAttributeName}`] = (value) => __awaiter(this, void 0, void 0, function* () { return interactionClient.set(endpointId, clusterId, attribute, value); });
        result[`subscribe${capitalizedAttributeName}`] = (listener, minIntervalS, maxIntervalS) => __awaiter(this, void 0, void 0, function* () { return interactionClient.subscribe(endpointId, clusterId, attribute, listener, minIntervalS, maxIntervalS); });
    }
    for (const commandName in commands) {
        const { requestId, requestSchema, responseId, responseSchema, optional } = commands[commandName];
        result[commandName] = (request) => __awaiter(this, void 0, void 0, function* () { return interactionClient.invoke(endpointId, clusterId, request, requestId, requestSchema, responseId, responseSchema, optional); });
    }
    return result;
}
exports.ClusterClient = ClusterClient;
class SubscriptionClient {
    constructor(subscriptionListeners) {
        this.subscriptionListeners = subscriptionListeners;
    }
    getId() {
        return InteractionServer_1.INTERACTION_PROTOCOL_ID;
    }
    onNewExchange(exchange) {
        return __awaiter(this, void 0, void 0, function* () {
            const messenger = new InteractionMessenger_1.InteractionClientMessenger(exchange);
            let dataReport = yield messenger.readDataReport();
            const subscriptionId = dataReport.subscriptionId;
            if (subscriptionId === undefined) {
                yield messenger.sendStatus(125);
                throw new Error("Invalid Datareport without Subscription ID");
            }
            const listener = this.subscriptionListeners.get(subscriptionId);
            if (listener === undefined) {
                yield messenger.sendStatus(125);
                throw new Error(`Unknown subscription ID ${subscriptionId}`);
            }
            yield messenger.sendStatus(0);
            listener(dataReport);
        });
    }
}
exports.SubscriptionClient = SubscriptionClient;
class InteractionClient {
    constructor(exchangeManager, channel) {
        this.exchangeManager = exchangeManager;
        this.channel = channel;
        this.subscriptionListeners = new Map();
        this.exchangeManager.addProtocolHandler(new SubscriptionClient(this.subscriptionListeners));
    }
    getAllAttributes() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.withMessenger((messenger) => __awaiter(this, void 0, void 0, function* () {
                const response = yield messenger.sendReadRequest({
                    attributes: [{}],
                    interactionModelRevision: 1,
                    isFabricFiltered: true,
                });
                if (!Array.isArray(response.values)) {
                    return [];
                }
                return response.values.flatMap(({ value: reportValue }) => {
                    if (reportValue === undefined)
                        return [];
                    const { path: { endpointId, clusterId, attributeId }, version, value } = reportValue;
                    if (endpointId === undefined || clusterId === undefined || attributeId === undefined)
                        throw new Error("Invalid response");
                    return { endpointId, clusterId, attributeId, version, value };
                });
            }));
        });
    }
    get(endpointId, clusterId, { id, schema, optional, default: conformanceValue }) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.withMessenger((messenger) => __awaiter(this, void 0, void 0, function* () {
                const response = yield messenger.sendReadRequest({
                    attributes: [{ endpointId, clusterId, attributeId: id }],
                    interactionModelRevision: 1,
                    isFabricFiltered: true,
                });
                let value;
                if (Array.isArray(response.values)) {
                    value = response.values.map(({ value }) => value).find((value) => {
                        if (value === undefined)
                            return false;
                        const { path } = value;
                        return endpointId === path.endpointId && clusterId === path.clusterId && id === path.attributeId;
                    });
                }
                if (value === undefined) {
                    if (optional)
                        return undefined;
                    if (conformanceValue === undefined)
                        throw new Error(`Attribute ${endpointId}/${clusterId}/${id} not found`);
                    return conformanceValue;
                }
                return schema.decodeTlv(value.value);
            }));
        });
    }
    set(endpointId, clusterId, { id, schema, default: conformanceValue }, value) {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error("not implemented");
        });
    }
    subscribe(endpointId, clusterId, { id, schema, default: conformanceValue }, listener, minIntervalFloorSeconds, maxIntervalCeilingSeconds) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.withMessenger((messenger) => __awaiter(this, void 0, void 0, function* () {
                const { report, subscribeResponse: { subscriptionId } } = yield messenger.sendSubscribeRequest({
                    attributeRequests: [{ endpointId, clusterId, attributeId: id }],
                    keepSubscriptions: true,
                    minIntervalFloorSeconds,
                    maxIntervalCeilingSeconds,
                    isFabricFiltered: true,
                });
                const subscriptionListener = (dataReport) => {
                    if (!Array.isArray(dataReport.values)) {
                        return;
                    }
                    const value = dataReport.values.map(({ value }) => value).find((value) => {
                        if (value === undefined)
                            return false;
                        const { path } = value;
                        return endpointId === path.endpointId && clusterId === path.clusterId && id === path.attributeId;
                    });
                    if (value === undefined)
                        return;
                    listener(schema.decodeTlv(value.value), value.version);
                };
                this.subscriptionListeners.set(subscriptionId, subscriptionListener);
                subscriptionListener(report);
                return;
            }));
        });
    }
    invoke(endpointId, clusterId, request, id, requestSchema, responseId, responseSchema, optional) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.withMessenger((messenger) => __awaiter(this, void 0, void 0, function* () {
                const { responses } = yield messenger.sendInvokeCommand({
                    invokes: [
                        { path: { endpointId, clusterId, commandId: id }, args: requestSchema.encodeTlv(request) }
                    ],
                    timedRequest: false,
                    suppressResponse: false,
                    interactionModelRevision: 1,
                });
                if (responses.length === 0)
                    throw new Error("No response received");
                const { response, result } = responses[0];
                if (result !== undefined) {
                    const resultCode = result.result.code;
                    if (resultCode !== 0)
                        throw new Error(`Received non-success result: ${resultCode}`);
                    if (responseSchema !== Cluster_1.TlvNoResponse)
                        throw new Error("A response was expected for this command");
                    return undefined;
                }
                if (response !== undefined) {
                    return responseSchema.decodeTlv(response.response);
                }
                if (optional) {
                    return undefined;
                }
                throw new Error("Received invoke response with no result nor response");
            }));
        });
    }
    withMessenger(invoke) {
        return __awaiter(this, void 0, void 0, function* () {
            const messenger = new InteractionMessenger_1.InteractionClientMessenger(this.exchangeManager.initiateExchangeWithChannel(this.channel, InteractionServer_1.INTERACTION_PROTOCOL_ID));
            try {
                return yield invoke(messenger);
            }
            finally {
                messenger.close();
            }
        });
    }
}
exports.InteractionClient = InteractionClient;
