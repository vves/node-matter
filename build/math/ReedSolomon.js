"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReedSolomon = void 0;
const matter_js_1 = require("@project-chip/matter.js");
class GaloisField {
    constructor(prime = 0x11d, generator = 2, c_exp = 8) {
        this.prime = prime;
        this.exp = new Array();
        this.log = new Array();
        this.size = Math.floor(Math.pow(2, c_exp) - 1);
        let x = 1;
        for (let i = 0; i < this.size; i++) {
            this.exp[i] = x;
            this.log[x] = i;
            x = this.multiplyNoLut(x, generator);
        }
        for (let i = this.size; i < this.size * 2; i++) {
            this.exp[i] = this.exp[i - this.size];
        }
    }
    multiply(x, y) {
        if (x === 0 || y === 0)
            return 0;
        return this.exp[(this.log[x] + this.log[y]) % this.size];
    }
    multiplyPolynom(p, q) {
        const result = new Array();
        const logP = new Array();
        for (let i = 0; i < p.length; i++) {
            logP[i] = this.log[p[i]];
        }
        for (let j = 0; j < q.length; j++) {
            if (q[j] === 0)
                continue;
            const lq = this.log[q[j]];
            for (let i = 0; i < p.length; i++) {
                if (p[i] === 0)
                    continue;
                result[i + j] ^= this.exp[logP[i] + lq];
            }
        }
        return result;
    }
    power(x, power) {
        return this.exp[(this.log[x] * power) % this.size];
    }
    multiplyNoLut(x, y) {
        let result = 0;
        while (y > 0) {
            if ((y & 1) !== 0)
                result = result ^ x;
            y = y >> 1;
            x = x << 1;
            if (x > this.size) {
                x = x ^ this.prime;
            }
        }
        return result;
    }
}
class ReedSolomon {
    constructor() {
        this.galoisField = new GaloisField();
    }
    computeErrorCorrection(data, ecLength) {
        const { length } = data;
        if (length + ecLength > this.galoisField.size)
            throw new Error("Message is too long");
        const generator = this.generatePolynom(ecLength);
        const { length: generatorLength } = generator;
        const buffer = new matter_js_1.ByteArray(length + generatorLength - 1);
        buffer.set(data, 0);
        for (let i = 0; i < length; i++) {
            const coef = buffer[i];
            if (coef === 0)
                continue;
            for (let j = 0; j < generatorLength; j++) {
                buffer[i + j] ^= this.galoisField.multiply(generator[j], coef);
            }
        }
        return buffer.slice(length);
    }
    generatePolynom(ecLength) {
        let result = [1];
        for (let i = 0; i < ecLength; i++) {
            result = this.galoisField.multiplyPolynom(result, [1, this.galoisField.power(2, i)]);
        }
        return result;
    }
}
exports.ReedSolomon = ReedSolomon;
