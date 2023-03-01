"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commandExecutor = exports.getIntParameter = exports.getParameter = void 0;
const child_process_1 = require("child_process");
const commandArguments = process.argv.slice(2);
function getParameter(name) {
    const markerIndex = commandArguments.indexOf(`-${name}`);
    if (markerIndex === -1 || markerIndex + 1 === commandArguments.length)
        return undefined;
    return commandArguments[markerIndex + 1];
}
exports.getParameter = getParameter;
function getIntParameter(name) {
    const value = getParameter(name);
    if (value === undefined)
        return undefined;
    return parseInt(value);
}
exports.getIntParameter = getIntParameter;
function commandExecutor(scriptParamName) {
    const script = getParameter(scriptParamName);
    if (script === undefined)
        return undefined;
    return () => console.log(`${scriptParamName}: ${(0, child_process_1.execSync)(script).toString().slice(0, -1)}`);
}
exports.commandExecutor = commandExecutor;
