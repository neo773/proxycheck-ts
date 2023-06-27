"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = __importDefault(require("node-fetch"));
const BASE_URL = "https://proxycheck.io";
class ProxyCheck {
    api_key;
    constructor({ api_key }) {
        this.api_key = api_key;
    }
    async checkIP(ip, options = {}) {
        const endpoint = Array.isArray(ip) ? "/v2/" : `/v2/${ip}`;
        const url = new URL(`${BASE_URL}${endpoint}`);
        url.searchParams.append("key", this.api_key);
        for (const key in options) {
            url.searchParams.append(key, options[key].toString());
        }
        if (Array.isArray(ip)) {
            url.searchParams.append("ips", ip.join(","));
            const response = await (0, node_fetch_1.default)(url.toString(), {
                method: "POST",
                body: url.searchParams,
            });
            return response.json();
        }
        else {
            const response = await (0, node_fetch_1.default)(url.toString());
            const data = await response.json();
            return convertKeysToSnakeCase(data);
        }
    }
    async getUsage() {
        const url = `${BASE_URL}/dashboard/export/usage/?key=${this.api_key}`;
        const response = await (0, node_fetch_1.default)(url);
        const data = await response.json();
        return convertKeysToSnakeCase(data);
    }
    async getQueries() {
        const url = `${BASE_URL}/dashboard/export/queries/?json=1&key=${this.api_key}`;
        const response = await (0, node_fetch_1.default)(url);
        const data = await response.json();
        return convertToArray(convertKeysToSnakeCase(data));
    }
    async getDetections(options = {}) {
        const limit = options.limit ?? 100;
        const offset = options.offset ?? 0;
        const url = `${BASE_URL}/dashboard/export/detections/?json=1&key=${this.api_key}&limit=${limit}&offset=${offset}`;
        const response = await (0, node_fetch_1.default)(url);
        const data = await response.json();
        return convertToArray(convertKeysToSnakeCase(data));
    }
}
const convertToArray = (obj) => {
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
            if (typeof obj[key] === "object" &&
                obj[key] !== null &&
                !Array.isArray(obj[key])) {
                // @ts-ignore
                snakeCaseObj[snakeCaseKey] = convertKeysToSnakeCase(obj[key]);
            }
            else {
                // @ts-ignore
                snakeCaseObj[snakeCaseKey] = obj[key];
            }
        }
    }
    // @ts-ignore
    return snakeCaseObj;
}
exports.default = ProxyCheck;
