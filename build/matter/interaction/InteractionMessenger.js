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
exports.InteractionClientMessenger = exports.InteractionServerMessenger = exports.StatusResponseError = void 0;
const Logger_1 = require("../../log/Logger");
const InteractionMessages_1 = require("./InteractionMessages");
const MatterError_1 = require("../../error/MatterError");
class StatusResponseError extends MatterError_1.MatterError {
    constructor(message, code) {
        super();
        this.message = message;
        this.code = code;
        this.message = `(${code}) ${message}`;
    }
}
exports.StatusResponseError = StatusResponseError;
const MAX_SPDU_LENGTH = 1024;
const logger = Logger_1.Logger.get("InteractionMessenger");
class InteractionMessenger {
    constructor(exchangeBase) {
        this.exchangeBase = exchangeBase;
    }
    sendStatus(status) {
        return this.exchangeBase.send(1, InteractionMessages_1.TlvStatusResponse.encode({ status, interactionModelRevision: 1 }));
    }
    waitForSuccess() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.nextMessage(1);
        });
    }
    nextMessage(expectedMessageType) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = yield this.exchangeBase.nextMessage();
            const messageType = message.payloadHeader.messageType;
            this.throwIfError(messageType, message.payload);
            if (expectedMessageType !== undefined && messageType !== expectedMessageType)
                throw new Error(`Received unexpected message type: ${messageType}, expected: ${expectedMessageType}`);
            return message;
        });
    }
    close() {
        this.exchangeBase.close();
    }
    throwIfError(messageType, payload) {
        if (messageType !== 1)
            return;
        const { status } = InteractionMessages_1.TlvStatusResponse.decode(payload);
        if (status !== 0)
            new Error(`Received error status: ${status}`);
    }
}
class InteractionServerMessenger extends InteractionMessenger {
    constructor(exchange) {
        super(exchange);
        this.exchange = exchange;
    }
    handleRequest(handleReadRequest, handleWriteRequest, handleSubscribeRequest, handleInvokeRequest, handleTimedRequest) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            let continueExchange = true;
            try {
                while (continueExchange) {
                    const message = yield this.exchange.nextMessage();
                    continueExchange = false;
                    switch (message.payloadHeader.messageType) {
                        case 2:
                            const readRequest = InteractionMessages_1.TlvReadRequest.decode(message.payload);
                            yield this.sendDataReport(handleReadRequest(readRequest));
                            break;
                        case 6:
                            const writeRequest = InteractionMessages_1.TlvWriteRequest.decode(message.payload);
                            const writeResponse = handleWriteRequest(writeRequest);
                            yield this.exchange.send(7, InteractionMessages_1.TlvWriteResponse.encode(writeResponse));
                            break;
                        case 3:
                            const subscribeRequest = InteractionMessages_1.TlvSubscribeRequest.decode(message.payload);
                            yield handleSubscribeRequest(subscribeRequest, this);
                            break;
                        case 8:
                            const invokeRequest = InteractionMessages_1.TlvInvokeRequest.decode(message.payload);
                            const invokeResponse = yield handleInvokeRequest(invokeRequest, message);
                            yield this.exchange.send(9, InteractionMessages_1.TlvInvokeResponse.encode(invokeResponse));
                            break;
                        case 10:
                            const timedRequest = InteractionMessages_1.TlvTimedRequest.decode(message.payload);
                            yield handleTimedRequest(timedRequest);
                            yield this.sendStatus(0);
                            continueExchange = true;
                            break;
                        default:
                            throw new Error(`Unsupported message type ${message.payloadHeader.messageType}`);
                    }
                }
            }
            catch (error) {
                logger.error((_a = error.stack) !== null && _a !== void 0 ? _a : error);
                yield this.sendStatus(1);
            }
            finally {
                this.exchange.close();
            }
        });
    }
    sendDataReport(dataReport) {
        return __awaiter(this, void 0, void 0, function* () {
            const messageBytes = InteractionMessages_1.TlvDataReport.encode(dataReport);
            if (!Array.isArray(dataReport.values)) {
                throw new Error(`DataReport.values must be an array, got: ${dataReport.values}`);
            }
            if (messageBytes.length > MAX_SPDU_LENGTH) {
                const attributeReportsToSend = [...dataReport.values];
                dataReport.values.length = 0;
                dataReport.moreChunkedMessages = true;
                const emptyDataReportBytes = InteractionMessages_1.TlvDataReport.encode(dataReport);
                let messageSize = emptyDataReportBytes.length;
                while (true) {
                    const attributeReport = attributeReportsToSend.pop();
                    if (attributeReport === undefined) {
                        dataReport.moreChunkedMessages = undefined;
                        break;
                    }
                    const attributeReportBytes = InteractionMessages_1.TlvAttributeReport.encode(attributeReport).length;
                    if (messageSize + attributeReportBytes > MAX_SPDU_LENGTH) {
                        if (messageSize === emptyDataReportBytes.length) {
                            throw new Error(`Attribute report for is too long to fit in a single chunk, Array chunking not yet supported`);
                        }
                        yield this.exchange.send(5, InteractionMessages_1.TlvDataReport.encode(dataReport));
                        yield this.waitForSuccess();
                        dataReport.values.length = 0;
                        messageSize = emptyDataReportBytes.length;
                    }
                    messageSize += attributeReportBytes;
                    dataReport.values.push(attributeReport);
                }
            }
            yield this.exchange.send(5, InteractionMessages_1.TlvDataReport.encode(dataReport));
        });
    }
    send(messageType, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.exchange.send(messageType, payload);
        });
    }
}
exports.InteractionServerMessenger = InteractionServerMessenger;
class InteractionClientMessenger extends InteractionMessenger {
    constructor(exchange) {
        super(exchange);
        this.exchange = exchange;
    }
    sendReadRequest(readRequest) {
        return this.request(2, InteractionMessages_1.TlvReadRequest, 5, InteractionMessages_1.TlvDataReport, readRequest);
    }
    sendSubscribeRequest(subscribeRequest) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.exchange.send(3, InteractionMessages_1.TlvSubscribeRequest.encode(subscribeRequest));
            const report = yield this.readDataReport();
            const { subscriptionId } = report;
            yield this.sendStatus(0);
            const subscribeResponseMessage = yield this.nextMessage(4);
            const subscribeResponse = InteractionMessages_1.TlvSubscribeResponse.decode(subscribeResponseMessage.payload);
            if (subscribeResponse.subscriptionId !== subscriptionId) {
                throw new Error(`Received subscription ID ${subscribeResponse.subscriptionId} instead of ${subscriptionId}`);
            }
            return {
                subscribeResponse,
                report,
            };
        });
    }
    sendInvokeCommand(invokeRequest) {
        return this.request(8, InteractionMessages_1.TlvInvokeRequest, 9, InteractionMessages_1.TlvInvokeResponse, invokeRequest);
    }
    readDataReport() {
        return __awaiter(this, void 0, void 0, function* () {
            let subscriptionId;
            const values = [];
            while (true) {
                const dataReportMessage = yield this.exchange.waitFor(5);
                const report = InteractionMessages_1.TlvDataReport.decode(dataReportMessage.payload);
                if (subscriptionId === undefined && report.subscriptionId !== undefined) {
                    subscriptionId = report.subscriptionId;
                }
                else {
                    if (report.subscriptionId === undefined || report.subscriptionId !== subscriptionId) {
                        throw new Error(`Invalid subscription ID ${report.subscriptionId} received`);
                    }
                }
                if (Array.isArray(report.values) && report.values.length > 0) {
                    values.push(...report.values);
                }
                if (!report.moreChunkedMessages) {
                    report.values = values;
                    return report;
                }
                yield this.sendStatus(0);
            }
        });
    }
    request(requestMessageType, requestSchema, responseMessageType, responseSchema, request) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.exchange.send(requestMessageType, requestSchema.encode(request));
            const responseMessage = yield this.nextMessage(responseMessageType);
            return responseSchema.decode(responseMessage.payload);
        });
    }
}
exports.InteractionClientMessenger = InteractionClientMessenger;
