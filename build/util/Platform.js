"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Platform = void 0;
const os_1 = require("os");
class Platform {
    constructor() {
        this.interfaces = (0, os_1.networkInterfaces)();
        this.listInterfaces();
    }
    listInterfaces() {
        const { interfaces } = this;
        console.log('Select a network interface:');
        Object.keys(interfaces).forEach((interfaceName, index) => {
            const addresses = interfaces[interfaceName].map((addressInfo) => addressInfo.address);
            console.log(`${index + 1}: ${interfaceName} (${addresses.join(', ')})`);
        });
    }
    selectInterface() {
        return new Promise((resolve) => {
            const { interfaces } = this;
            const stdin = process.openStdin();
            stdin.on('data', (data) => {
                const choice = parseInt(data.toString().trim(), 10);
                if (isNaN(choice) || choice < 1 || choice > Object.keys(interfaces).length) {
                    console.error('Invalid choice. Please select a number from the list.');
                    return;
                }
                const interfaceName = Object.keys(interfaces)[choice - 1];
                const addresses = interfaces[interfaceName].map((addressInfo) => addressInfo.address);
                console.log(`Selected interface: ${interfaceName} (${addresses.join(', ')})`);
                stdin.removeAllListeners('data');
                stdin.pause();
                resolve(interfaceName);
            });
        });
    }
}
exports.Platform = Platform;
