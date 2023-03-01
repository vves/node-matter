"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AttributeGetterServer = exports.AttributeServer = void 0;
class AttributeServer {
    constructor(id, name, schema, validator, isWritable, defaultValue) {
        this.id = id;
        this.name = name;
        this.schema = schema;
        this.validator = validator;
        this.isWritable = isWritable;
        this.version = 0;
        this.matterListeners = new Array();
        this.listeners = new Array();
        validator(defaultValue, name);
        this.value = defaultValue;
    }
    set(value, session) {
        this.setLocal(value);
    }
    setLocal(value) {
        const oldValue = this.value;
        if (value !== oldValue) {
            this.validator(value, this.name);
            this.version++;
            this.value = value;
            this.matterListeners.forEach(listener => listener(value, this.version));
        }
        this.listeners.forEach(listener => listener(value, oldValue));
    }
    get(session) {
        return this.getLocal();
    }
    getWithVersion(session) {
        return { version: this.version, value: this.get(session) };
    }
    getLocal() {
        return this.value;
    }
    addMatterListener(listener) {
        this.matterListeners.push(listener);
    }
    removeMatterListener(listener) {
        this.matterListeners.splice(this.matterListeners.findIndex(item => item === listener), 1);
    }
    addListener(listener) {
        this.listeners.push(listener);
    }
    removeListener(listener) {
        this.listeners.splice(this.listeners.findIndex(item => item === listener), 1);
    }
}
exports.AttributeServer = AttributeServer;
class AttributeGetterServer extends AttributeServer {
    constructor(id, name, schema, validator, isWritable, defaultValue, getter) {
        super(id, name, schema, validator, isWritable, defaultValue);
        this.getter = getter;
    }
    setLocal(value) {
        throw new Error("Setter is not supported on attribute defined by a getter");
    }
    get(session) {
        return this.getter(session);
    }
}
exports.AttributeGetterServer = AttributeGetterServer;
