type Type = "Residential" | "Wireless" | "Business" | "Hosting" | "TOR" | "SOCKS" | "SOCKS4" | "SOCKS4A" | "SOCKS5" | "SOCKS5H" | "Shadowsocks" | "HTTP" | "HTTPS" | "Compromised Server" | "Inference Engine" | "OpenVPN" | "VPN" | "whitelisted by x" | "blacklisted by x";
type Status = "ok" | "warning" | "denied" | "error";
type IPAddressInfo = {
    ip?: string;
    asn: string;
    provider: string;
    organisation: string;
    continent: string;
    continentcode: string;
    country: string;
    isocode: string;
    region: string;
    regioncode: string;
    timezone: string;
    city: string;
    latitude: number;
    longitude: number;
    currency?: {
        code: string;
        name: string;
        symbol: string;
    };
    vpn: "yes" | "no";
    proxy: "yes" | "no";
    type: Type;
    risk: number;
};
type ProxyCheckResponse = {
    status: Status;
    node?: string;
    query_time?: string;
} & ({
    [ipAddress: string]: IPAddressInfo;
} | IPAddressInfo);
interface ProxyCheckConstructor {
    api_key: string;
}
interface ProxyCheckOptions {
    vpn?: 0 | 1 | 2 | 3;
    asn?: 0 | 1;
    node?: 0 | 1;
    time?: 0 | 1;
    inf?: 0 | 1;
    risk?: 1 | 2;
    port?: 0 | 1;
    seen?: 0 | 1;
    days?: number;
    tag?: string;
    cur?: 0 | 1;
    short?: 0 | 1;
}
interface ProxyCheckGetUsageReturn {
    error?: string;
    burst_tokens_available: number;
    burst_token_allowance: number;
    burst_token_active: number;
    queries_today: number;
    daily_limit: number;
    queries_total: number;
    plan_tier: string;
}
interface ProxyCheckDetectionHistory {
    time_formatted: string;
    time_raw: string;
    address: string;
    country: string;
    detection_type: string;
    answering_node: string;
    tag: string;
}
interface ProxyCheckQueryHistory {
    proxies: string;
    vpns: string;
    undetected: string;
    refused_queries: string;
    total_queries: number;
}
interface ProxyCheckGetDetectionsOptions {
    limit?: number;
    offset?: number;
}
declare class ProxyCheck {
    private api_key;
    constructor({ api_key }: ProxyCheckConstructor);
    checkIP(ip: string | string[], options?: ProxyCheckOptions, timeout?: number): Promise<ProxyCheckResponse>;
    getUsage(): Promise<ProxyCheckGetUsageReturn>;
    getQueries(): Promise<ProxyCheckQueryHistory[]>;
    getDetections(options?: ProxyCheckGetDetectionsOptions): Promise<ProxyCheckDetectionHistory[]>;
}

export { IPAddressInfo, ProxyCheckResponse, ProxyCheck as default };
