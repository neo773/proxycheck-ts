var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);
var import_node_fetch = __toESM(require("node-fetch"), 1);
var BASE_URL = "https://proxycheck.io";
var ProxyCheck = class {
  api_key;
  constructor({ api_key }) {
    this.api_key = api_key;
  }
  async checkIP(ip, options = {}) {
    const endpoint = Array.isArray(ip) ? "/v2/" : `/v2/${ip}`;
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append("key", this.api_key);
    for (const key in options) {
      url.searchParams.append(
        key,
        options[key].toString()
      );
    }
    if (Array.isArray(ip)) {
      url.searchParams.append("ips", ip.join(","));
      const response = await (0, import_node_fetch.default)(url.toString(), {
        method: "POST",
        body: url.searchParams
      });
      return response.json();
    } else {
      const response = await (0, import_node_fetch.default)(url.toString());
      const data = await response.json();
      return convertKeysToSnakeCase(data);
    }
  }
  async getUsage() {
    const url = `${BASE_URL}/dashboard/export/usage/?key=${this.api_key}`;
    const response = await (0, import_node_fetch.default)(url);
    const data = await response.json();
    return convertKeysToSnakeCase(data);
  }
  async getQueries() {
    const url = `${BASE_URL}/dashboard/export/queries/?json=1&key=${this.api_key}`;
    const response = await (0, import_node_fetch.default)(url);
    const data = await response.json();
    return convertToArray(
      convertKeysToSnakeCase(data)
    );
  }
  async getDetections(options = {}) {
    const limit = options.limit ?? 100;
    const offset = options.offset ?? 0;
    const url = `${BASE_URL}/dashboard/export/detections/?json=1&key=${this.api_key}&limit=${limit}&offset=${offset}`;
    const response = await (0, import_node_fetch.default)(url);
    const data = await response.json();
    return convertToArray(
      convertKeysToSnakeCase(data)
    );
  }
};
var convertToArray = (obj) => {
  const result = [];
  for (const key in obj) {
    result.push(obj[key]);
  }
  return result;
};
function convertKeysToSnakeCase(obj) {
  const snakeCaseObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const snakeCaseKey = key.toLowerCase().replaceAll(" ", "_");
      if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
        snakeCaseObj[snakeCaseKey] = convertKeysToSnakeCase(obj[key]);
      } else {
        snakeCaseObj[snakeCaseKey] = obj[key];
      }
    }
  }
  return snakeCaseObj;
}
var src_default = ProxyCheck;
