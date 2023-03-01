export declare const SERVICE_DISCOVERY_QNAME = "_services._dns-sd._udp.local";
export declare const MATTER_COMMISSION_SERVICE_QNAME = "_matterc._udp.local";
export declare const MATTER_SERVICE_QNAME = "_matter._tcp.local";
export declare const getFabricQname: (operationalIdString: string) => string;
export declare const getDeviceMatterQname: (operationalIdString: string, nodeIdString: string) => string;
