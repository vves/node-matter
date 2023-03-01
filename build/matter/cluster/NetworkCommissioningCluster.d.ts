import { BitFlag } from "@project-chip/matter.js";
import { Attribute, Cluster, Command, OptionalAttribute, OptionalCommand, WritableAttribute } from "./Cluster";
export declare const enum NetworkCommissioningStatus {
    Success = 0,
    OutOfRange = 1,
    BoundsExceeded = 2,
    NetworkIDNotFound = 3,
    DuplicateNetworkID = 4,
    NetworkNotFound = 5,
    RegulatoryError = 6,
    AuthFailure = 7,
    UnsupportedSecurity = 8,
    OtherConnectionFailure = 9,
    IPV6Failed = 10,
    IPBindFailed = 11,
    UnknownError = 12
}
export declare const enum WiFiBand {
    '2G4' = 0,
    '3G65' = 1,
    '5G' = 2,
    '6G' = 3,
    '60G' = 4
}
export declare const TlvWiFiSecurity: import("@project-chip/matter.js").TlvWrapper<import("@project-chip/matter.js").TypeFromBitSchema<{
    Unencrypted: BitFlag;
    Wep: BitFlag;
    'WPA-PERSONAL': BitFlag;
    'WPA2-PERSONAL': BitFlag;
    'WPA3-PERSONAL': BitFlag;
}>, number>;
export declare const NetworkCommissioningCluster: Cluster<{
    wifi: BitFlag;
    thread: BitFlag;
    ethernet: BitFlag;
}, {
    maxNetworks: Attribute<number>;
    networks: Attribute<{
        connected: boolean;
        networkId: Uint8Array;
    }[]>;
    scanMaxTimeSeconds: OptionalAttribute<number>;
    connectMaxTimeSeconds: OptionalAttribute<number>;
    interfaceEnabled: WritableAttribute<boolean>;
    lastNetworkingStatus: Attribute<NetworkCommissioningStatus | null>;
    lastNetworkId: Attribute<Uint8Array | null>;
    lastConnectErrorValue: Attribute<number | null>;
    clusterRevision: Attribute<number>;
    featureMap: Attribute<import("@project-chip/matter.js").TypeFromBitSchema<{
        wifi: BitFlag;
        thread: BitFlag;
        ethernet: BitFlag;
    }>>;
    attributeList: Attribute<import("../common/AttributeId").AttributeId[]>;
    eventList: Attribute<import("../common/EventId").EventId[]>;
    acceptedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
    generatedCommandList: Attribute<import("../common/CommandId").CommandId[]>;
}, {
    scanNetworks: Command<{
        breadcrumb?: number | bigint | undefined;
        ssid?: Uint8Array | null | undefined;
    }, {
        networkingStatus: NetworkCommissioningStatus;
        debugText?: string | undefined;
        wiFiScanResults?: {
            channel: number;
            security: import("@project-chip/matter.js").TypeFromBitSchema<{
                Unencrypted: BitFlag;
                Wep: BitFlag;
                'WPA-PERSONAL': BitFlag;
                'WPA2-PERSONAL': BitFlag;
                'WPA3-PERSONAL': BitFlag;
            }>;
            ssid: Uint8Array;
            bssid: Uint8Array;
            wiFiBand?: WiFiBand | undefined;
            rssi?: number | undefined;
        }[] | undefined;
        threadScanResults?: {
            channel: number;
            version: number;
            rssi: number;
            panId: number;
            extendedPanId: number | bigint;
            networkName: string;
            extendedAddress: Uint8Array;
            lqi: number;
        }[] | undefined;
    }>;
    addOrUpdateWiFiNetwork: OptionalCommand<{
        ssid: Uint8Array;
        credentials: Uint8Array;
        breadcrumb?: number | bigint | undefined;
    }, {
        networkingStatus: NetworkCommissioningStatus;
        debugText?: string | undefined;
        networkIndex?: number | undefined;
    }>;
    addOrUpdateThreadNetwork: OptionalCommand<{
        OperationalDataset: Uint8Array;
        breadcrumb?: number | bigint | undefined;
    }, {
        networkingStatus: NetworkCommissioningStatus;
        debugText?: string | undefined;
        networkIndex?: number | undefined;
    }>;
    removeNetwork: Command<{
        networkId: Uint8Array;
        breadcrumb?: number | bigint | undefined;
    }, {
        networkingStatus: NetworkCommissioningStatus;
        debugText?: string | undefined;
        networkIndex?: number | undefined;
    }>;
    connectNetwork: Command<{
        networkId: Uint8Array;
        breadcrumb?: number | bigint | undefined;
    }, {
        networkingStatus: NetworkCommissioningStatus;
        errorValue: number | null;
        debugText?: string | undefined;
    }>;
    reorderNetwork: Command<{
        networkId: Uint8Array;
        networkIndex: number;
        breadcrumb?: number | bigint | undefined;
    }, {
        networkingStatus: NetworkCommissioningStatus;
        debugText?: string | undefined;
        networkIndex?: number | undefined;
    }>;
}, import("./Cluster").Events>;
