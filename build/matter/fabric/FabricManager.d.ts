import { ByteArray } from "@project-chip/matter.js";
import { FabricIndex } from "../common/FabricIndex";
import { Fabric, FabricBuilder } from "./Fabric";
import { MatterError } from "../../error/MatterError";
export declare class FabricNotFoundError extends MatterError {
}
export declare class FabricManager {
    private nextFabricIndex;
    private readonly fabrics;
    private fabricBuilder?;
    addFabric(fabric: Fabric): FabricIndex;
    removeFabric(fabricIndex: FabricIndex): void;
    getFabrics(): Fabric[];
    findFabricFromDestinationId(destinationId: ByteArray, initiatorRandom: ByteArray): Fabric;
    armFailSafe(): void;
    getFabricBuilder(): FabricBuilder;
    tentativelyAddFabric(): Promise<void>;
    completeCommission(): void;
}
