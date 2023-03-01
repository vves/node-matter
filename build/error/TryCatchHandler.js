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
exports.tryCatchAsync = exports.tryCatch = void 0;
function tryCatch(codeBlock, errorType, fallbackValueOrFunction) {
    try {
        return codeBlock();
    }
    catch (error) {
        if (error instanceof errorType) {
            if (typeof fallbackValueOrFunction === "function") {
                return fallbackValueOrFunction(error);
            }
            else {
                return fallbackValueOrFunction;
            }
        }
        throw error;
    }
}
exports.tryCatch = tryCatch;
function tryCatchAsync(codeBlock, errorType, fallbackValueOrFunction) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield codeBlock();
        }
        catch (error) {
            if (error instanceof errorType) {
                if (typeof fallbackValueOrFunction === "function") {
                    return fallbackValueOrFunction(error);
                }
                else {
                    return fallbackValueOrFunction;
                }
            }
            throw error;
        }
    });
}
exports.tryCatchAsync = tryCatchAsync;
