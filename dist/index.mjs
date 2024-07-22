// src/index.ts
import fetch from "cross-fetch";
var BASE_URL = "https://proxycheck.io";
var ProxyCheck = class {
  api_key;
  constructor({ api_key }) {
    this.api_key = api_key;
  }
  async checkIP(ip, options = {}, timeout) {
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
      const response = await fetch(url.toString(), {
        method: "POST",
        body: url.searchParams,
        signal: AbortSignal.timeout(timeout)
      });
      return response.json();
    } else {
      const response = await fetch(url.toString());
      const data = await response.json();
      return convertKeysToSnakeCase(data);
    }
  }
  async getUsage() {
    const url = `${BASE_URL}/dashboard/export/usage/?key=${this.api_key}`;
    const response = await fetch(url);
    const data = await response.json();
    return convertKeysToSnakeCase(data);
  }
  async getQueries() {
    const url = `${BASE_URL}/dashboard/export/queries/?json=1&key=${this.api_key}`;
    const response = await fetch(url);
    const data = await response.json();
    return convertToArray(
      convertKeysToSnakeCase(data)
    );
  }
  async getDetections(options = {}) {
    const limit = options.limit ?? 100;
    const offset = options.offset ?? 0;
    const url = `${BASE_URL}/dashboard/export/detections/?json=1&key=${this.api_key}&limit=${limit}&offset=${offset}`;
    const response = await fetch(url);
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
export {
  src_default as default
};
