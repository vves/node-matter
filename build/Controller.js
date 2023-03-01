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
const Network_1 = require("./net/Network");
const NetworkNode_1 = require("./net/node/NetworkNode");
Network_1.Network.get = (0, Singleton_1.singleton)(() => new NetworkNode_1.NetworkNode());
const MatterController_1 = require("./matter/MatterController");
const UdpInterface_1 = require("./net/UdpInterface");
const CommandLine_1 = require("./util/CommandLine");
const MdnsScanner_1 = require("./matter/mdns/MdnsScanner");
const Logger_1 = require("./log/Logger");
const package_json_1 = __importDefault(require("../package.json"));
const logger = Logger_1.Logger.get("Controller");
class Controller {
    start() {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            logger.info(`node-matter@${package_json_1.default.version}`);
            const ip = (0, CommandLine_1.getParameter)("ip");
            if (ip === undefined)
                throw new Error("Please specify the IP of the device to commission with -ip");
            const port = (_a = (0, CommandLine_1.getIntParameter)("port")) !== null && _a !== void 0 ? _a : 5540;
            const discriminator = (_b = (0, CommandLine_1.getIntParameter)("discriminator")) !== null && _b !== void 0 ? _b : 3840;
            const setupPin = (_c = (0, CommandLine_1.getIntParameter)("pin")) !== null && _c !== void 0 ? _c : 20202021;
            const client = yield MatterController_1.MatterController.create(yield MdnsScanner_1.MdnsScanner.create(), yield UdpInterface_1.UdpInterface.create(5540, "udp4"), yield UdpInterface_1.UdpInterface.create(5540, "udp6"));
            try {
                yield client.commission(ip, port, discriminator, setupPin);
            }
            finally {
                client.close();
            }
        });
    }
}
new Controller().start();
