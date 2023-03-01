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
exports.FabricManager = exports.FabricNotFoundError = void 0;
const FabricIndex_1 = require("../common/FabricIndex");
const Fabric_1 = require("./Fabric");
const MatterError_1 = require("../../error/MatterError");
class FabricNotFoundError extends MatterError_1.MatterError {
}
exports.FabricNotFoundError = FabricNotFoundError;
class FabricManager {
    constructor() {
        this.nextFabricIndex = 1;
        this.fabrics = new Array();
    }
    addFabric(fabric) {
        this.fabrics.push(fabric);
        return new FabricIndex_1.FabricIndex(this.fabrics.length);
    }
    removeFabric(fabricIndex) {
        const index = this.fabrics.findIndex(fabric => fabric.fabricIndex.index === fabricIndex.index);
        if (index === -1)
            throw new FabricNotFoundError(`Fabric with index ${fabricIndex} cannot be removed because it does not exist.`);
        this.fabrics.splice(index, 1);
    }
    getFabrics() {
        return this.fabrics;
    }
    findFabricFromDestinationId(destinationId, initiatorRandom) {
        for (var fabric of this.fabrics) {
            const candidateDestinationId = fabric.getDestinationId(fabric.nodeId, initiatorRandom);
            if (!candidateDestinationId.equals(destinationId))
                continue;
            return fabric;
        }
        throw new Error("Fabric cannot be found from destinationId");
    }
    armFailSafe() {
        this.fabricBuilder = new Fabric_1.FabricBuilder(new FabricIndex_1.FabricIndex(this.nextFabricIndex++));
    }
    getFabricBuilder() {
        const result = this.fabricBuilder;
        if (result === undefined)
            throw new Error("armFailSafe should be called first!");
        return result;
    }
    tentativelyAddFabric() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.fabricBuilder === undefined)
                throw new Error("armFailSafe should be called first!");
            this.fabrics.push(yield this.fabricBuilder.build());
            this.fabricBuilder = undefined;
        });
    }
    completeCommission() {
    }
}
exports.FabricManager = FabricManager;
