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
exports.CommandServer = void 0;
const Logger_1 = require("../../../log/Logger");
const logger = Logger_1.Logger.get("CommandServer");
class CommandServer {
    constructor(invokeId, responseId, name, requestSchema, responseSchema, handler) {
        this.invokeId = invokeId;
        this.responseId = responseId;
        this.name = name;
        this.requestSchema = requestSchema;
        this.responseSchema = responseSchema;
        this.handler = handler;
    }
    invoke(session, args, message) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const request = this.requestSchema.decodeTlv(args);
                logger.debug(`Invoke ${this.name} with data ${Logger_1.Logger.toJSON(request)}`);
                const response = yield this.handler(request, session, message);
                logger.debug(`Invoke ${this.name} response : ${Logger_1.Logger.toJSON(response)}`);
                return { code: 0, responseId: this.responseId, response: this.responseSchema.encodeTlv(response) };
            }
            catch (err) {
                logger.error(err);
                logger.error(`Error handling REQUEST: ${JSON.stringify(args, null, 2)}`);
                return { code: 1, responseId: this.responseId, response: [] };
            }
        });
    }
}
exports.CommandServer = CommandServer;
