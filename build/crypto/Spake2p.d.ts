/// <reference types="node" />
import BN from "bn.js";
import { ByteArray } from "@project-chip/matter.js";
export interface PbkdfParameters {
    iterations: number;
    salt: ByteArray;
}
export declare class Spake2p {
    private readonly context;
    private readonly random;
    private readonly w0;
    static computeW0W1({ iterations, salt }: PbkdfParameters, pin: number): Promise<{
        w0: BN;
        w1: BN;
    }>;
    static computeW0L(pbkdfParameters: PbkdfParameters, pin: number): Promise<{
        w0: BN;
        L: any;
    }>;
    static create(context: ByteArray, w0: BN): Promise<Spake2p>;
    constructor(context: ByteArray, random: BN, w0: BN);
    computeX(): ByteArray;
    computeY(): ByteArray;
    computeSecretAndVerifiersFromY(w1: BN, X: ByteArray, Y: ByteArray): Promise<{
        Ke: Buffer;
        hAY: Buffer;
        hBX: Buffer;
    }>;
    computeSecretAndVerifiersFromX(L: ByteArray, X: ByteArray, Y: ByteArray): Promise<{
        Ke: Buffer;
        hAY: Buffer;
        hBX: Buffer;
    }>;
    private computeSecretAndVerifiers;
    private computeTranscriptHash;
    private addToContext;
}
