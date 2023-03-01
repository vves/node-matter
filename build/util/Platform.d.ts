/// <reference types="node" />
export declare class Platform {
    readonly interfaces: NodeJS.Dict<import("os").NetworkInterfaceInfo[]>;
    constructor();
    private listInterfaces;
    selectInterface(): Promise<string>;
}
