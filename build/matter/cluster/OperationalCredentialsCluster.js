"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperationalCredentialsCluster = exports.TlvCertSigningRequest = exports.TlvAttestation = exports.RESP_MAX = void 0;
const VendorId_1 = require("../common/VendorId");
const NodeId_1 = require("../common/NodeId");
const SubjectId_1 = require("../common/SubjectId");
const FabricId_1 = require("../common/FabricId");
const FabricIndex_1 = require("../common/FabricIndex");
const Cluster_1 = require("./Cluster");
const matter_js_1 = require("@project-chip/matter.js");
exports.RESP_MAX = 900;
const TlvFabricDescriptor = (0, matter_js_1.TlvObject)({
    rootPublicKey: (0, matter_js_1.TlvField)(1, matter_js_1.TlvByteString.bound({ length: 65 })),
    vendorId: (0, matter_js_1.TlvField)(2, VendorId_1.TlvVendorId),
    fabricId: (0, matter_js_1.TlvField)(3, FabricId_1.TlvFabricId),
    nodeId: (0, matter_js_1.TlvField)(4, NodeId_1.TlvNodeId),
    label: (0, matter_js_1.TlvField)(5, matter_js_1.TlvString.bound({ maxLength: 32 })),
    fabricIndex: (0, matter_js_1.TlvField)(0xfe, FabricIndex_1.TlvFabricIndex),
});
const TlvNoc = (0, matter_js_1.TlvObject)({
    noc: (0, matter_js_1.TlvField)(1, matter_js_1.TlvByteString.bound({ maxLength: 400 })),
    icac: (0, matter_js_1.TlvField)(2, (0, matter_js_1.TlvNullable)(matter_js_1.TlvByteString.bound({ maxLength: 400 }))),
});
const TlvAttestationRequest = (0, matter_js_1.TlvObject)({
    attestationNonce: (0, matter_js_1.TlvField)(0, matter_js_1.TlvByteString.bound({ length: 32 })),
});
const TlvAttestationResponse = (0, matter_js_1.TlvObject)({
    elements: (0, matter_js_1.TlvField)(0, matter_js_1.TlvByteString.bound({ maxLength: exports.RESP_MAX })),
    signature: (0, matter_js_1.TlvField)(1, matter_js_1.TlvByteString.bound({ length: 64 })),
});
const TlvCertSigningRequestRequest = (0, matter_js_1.TlvObject)({
    certSigningRequestNonce: (0, matter_js_1.TlvField)(0, matter_js_1.TlvByteString.bound({ length: 32 })),
    isForUpdateNOC: (0, matter_js_1.TlvOptionalField)(1, matter_js_1.TlvBoolean),
});
const TlvCertSigningRequestResponse = (0, matter_js_1.TlvObject)({
    elements: (0, matter_js_1.TlvField)(0, matter_js_1.TlvByteString.bound({ maxLength: exports.RESP_MAX })),
    signature: (0, matter_js_1.TlvField)(1, matter_js_1.TlvByteString.bound({ length: 64 })),
});
const TlvCertChainRequest = (0, matter_js_1.TlvObject)({
    type: (0, matter_js_1.TlvField)(0, (0, matter_js_1.TlvEnum)()),
});
const TlvCertChainResponse = (0, matter_js_1.TlvObject)({
    certificate: (0, matter_js_1.TlvField)(0, matter_js_1.TlvByteString.bound({ maxLength: 600 })),
});
const TlvAddNocRequest = (0, matter_js_1.TlvObject)({
    operationalCert: (0, matter_js_1.TlvField)(0, matter_js_1.TlvByteString.bound({ maxLength: 400 })),
    intermediateCaCert: (0, matter_js_1.TlvOptionalField)(1, matter_js_1.TlvByteString.bound({ maxLength: 400 })),
    identityProtectionKey: (0, matter_js_1.TlvField)(2, matter_js_1.TlvByteString.bound({ length: 16 })),
    caseAdminNode: (0, matter_js_1.TlvField)(3, SubjectId_1.TlvSubjectId),
    adminVendorId: (0, matter_js_1.TlvField)(4, VendorId_1.TlvVendorId),
});
const TlvUpdateNocRequest = (0, matter_js_1.TlvObject)({
    operationalCert: (0, matter_js_1.TlvField)(0, matter_js_1.TlvByteString.bound({ maxLength: 400 })),
    intermediateCaCert: (0, matter_js_1.TlvOptionalField)(1, matter_js_1.TlvByteString.bound({ maxLength: 400 })),
});
const TlvAddTrustedRootCertificateRequest = (0, matter_js_1.TlvObject)({
    certificate: (0, matter_js_1.TlvField)(0, matter_js_1.TlvByteString.bound({ maxLength: 400 })),
});
const TlvOperationalCertificateStatusResponse = (0, matter_js_1.TlvObject)({
    status: (0, matter_js_1.TlvField)(0, (0, matter_js_1.TlvEnum)()),
    fabricIndex: (0, matter_js_1.TlvOptionalField)(1, FabricIndex_1.TlvFabricIndex),
    debugText: (0, matter_js_1.TlvOptionalField)(2, matter_js_1.TlvString.bound({ maxLength: 128 })),
});
exports.TlvAttestation = (0, matter_js_1.TlvObject)({
    declaration: (0, matter_js_1.TlvField)(1, matter_js_1.TlvByteString),
    attestationNonce: (0, matter_js_1.TlvField)(2, matter_js_1.TlvByteString.bound({ length: 32 })),
    timestamp: (0, matter_js_1.TlvField)(3, matter_js_1.TlvUInt32),
    firmwareInfo: (0, matter_js_1.TlvOptionalField)(4, matter_js_1.TlvByteString),
});
exports.TlvCertSigningRequest = (0, matter_js_1.TlvObject)({
    certSigningRequest: (0, matter_js_1.TlvField)(1, matter_js_1.TlvByteString),
    certSigningRequestNonce: (0, matter_js_1.TlvField)(2, matter_js_1.TlvByteString.bound({ length: 32 })),
    vendorReserved1: (0, matter_js_1.TlvOptionalField)(3, matter_js_1.TlvByteString),
    vendorReserved2: (0, matter_js_1.TlvOptionalField)(4, matter_js_1.TlvByteString),
    vendorReserved3: (0, matter_js_1.TlvOptionalField)(5, matter_js_1.TlvByteString),
});
const TlvUpdateFabricLabelRequest = (0, matter_js_1.TlvObject)({
    label: (0, matter_js_1.TlvField)(0, matter_js_1.TlvString32max),
});
const TlvRemoveFabricRequest = (0, matter_js_1.TlvObject)({
    fabricIndex: (0, matter_js_1.TlvField)(0, FabricIndex_1.TlvFabricIndex),
});
exports.OperationalCredentialsCluster = (0, Cluster_1.Cluster)({
    id: 0x3e,
    name: "Operational Credentials",
    revision: 1,
    attributes: {
        nocs: (0, Cluster_1.Attribute)(0, (0, matter_js_1.TlvArray)(TlvNoc), { persistent: true, omitChanges: true, readAcl: 2 }),
        fabrics: (0, Cluster_1.Attribute)(1, (0, matter_js_1.TlvArray)(TlvFabricDescriptor), { persistent: true }),
        supportedFabrics: (0, Cluster_1.Attribute)(2, matter_js_1.TlvUInt8.bound({ min: 5, max: 254 })),
        commissionedFabrics: (0, Cluster_1.Attribute)(3, matter_js_1.TlvUInt8, { persistent: true }),
        trustedRootCertificates: (0, Cluster_1.Attribute)(4, (0, matter_js_1.TlvArray)(matter_js_1.TlvByteString, { maxLength: 400 }), { persistent: true, omitChanges: true }),
        currentFabricIndex: (0, Cluster_1.Attribute)(5, FabricIndex_1.TlvFabricIndex, { default: new FabricIndex_1.FabricIndex(0) }),
    },
    commands: {
        requestAttestation: (0, Cluster_1.Command)(0, TlvAttestationRequest, 1, TlvAttestationResponse),
        requestCertChain: (0, Cluster_1.Command)(2, TlvCertChainRequest, 3, TlvCertChainResponse),
        requestCertSigning: (0, Cluster_1.Command)(4, TlvCertSigningRequestRequest, 5, TlvCertSigningRequestResponse),
        addOperationalCert: (0, Cluster_1.Command)(6, TlvAddNocRequest, 8, TlvOperationalCertificateStatusResponse),
        updateOperationalCert: (0, Cluster_1.Command)(7, TlvUpdateNocRequest, 8, TlvOperationalCertificateStatusResponse),
        updateFabricLabel: (0, Cluster_1.Command)(9, TlvUpdateFabricLabelRequest, 8, TlvOperationalCertificateStatusResponse),
        removeFabric: (0, Cluster_1.Command)(10, TlvRemoveFabricRequest, 8, TlvOperationalCertificateStatusResponse),
        addRootCert: (0, Cluster_1.Command)(11, TlvAddTrustedRootCertificateRequest, 11, Cluster_1.TlvNoResponse),
    },
});
