"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireMinNodeVersion = void 0;
function requireMinNodeVersion(minVersion) {
    const version = process.versions.node;
    const versionMajor = parseInt(version.split(".")[0]);
    if (versionMajor < minVersion)
        throw new Error(`Node version ${versionMajor} is not supported. Please upgrade to ${minVersion} or above.`);
}
exports.requireMinNodeVersion = requireMinNodeVersion;
