"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TlvNodeId = exports.NodeId = void 0;
const matter_js_1 = require("@project-chip/matter.js");
const crypto_1 = __importDefault(require("crypto"));
const OPERATIONAL_NODE_MIN = BigInt('0x0000000000000001');
const OPERATIONAL_NODE_MAX = BigInt('0xFFFFFFEFFFFFFFFF');
class NodeId {
    constructor(id) {
        this.id = id;
    }
    toString() {
        const writer = new matter_js_1.DataWriter(matter_js_1.Endian.Big);
        writer.writeUInt64(this.id);
        return writer.toByteArray().toHex().toUpperCase();
    }
    static getRandomOperationalNodeId() {
        while (true) {
            const randomBigInt = BigInt('0x' + crypto_1.default.randomBytes(8).toString('hex'));
            if (randomBigInt >= OPERATIONAL_NODE_MIN && randomBigInt <= OPERATIONAL_NODE_MAX) {
                return new NodeId(randomBigInt);
            }
        }
    }
    static getGroupNodeId(groupId) {
        if (groupId < 0 || groupId > 0xFFFF) {
            throw new Error(`Invalid group ID: ${groupId}`);
        }
        return new NodeId(BigInt('0xFFFFFFFFFFFF' + groupId.toString(16).padStart(4, "0")));
    }
}
exports.NodeId = NodeId;
exports.TlvNodeId = new matter_js_1.TlvWrapper(matter_js_1.TlvUInt64, nodeId => nodeId.id, value => new NodeId(BigInt(value)));
