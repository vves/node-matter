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
exports.Spake2p = void 0;
const bn_js_1 = __importDefault(require("bn.js"));
const elliptic_1 = require("elliptic");
const Crypto_1 = require("./Crypto");
const matter_js_1 = require("@project-chip/matter.js");
const P256_CURVE = new elliptic_1.ec("p256").curve;
const M = P256_CURVE.decodePoint("02886e2f97ace46e55ba9dd7242579f2993b64e16ef3dcab95afd497333d8fa12f", "hex");
const N = P256_CURVE.decodePoint("03d8bbd6c639c62937b04d997f38c3770719c629d7014d49a24b4f98baa1292b49", "hex");
class Spake2p {
    constructor(context, random, w0) {
        this.context = context;
        this.random = random;
        this.w0 = w0;
    }
    static computeW0W1({ iterations, salt }, pin) {
        return __awaiter(this, void 0, void 0, function* () {
            const pinWriter = new matter_js_1.DataWriter(matter_js_1.Endian.Little);
            pinWriter.writeUInt32(pin);
            const ws = yield Crypto_1.Crypto.pbkdf2(pinWriter.toByteArray(), salt, iterations, 80);
            const w0 = new bn_js_1.default(ws.slice(0, 40)).mod(P256_CURVE.n);
            const w1 = new bn_js_1.default(ws.slice(40, 80)).mod(P256_CURVE.n);
            return { w0, w1 };
        });
    }
    static computeW0L(pbkdfParameters, pin) {
        return __awaiter(this, void 0, void 0, function* () {
            const { w0, w1 } = yield this.computeW0W1(pbkdfParameters, pin);
            const L = P256_CURVE.g.mul(w1).encode();
            return { w0, L };
        });
    }
    static create(context, w0) {
        return __awaiter(this, void 0, void 0, function* () {
            const random = Crypto_1.Crypto.getRandomBN(32, P256_CURVE.p);
            return new Spake2p(context, random, w0);
        });
    }
    computeX() {
        const X = P256_CURVE.g.mul(this.random).add(M.mul(this.w0));
        return matter_js_1.ByteArray.from(X.encode());
    }
    computeY() {
        const Y = P256_CURVE.g.mul(this.random).add(N.mul(this.w0));
        return matter_js_1.ByteArray.from(Y.encode());
    }
    computeSecretAndVerifiersFromY(w1, X, Y) {
        return __awaiter(this, void 0, void 0, function* () {
            const YPoint = P256_CURVE.decodePoint(Y);
            if (!YPoint.validate())
                throw new Error("Y is not on the curve");
            const yNwo = YPoint.add(N.mul(this.w0).neg());
            const Z = yNwo.mul(this.random);
            const V = yNwo.mul(w1);
            return this.computeSecretAndVerifiers(X, Y, matter_js_1.ByteArray.from(Z.encode()), matter_js_1.ByteArray.from(V.encode()));
        });
    }
    computeSecretAndVerifiersFromX(L, X, Y) {
        return __awaiter(this, void 0, void 0, function* () {
            const XPoint = P256_CURVE.decodePoint(X);
            const LPoint = P256_CURVE.decodePoint(L);
            if (!XPoint.validate())
                throw new Error("X is not on the curve");
            const Z = XPoint.add(M.mul(this.w0).neg()).mul(this.random);
            const V = LPoint.mul(this.random);
            return this.computeSecretAndVerifiers(X, Y, matter_js_1.ByteArray.from(Z.encode()), matter_js_1.ByteArray.from(V.encode()));
        });
    }
    computeSecretAndVerifiers(X, Y, Z, V) {
        return __awaiter(this, void 0, void 0, function* () {
            const TT_HASH = this.computeTranscriptHash(X, Y, Z, V);
            const Ka = TT_HASH.slice(0, 16);
            const Ke = TT_HASH.slice(16, 32);
            const KcAB = yield Crypto_1.Crypto.hkdf(Ka, new matter_js_1.ByteArray(0), matter_js_1.ByteArray.fromString("ConfirmationKeys"), 32);
            const KcA = KcAB.slice(0, 16);
            const KcB = KcAB.slice(16, 32);
            const hAY = Crypto_1.Crypto.hmac(KcA, Y);
            const hBX = Crypto_1.Crypto.hmac(KcB, X);
            return { Ke, hAY, hBX };
        });
    }
    computeTranscriptHash(X, Y, Z, V) {
        const TTwriter = new matter_js_1.DataWriter(matter_js_1.Endian.Little);
        this.addToContext(TTwriter, this.context);
        this.addToContext(TTwriter, matter_js_1.ByteArray.fromString(""));
        this.addToContext(TTwriter, matter_js_1.ByteArray.fromString(""));
        this.addToContext(TTwriter, matter_js_1.ByteArray.from(M.encode()));
        this.addToContext(TTwriter, matter_js_1.ByteArray.from(N.encode()));
        this.addToContext(TTwriter, X);
        this.addToContext(TTwriter, Y);
        this.addToContext(TTwriter, Z);
        this.addToContext(TTwriter, V);
        this.addToContext(TTwriter, this.w0.toBuffer());
        return Crypto_1.Crypto.hash(TTwriter.toByteArray());
    }
    addToContext(TTwriter, data) {
        TTwriter.writeUInt64(data.length);
        TTwriter.writeByteArray(data);
    }
}
exports.Spake2p = Spake2p;
