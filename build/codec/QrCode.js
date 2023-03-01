"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrCode = exports.QrCodeSchema = void 0;
const matter_js_1 = require("@project-chip/matter.js");
const ReedSolomon_1 = require("../math/ReedSolomon");
const QR_MASK = [
    [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
];
var Direction;
(function (Direction) {
    Direction[Direction["UP"] = 0] = "UP";
    Direction[Direction["DOWN"] = 1] = "DOWN";
})(Direction || (Direction = {}));
const BLOCKS = [
    { x: 19, y: 19, dir: Direction.UP },
    { x: 19, y: 17, dir: Direction.UP },
    { x: 19, y: 15, dir: Direction.UP },
    { x: 19, y: 13, dir: Direction.UP },
    { x: 19, y: 11, dir: Direction.UP },
    { x: 19, y: 9, dir: Direction.UP },
    { x: 17, y: 9, dir: Direction.DOWN },
    { x: 17, y: 11, dir: Direction.DOWN },
    { x: 17, y: 13, dir: Direction.DOWN },
    { x: 17, y: 15, dir: Direction.DOWN },
    { x: 17, y: 17, dir: Direction.DOWN },
    { x: 17, y: 19, dir: Direction.DOWN },
    { x: 15, y: 19, dir: Direction.UP },
    { x: 15, y: 17, dir: Direction.UP },
    { x: 15, y: 15, dir: Direction.UP },
    { x: 15, y: 13, dir: Direction.UP },
    { x: 15, y: 11, dir: Direction.UP },
    { x: 15, y: 9, dir: Direction.UP },
    { x: 13, y: 9, dir: Direction.DOWN },
    { x: 13, y: 11, dir: Direction.DOWN },
    { x: 13, y: 13, dir: Direction.DOWN },
    { x: 13, y: 15, dir: Direction.DOWN },
    { x: 13, y: 17, dir: Direction.DOWN },
    { x: 13, y: 19, dir: Direction.DOWN },
    { x: 11, y: 19, dir: Direction.UP },
    { x: 11, y: 17, dir: Direction.UP },
    { x: 11, y: 15, dir: Direction.UP },
    { x: 11, y: 13, dir: Direction.UP },
    { x: 11, y: 11, dir: Direction.UP },
    { x: 11, y: 9, dir: Direction.UP },
    { x: 11, y: 7, dir: Direction.UP },
    { x: 11, y: 4, dir: Direction.UP },
    { x: 11, y: 2, dir: Direction.UP },
    { x: 11, y: 0, dir: Direction.UP },
    { x: 9, y: 0, dir: Direction.DOWN },
    { x: 9, y: 2, dir: Direction.DOWN },
    { x: 9, y: 4, dir: Direction.DOWN },
    { x: 9, y: 7, dir: Direction.DOWN },
    { x: 9, y: 9, dir: Direction.DOWN },
    { x: 9, y: 11, dir: Direction.DOWN },
    { x: 9, y: 13, dir: Direction.DOWN },
    { x: 9, y: 15, dir: Direction.DOWN },
    { x: 9, y: 17, dir: Direction.DOWN },
    { x: 9, y: 19, dir: Direction.DOWN },
    { x: 7, y: 11, dir: Direction.UP },
    { x: 7, y: 9, dir: Direction.UP },
    { x: 4, y: 9, dir: Direction.DOWN },
    { x: 4, y: 11, dir: Direction.DOWN },
    { x: 2, y: 11, dir: Direction.UP },
    { x: 2, y: 9, dir: Direction.UP },
    { x: 0, y: 9, dir: Direction.DOWN },
    { x: 0, y: 11, dir: Direction.DOWN },
];
const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:";
class QrCodeSchema extends matter_js_1.Schema {
    encodeInternal(data) {
        const bitStringBuilder = new Array();
        const { length } = data;
        let bitCount = 0;
        bitStringBuilder.push("0010");
        bitCount += 4;
        bitStringBuilder.push(length.toString(2).padStart(9, "0"));
        bitCount += 9;
        let index = 0;
        while (index < length) {
            const value = 45 * this.getCode(data[index]) + (index < length - 2 ? this.getCode(data[index + 1]) : 0);
            bitStringBuilder.push(value.toString(2).padStart(11, "0"));
            index += 2;
            bitCount += 11;
        }
        bitStringBuilder.push("0000");
        bitCount += 4;
        const remainingBits = 8 - bitCount % 8;
        if (remainingBits !== 0) {
            bitStringBuilder.push("".padStart(remainingBits, "0"));
            bitCount += remainingBits;
        }
        const remainingBytes = 19 - bitCount / 8;
        for (let i = 0; i < remainingBytes; i++) {
            if (i % 2 === 0) {
                bitStringBuilder.push("11101100");
            }
            else {
                bitStringBuilder.push("00010001");
            }
        }
        const dataBytes = new matter_js_1.ByteArray(19);
        for (let i = 0; i < 19; i++) {
            dataBytes[i] = Number.parseInt(bitStringBuilder.join("").slice(i * 8, i * 8 + 8), 2);
        }
        const ecBytes = new ReedSolomon_1.ReedSolomon().computeErrorCorrection(dataBytes, 7);
        for (let i = 0; i < 7; i++) {
            bitStringBuilder.push(ecBytes[i].toString(2).padStart(8, "0"));
        }
        const qrCode = [];
        QR_MASK.forEach((line, index) => qrCode[index] = [...line]);
        const bitString = bitStringBuilder.join("");
        let offset = 0;
        BLOCKS.forEach(({ x, y, dir }) => {
            const yStart = dir === Direction.UP ? y + 1 : y;
            const yEnd = dir === Direction.UP ? y : y + 1;
            if (bitString[offset] === "1")
                qrCode[yStart][x + 1] = 1 - qrCode[yStart][x + 1];
            if (bitString[offset + 1] === "1")
                qrCode[yStart][x] = 1 - qrCode[yStart][x];
            if (bitString[offset + 2] === "1")
                qrCode[yEnd][x + 1] = 1 - qrCode[yEnd][x + 1];
            if (bitString[offset + 3] === "1")
                qrCode[yEnd][x] = 1 - qrCode[yEnd][x];
            offset += 4;
        });
        const result = new Array();
        result.push("▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄\n");
        for (let y = 0; y < 21; y += 2) {
            result.push("█");
            for (let x = 0; x < 21; x++) {
                if (qrCode[y][x] === 0) {
                    if (y === 20 || qrCode[y + 1][x] === 1) {
                        result.push("▄");
                    }
                    else {
                        result.push(" ");
                    }
                }
                else {
                    if (y === 20 || qrCode[y + 1][x] === 1) {
                        result.push("█");
                    }
                    else {
                        result.push("▀");
                    }
                }
            }
            result.push("█\n");
        }
        result.push("▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀\n");
        return result.join("");
    }
    getCode(char) {
        const code = ALPHABET.indexOf(char);
        if (code === -1)
            throw new Error(`Invalid character ${char}`);
        return code;
    }
    decodeInternal(encoded) {
        throw new Error("Method not implemented.");
    }
}
exports.QrCodeSchema = QrCodeSchema;
exports.QrCode = new QrCodeSchema();
