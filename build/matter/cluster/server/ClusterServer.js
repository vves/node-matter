"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UseOptionalAttributes = void 0;
const MakeAttributesMandatory = (attributes, conf) => {
    const result = Object.assign({}, attributes);
    for (const key in conf) {
        result[key] = Object.assign(Object.assign({}, result[key]), { optional: false });
    }
    return result;
};
const UseOptionalAttributes = (cluster, conf) => (Object.assign(Object.assign({}, cluster), { attributes: MakeAttributesMandatory(cluster.attributes, conf) }));
exports.UseOptionalAttributes = UseOptionalAttributes;
