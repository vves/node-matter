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
exports.InteractionServer = exports.attributePathToId = exports.commandPathToId = exports.ClusterServer = exports.INTERACTION_PROTOCOL_ID = void 0;
const InteractionMessenger_1 = require("./InteractionMessenger");
const CommandServer_1 = require("../cluster/server/CommandServer");
const DescriptorCluster_1 = require("../cluster/DescriptorCluster");
const AttributeServer_1 = require("../cluster/server/AttributeServer");
const SubscriptionHandler_1 = require("./SubscriptionHandler");
const Logger_1 = require("../../log/Logger");
const DeviceTypeId_1 = require("../common/DeviceTypeId");
const ClusterId_1 = require("../common/ClusterId");
const EndpointNumber_1 = require("../common/EndpointNumber");
const String_1 = require("../../util/String");
const InteractionMessages_1 = require("./InteractionMessages");
const Crypto_1 = require("../../crypto/Crypto");
exports.INTERACTION_PROTOCOL_ID = 0x0001;
const logger = Logger_1.Logger.get("InteractionProtocol");
class ClusterServer {
    constructor(clusterDef, features, attributesInitialValues, handlers) {
        this.attributes = {};
        this.commands = new Array();
        const { id, name, attributes: attributeDefs, commands: commandDefs } = clusterDef;
        this.id = id;
        this.name = name;
        attributesInitialValues = Object.assign(Object.assign({}, attributesInitialValues), { clusterRevision: clusterDef.revision, featureMap: features });
        for (const name in attributesInitialValues) {
            let { id, schema, writable } = attributeDefs[name];
            const validator = typeof schema.validate === 'function' ? schema.validate.bind(schema) : undefined;
            const getter = handlers[`get${(0, String_1.capitalize)(name)}`];
            if (getter === undefined) {
                this.attributes[name] = new AttributeServer_1.AttributeServer(id, name, schema, validator !== null && validator !== void 0 ? validator : (() => { }), writable, attributesInitialValues[name]);
            }
            else {
                this.attributes[name] = new AttributeServer_1.AttributeGetterServer(id, name, schema, validator !== null && validator !== void 0 ? validator : (() => { }), writable, attributesInitialValues[name], getter);
            }
        }
        for (const name in commandDefs) {
            const handler = handlers[name];
            if (handler === undefined)
                continue;
            const { requestId, requestSchema, responseId, responseSchema } = commandDefs[name];
            this.commands.push(new CommandServer_1.CommandServer(requestId, responseId, name, requestSchema, responseSchema, (request, session, message) => handler({ request, attributes: this.attributes, session, message })));
        }
    }
}
exports.ClusterServer = ClusterServer;
function commandPathToId({ endpointId, clusterId, commandId }) {
    return `${endpointId}/${clusterId}/${commandId}`;
}
exports.commandPathToId = commandPathToId;
function attributePathToId({ endpointId, clusterId, attributeId }) {
    return `${endpointId}/${clusterId}/${attributeId}`;
}
exports.attributePathToId = attributePathToId;
function toHex(value) {
    return value === undefined ? "*" : `0x${value.toString(16)}`;
}
class InteractionServer {
    constructor() {
        this.endpoints = new Map();
        this.attributes = new Map();
        this.attributePaths = new Array();
        this.commands = new Map();
        this.commandPaths = new Array();
        this.nextSubscriptionId = Crypto_1.Crypto.getRandomUInt32();
    }
    getId() {
        return exports.INTERACTION_PROTOCOL_ID;
    }
    addEndpoint(endpointId, device, clusters) {
        const descriptorCluster = new ClusterServer(DescriptorCluster_1.DescriptorCluster, {}, {
            deviceTypeList: [{ revision: 1, type: new DeviceTypeId_1.DeviceTypeId(device.code) }],
            serverList: [],
            clientList: [],
            partsList: [],
        }, {});
        clusters.push(descriptorCluster);
        descriptorCluster.attributes.serverList.setLocal(clusters.map(({ id }) => new ClusterId_1.ClusterId(id)));
        const clusterMap = new Map();
        clusters.forEach(cluster => {
            const { id: clusterId, attributes, commands } = cluster;
            clusterMap.set(clusterId, cluster);
            for (const name in attributes) {
                const attribute = attributes[name];
                const path = { endpointId, clusterId, attributeId: attribute.id };
                this.attributes.set(attributePathToId(path), attribute);
                this.attributePaths.push(path);
            }
            commands.forEach(command => {
                const path = { endpointId, clusterId, commandId: command.invokeId };
                this.commands.set(commandPathToId(path), command);
                this.commandPaths.push(path);
            });
        });
        if (endpointId !== 0) {
            const rootPartsListAttribute = this.attributes.get(attributePathToId({ endpointId: 0, clusterId: DescriptorCluster_1.DescriptorCluster.id, attributeId: DescriptorCluster_1.DescriptorCluster.attributes.partsList.id }));
            if (rootPartsListAttribute === undefined)
                throw new Error("The root endpoint should be added first!");
            rootPartsListAttribute.setLocal([...rootPartsListAttribute.getLocal(), new EndpointNumber_1.EndpointNumber(endpointId)]);
        }
        this.endpoints.set(endpointId, Object.assign(Object.assign({}, device), { clusters: clusterMap }));
        return this;
    }
    onNewExchange(exchange) {
        return __awaiter(this, void 0, void 0, function* () {
            yield new InteractionMessenger_1.InteractionServerMessenger(exchange).handleRequest(readRequest => this.handleReadRequest(exchange, readRequest), writeRequest => this.handleWriteRequest(exchange, writeRequest), (subscribeRequest, messenger) => this.handleSubscribeRequest(exchange, subscribeRequest, messenger), (invokeRequest, message) => this.handleInvokeRequest(exchange, invokeRequest, message), timedRequest => this.handleTimedRequest(exchange, timedRequest));
        });
    }
    handleReadRequest(exchange, { attributes: attributePaths, isFabricFiltered }) {
        logger.debug(`Received read request from ${exchange.channel.getName()}: ${attributePaths.map(path => this.resolveAttributeName(path)).join(", ")}, isFabricFiltered=${isFabricFiltered}`);
        const reportValues = attributePaths.flatMap((path) => {
            const attributes = this.getAttributes([path]);
            if (attributes.length === 0) {
                logger.debug(`Read from ${exchange.channel.getName()}: ${this.resolveAttributeName(path)} unsupported path`);
                return [{ attributeStatus: { path, status: { status: 134 } } }];
            }
            return attributes.map(({ path, attribute }) => {
                const { value, version } = attribute.getWithVersion(exchange.session);
                logger.debug(`Read from ${exchange.channel.getName()}: ${this.resolveAttributeName(path)}=${Logger_1.Logger.toJSON(value)} (version=${version})`);
                return { value: { path, value: attribute.schema.encodeTlv(value), version } };
            });
        });
        return {
            interactionModelRevision: 1,
            suppressResponse: false,
            values: reportValues,
        };
    }
    handleWriteRequest(exchange, { suppressResponse, writeRequests }) {
        logger.debug(`Received write request from ${exchange.channel.getName()}: ${writeRequests.map(req => this.resolveAttributeName(req.path)).join(", ")}, suppressResponse=${suppressResponse}`);
        const writeResults = writeRequests.flatMap(({ path, dataVersion, data }) => {
            const attributes = this.getAttributes([path], true);
            if (attributes.length === 0) {
                return [{ path, statusCode: 136 }];
            }
            return attributes.map(({ path, attribute }) => {
                try {
                    const decodedData = attribute.schema.decodeTlv(data);
                    logger.debug(`Handle write request from ${exchange.channel.getName()} resolved to: ${this.resolveAttributeName(path)}=${Logger_1.Logger.toJSON(data)} (${dataVersion})`);
                    attribute.set(decodedData, exchange.session);
                }
                catch (error) {
                    if (attributes.length === 1) {
                        logger.error(`Error while handling write request from ${exchange.channel.getName()} to ${this.resolveAttributeName(path)}: ${error.message}`);
                        return { path, statusCode: 135 };
                    }
                    else {
                        logger.debug(`While handling write request from ${exchange.channel.getName()} to ${this.resolveAttributeName(path)} ignored: ${error.message}`);
                    }
                }
                return { path, statusCode: 0 };
            }).filter(({ statusCode }) => statusCode !== 0);
        });
        logger.debug(`Write request from ${exchange.channel.getName()} done with following errors: ${writeResults.map(({ path, statusCode }) => `${this.resolveAttributeName(path)}=${Logger_1.Logger.toJSON(statusCode)}`).join(", ")}`);
        return {
            interactionModelRevision: 1,
            writeResponses: writeResults.map(({ path, statusCode }) => ({ path, status: { status: statusCode } })),
        };
    }
    handleSubscribeRequest(exchange, { minIntervalFloorSeconds, maxIntervalCeilingSeconds, attributeRequests, eventRequests, keepSubscriptions }, messenger) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.debug(`Received subscribe request from ${exchange.channel.getName()}`);
            if (!exchange.session.isSecure())
                throw new Error("Subscriptions are only implemented on secure sessions");
            const session = exchange.session;
            const fabric = session.getFabric();
            if (fabric === undefined)
                throw new Error("Subscriptions are only implemented after a fabric has been assigned");
            if ((!Array.isArray(attributeRequests) || attributeRequests.length === 0) && (!Array.isArray(eventRequests) || eventRequests.length === 0)) {
                throw new InteractionMessenger_1.StatusResponseError("No attributes or events requested", 128);
            }
            if (!keepSubscriptions) {
                session.clearSubscriptions();
            }
            if (attributeRequests !== undefined) {
                logger.debug(`Subscribe to ${attributeRequests.map(path => this.resolveAttributeName(path)).join(", ")}`);
                if (attributeRequests.length === 0)
                    throw new Error("Unsupported subscription request with empty attribute list");
                if (minIntervalFloorSeconds < 0)
                    throw new Error("minIntervalFloorSeconds should be greater or equal to 0");
                if (maxIntervalCeilingSeconds < 0)
                    throw new Error("maxIntervalCeilingSeconds should be greater or equal to 1");
                if (maxIntervalCeilingSeconds < minIntervalFloorSeconds)
                    throw new Error("maxIntervalCeilingSeconds should be greater or equal to minIntervalFloorSeconds");
                let attributes = this.getAttributes(attributeRequests);
                if (this.nextSubscriptionId === 0xFFFFFFFF)
                    this.nextSubscriptionId = 0;
                const subscriptionId = this.nextSubscriptionId++;
                const subscriptionHandler = new SubscriptionHandler_1.SubscriptionHandler(subscriptionId, session.getContext(), fabric, session.getPeerNodeId(), attributes, minIntervalFloorSeconds, maxIntervalCeilingSeconds);
                session.addSubscription(subscriptionHandler);
                yield subscriptionHandler.sendInitialReport(messenger, session);
                const maxInterval = subscriptionHandler.getMaxInterval();
                logger.info(`Created subscription ${subscriptionId} for Session ${session.getId()} with ${attributes.length} attributes. Updates: ${minIntervalFloorSeconds} - ${maxIntervalCeilingSeconds} => ${maxInterval} seconds`);
                yield messenger.send(4, InteractionMessages_1.TlvSubscribeResponse.encode({ subscriptionId, maxInterval, interactionModelRevision: 1 }));
                subscriptionHandler.activateSendingUpdates();
            }
        });
    }
    handleInvokeRequest(exchange, { invokes }, message) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.debug(`Received invoke request from ${exchange.channel.getName()}: ${invokes.map(({ path: { endpointId, clusterId, commandId } }) => `${toHex(endpointId)}/${toHex(clusterId)}/${toHex(commandId)}`).join(", ")}`);
            const results = new Array();
            yield Promise.all(invokes.map(({ path, args }) => __awaiter(this, void 0, void 0, function* () {
                const command = this.commands.get(commandPathToId(path));
                if (command === undefined)
                    return;
                const result = yield command.invoke(exchange.session, args, message);
                results.push(Object.assign(Object.assign({}, result), { path }));
            })));
            return {
                suppressResponse: false,
                interactionModelRevision: 1,
                responses: results.map(({ path, responseId, code, response }) => {
                    if (response.length === 0) {
                        return { result: { path, result: { code } } };
                    }
                    else {
                        return { response: { path: Object.assign(Object.assign({}, path), { commandId: responseId }), response } };
                    }
                }),
            };
        });
    }
    handleTimedRequest(exchange, { timeout }) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.debug(`Received timed request (${timeout}) from ${exchange.channel.getName()}`);
        });
    }
    resolveAttributeName({ endpointId, clusterId, attributeId }) {
        var _a;
        if (endpointId === undefined) {
            return `*/${toHex(clusterId)}/${toHex(attributeId)}`;
        }
        const endpoint = this.endpoints.get(endpointId);
        if (endpoint === undefined) {
            return `unknown(${toHex(endpointId)})/${toHex(clusterId)}/${toHex(attributeId)}`;
        }
        const endpointName = `${endpoint.name}(${toHex(endpointId)})`;
        if (clusterId === undefined) {
            return `${endpointName}/*/${toHex(attributeId)}`;
        }
        const cluster = endpoint.clusters.get(clusterId);
        if (cluster === undefined) {
            return `${endpointName}/unknown(${toHex(clusterId)})/${toHex(attributeId)}`;
        }
        const clusterName = `${cluster.name}(${toHex(clusterId)})`;
        if (attributeId === undefined) {
            return `${endpointName}/${clusterName}/*`;
        }
        const attribute = this.attributes.get(attributePathToId({ endpointId, clusterId, attributeId }));
        const attributeName = `${(_a = attribute === null || attribute === void 0 ? void 0 : attribute.name) !== null && _a !== void 0 ? _a : "unknown"}(${toHex(attributeId)})`;
        return `${endpointName}/${clusterName}/${attributeName}`;
    }
    getAttributes(filters, onlyWritable = false) {
        const result = new Array();
        filters.forEach(({ endpointId, clusterId, attributeId }) => {
            if (endpointId !== undefined && clusterId !== undefined && attributeId !== undefined) {
                const path = { endpointId, clusterId, attributeId };
                const attribute = this.attributes.get(attributePathToId(path));
                if (attribute === undefined)
                    return;
                if (onlyWritable && !attribute.isWritable)
                    return;
                result.push({ path, attribute });
            }
            else {
                this.attributePaths.filter(path => (endpointId === undefined || endpointId === path.endpointId)
                    && (clusterId === undefined || clusterId === path.clusterId)
                    && (attributeId === undefined || attributeId === path.attributeId))
                    .forEach(path => {
                    const attribute = this.attributes.get(attributePathToId(path));
                    if (attribute === undefined)
                        return;
                    if (onlyWritable && !attribute.isWritable)
                        return;
                    result.push({ path, attribute });
                });
            }
        });
        return result;
    }
}
exports.InteractionServer = InteractionServer;
