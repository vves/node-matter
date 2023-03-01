"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleton = void 0;
function singleton(create) {
    var instance;
    return () => {
        if (instance === undefined)
            instance = create();
        return instance;
    };
}
exports.singleton = singleton;
