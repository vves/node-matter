"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkCommissioningCluster = exports.TlvWiFiSecurity = void 0;
const matter_js_1 = require("@project-chip/matter.js");
const Cluster_1 = require("./Cluster");
exports.TlvWiFiSecurity = (0, matter_js_1.TlvBitmap)(matter_js_1.TlvUInt8, {
    Unencrypted: (0, matter_js_1.BitFlag)(0),
    Wep: (0, matter_js_1.BitFlag)(1),
    'WPA-PERSONAL': (0, matter_js_1.BitFlag)(2),
    'WPA2-PERSONAL': (0, matter_js_1.BitFlag)(3),
    'WPA3-PERSONAL': (0, matter_js_1.BitFlag)(4),
});
const TlvWiFiInterfaceScanResult = (0, matter_js_1.TlvObject)({
    security: (0, matter_js_1.TlvField)(0, exports.TlvWiFiSecurity),
    ssid: (0, matter_js_1.TlvField)(1, matter_js_1.TlvByteString.bound({ maxLength: 32 })),
    bssid: (0, matter_js_1.TlvField)(2, matter_js_1.TlvByteString.bound({ length: 6 })),
    channel: (0, matter_js_1.TlvField)(3, matter_js_1.TlvUInt16),
    wiFiBand: (0, matter_js_1.TlvOptionalField)(4, (0, matter_js_1.TlvEnum)()),
    rssi: (0, matter_js_1.TlvOptionalField)(5, matter_js_1.TlvInt8),
});
const TlvHardwareAddress = matter_js_1.TlvByteString.bound({ minLength: 6, maxLength: 8 });
const TlThreadInterfaceScanResult = (0, matter_js_1.TlvObject)({
    panId: (0, matter_js_1.TlvField)(0, matter_js_1.TlvUInt16.bound({ min: 0, max: 65534 })),
    extendedPanId: (0, matter_js_1.TlvField)(1, matter_js_1.TlvUInt64),
    networkName: (0, matter_js_1.TlvField)(2, matter_js_1.TlvString.bound({ minLength: 1, maxLength: 16 })),
    channel: (0, matter_js_1.TlvField)(3, matter_js_1.TlvUInt16),
    version: (0, matter_js_1.TlvField)(4, matter_js_1.TlvUInt8),
    extendedAddress: (0, matter_js_1.TlvField)(5, TlvHardwareAddress),
    rssi: (0, matter_js_1.TlvField)(6, matter_js_1.TlvInt8),
    lqi: (0, matter_js_1.TlvField)(7, matter_js_1.TlvUInt8),
});
const TlvNetworkInfo = (0, matter_js_1.TlvObject)({
    networkId: (0, matter_js_1.TlvField)(0, matter_js_1.TlvByteString.bound({ minLength: 1, maxLength: 32 })),
    connected: (0, matter_js_1.TlvField)(1, matter_js_1.TlvBoolean),
});
const TlvScanNetworksRequest = (0, matter_js_1.TlvObject)({
    ssid: (0, matter_js_1.TlvOptionalField)(0, (0, matter_js_1.TlvNullable)(matter_js_1.TlvByteString.bound({ minLength: 1, maxLength: 32 }))),
    breadcrumb: (0, matter_js_1.TlvOptionalField)(1, matter_js_1.TlvUInt64),
});
const TlvScanNetworksResponse = (0, matter_js_1.TlvObject)({
    networkingStatus: (0, matter_js_1.TlvField)(0, (0, matter_js_1.TlvEnum)()),
    debugText: (0, matter_js_1.TlvOptionalField)(1, matter_js_1.TlvString.bound({ maxLength: 512 })),
    wiFiScanResults: (0, matter_js_1.TlvOptionalField)(2, (0, matter_js_1.TlvArray)(TlvWiFiInterfaceScanResult)),
    threadScanResults: (0, matter_js_1.TlvOptionalField)(3, (0, matter_js_1.TlvArray)(TlThreadInterfaceScanResult)),
});
const TlvAddOrUpdateWiFiNetworkRequest = (0, matter_js_1.TlvObject)({
    ssid: (0, matter_js_1.TlvField)(0, matter_js_1.TlvByteString.bound({ maxLength: 32 })),
    credentials: (0, matter_js_1.TlvField)(1, matter_js_1.TlvByteString.bound({ maxLength: 64 })),
    breadcrumb: (0, matter_js_1.TlvOptionalField)(2, matter_js_1.TlvUInt64),
});
const TlvAddOrUpdateThreadNetworkRequest = (0, matter_js_1.TlvObject)({
    OperationalDataset: (0, matter_js_1.TlvField)(0, matter_js_1.TlvByteString.bound({ length: 254 })),
    breadcrumb: (0, matter_js_1.TlvOptionalField)(1, matter_js_1.TlvUInt64),
});
const TlvRemoveNetworkRequest = (0, matter_js_1.TlvObject)({
    networkId: (0, matter_js_1.TlvField)(0, matter_js_1.TlvByteString.bound({ minLength: 1, maxLength: 32 })),
    breadcrumb: (0, matter_js_1.TlvOptionalField)(1, matter_js_1.TlvUInt64),
});
const TlvNetworkConfigResponse = (0, matter_js_1.TlvObject)({
    networkingStatus: (0, matter_js_1.TlvField)(0, (0, matter_js_1.TlvEnum)()),
    debugText: (0, matter_js_1.TlvOptionalField)(1, matter_js_1.TlvString.bound({ maxLength: 512 })),
    networkIndex: (0, matter_js_1.TlvOptionalField)(2, matter_js_1.TlvUInt8),
});
const TlvConnectNetworkRequest = (0, matter_js_1.TlvObject)({
    networkId: (0, matter_js_1.TlvField)(0, matter_js_1.TlvByteString.bound({ minLength: 1, maxLength: 32 })),
    breadcrumb: (0, matter_js_1.TlvOptionalField)(1, matter_js_1.TlvUInt64),
});
const TlvConnectNetworkResponse = (0, matter_js_1.TlvObject)({
    networkingStatus: (0, matter_js_1.TlvField)(0, (0, matter_js_1.TlvEnum)()),
    debugText: (0, matter_js_1.TlvOptionalField)(1, matter_js_1.TlvString),
    errorValue: (0, matter_js_1.TlvField)(2, (0, matter_js_1.TlvNullable)(matter_js_1.TlvInt32)),
});
const TlvReorderNetworkRequest = (0, matter_js_1.TlvObject)({
    networkId: (0, matter_js_1.TlvField)(0, matter_js_1.TlvByteString.bound({ minLength: 1, maxLength: 32 })),
    networkIndex: (0, matter_js_1.TlvField)(1, matter_js_1.TlvUInt8),
    breadcrumb: (0, matter_js_1.TlvOptionalField)(2, matter_js_1.TlvUInt64),
});
exports.NetworkCommissioningCluster = (0, Cluster_1.Cluster)({
    id: 0x31,
    name: "Network Commissioning",
    revision: 1,
    features: {
        wifi: (0, matter_js_1.BitFlag)(0),
        thread: (0, matter_js_1.BitFlag)(1),
        ethernet: (0, matter_js_1.BitFlag)(2),
    },
    attributes: {
        maxNetworks: (0, Cluster_1.Attribute)(0, matter_js_1.TlvUInt8.bound({ min: 1 })),
        networks: (0, Cluster_1.Attribute)(1, (0, matter_js_1.TlvArray)(TlvNetworkInfo), { default: [] }),
        scanMaxTimeSeconds: (0, Cluster_1.OptionalAttribute)(2, matter_js_1.TlvUInt8),
        connectMaxTimeSeconds: (0, Cluster_1.OptionalAttribute)(3, matter_js_1.TlvUInt8),
        interfaceEnabled: (0, Cluster_1.WritableAttribute)(4, matter_js_1.TlvBoolean, { default: true }),
        lastNetworkingStatus: (0, Cluster_1.Attribute)(5, (0, matter_js_1.TlvNullable)((0, matter_js_1.TlvEnum)()), { persistent: true, default: null }),
        lastNetworkId: (0, Cluster_1.Attribute)(6, (0, matter_js_1.TlvNullable)(matter_js_1.TlvByteString.bound({ minLength: 1, maxLength: 32 })), { default: null }),
        lastConnectErrorValue: (0, Cluster_1.Attribute)(7, (0, matter_js_1.TlvNullable)(matter_js_1.TlvInt32), { default: null }),
    },
    commands: {
        scanNetworks: (0, Cluster_1.Command)(0, TlvScanNetworksRequest, 1, TlvScanNetworksResponse),
        addOrUpdateWiFiNetwork: (0, Cluster_1.OptionalCommand)(2, TlvAddOrUpdateWiFiNetworkRequest, 5, TlvNetworkConfigResponse),
        addOrUpdateThreadNetwork: (0, Cluster_1.OptionalCommand)(3, TlvAddOrUpdateThreadNetworkRequest, 5, TlvNetworkConfigResponse),
        removeNetwork: (0, Cluster_1.Command)(4, TlvRemoveNetworkRequest, 5, TlvNetworkConfigResponse),
        connectNetwork: (0, Cluster_1.Command)(6, TlvConnectNetworkRequest, 7, TlvConnectNetworkResponse),
        reorderNetwork: (0, Cluster_1.Command)(8, TlvReorderNetworkRequest, 5, TlvNetworkConfigResponse),
    },
});
