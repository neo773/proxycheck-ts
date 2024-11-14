import fetch from "cross-fetch"

type Type =
  | "Residential"
  | "Wireless"
  | "Business"
  | "Hosting"
  | "TOR"
  | "SOCKS"
  | "SOCKS4"
  | "SOCKS4A"
  | "SOCKS5"
  | "SOCKS5H"
  | "Shadowsocks"
  | "HTTP"
  | "HTTPS"
  | "Compromised Server"
  | "Inference Engine"
  | "OpenVPN"
  | "VPN"
  | "whitelisted by x"
  | "blacklisted by x"

type Status = "ok" | "warning" | "denied" | "error"

export type IPAddressInfo = {
  ip?: string
  asn: string
  provider: string
  organisation: string
  continent: string
  continentcode: string
  country: string
  isocode: string
  region: string
  regioncode: string
  timezone: string
  city: string
  latitude: number
  longitude: number
  currency?: {
    code: string
    name: string
    symbol: string
  }
  vpn: "yes" | "no"
  proxy: "yes" | "no"
  type: Type
  risk: number
}

export type ProxyCheckResponse = {
  status: Status
  node?: string
  query_time?: string
} & (
  | {
      [ipAddress: string]: IPAddressInfo
    }
  | IPAddressInfo
)

interface ProxyCheckConstructor {
  api_key: string
}

interface ProxyCheckOptions {
  vpn?: 0 | 1 | 2 | 3
  asn?: 0 | 1
  node?: 0 | 1
  time?: 0 | 1
  inf?: 0 | 1
  risk?: 1 | 2
  port?: 0 | 1
  seen?: 0 | 1
  days?: number
  tag?: string
  cur?: 0 | 1
  short?: 0 | 1
}

interface ProxyCheckGetUsageReturn {
  error?: string
  burst_tokens_available: number
  burst_token_allowance: number
  burst_token_active: number
  queries_today: number
  daily_limit: number
  queries_total: number
  plan_tier: string
}

interface ProxyCheckDetectionHistory {
  time_formatted: string
  time_raw: string
  address: string
  country: string
  detection_type: string
  answering_node: string
  tag: string
}

interface ProxyCheckQueryHistory {
  proxies: string
  vpns: string
  undetected: string
  refused_queries: string
  total_queries: number
}

interface ProxyCheckGetDetectionsOptions {
  limit?: number
  offset?: number
}

const BASE_URL = "https://proxycheck.io"

class ProxyCheck {
  private api_key: string

  constructor({ api_key }: ProxyCheckConstructor) {
    this.api_key = api_key
  }
  async checkIP(ip: string | string[], options: ProxyCheckOptions = {}, timeout?: number) {
    const endpoint = Array.isArray(ip) ? "/v2/" : `/v2/${ip}`
    const url = new URL(`${BASE_URL}${endpoint}`)

    url.searchParams.append("key", this.api_key)

    for (const key in options) {
      url.searchParams.append(
        key,
        options[key as keyof ProxyCheckOptions]!.toString()
      )
    }

    if (Array.isArray(ip)) {
      url.searchParams.append("ips", ip.join(","))
      const response = await fetch(url.toString(), {
        method: "POST",
        body: url.searchParams,
        signal: AbortSignal.timeout(timeout)
      })
      return response.json() as unknown as ProxyCheckResponse
    } else {
      const response = await fetch(url.toString())
      const data = await response.json()
      return convertKeysToSnakeCase(data) as ProxyCheckResponse
    }
  }

  async getUsage() {
    const url = `${BASE_URL}/dashboard/export/usage/?key=${this.api_key}`
    const response = await fetch(url)
    const data = await response.json()
    return convertKeysToSnakeCase(data) as ProxyCheckGetUsageReturn
  }

  async getQueries() {
    const url = `${BASE_URL}/dashboard/export/queries/?json=1&key=${this.api_key}`
    const response = await fetch(url)
    const data = await response.json()
    return convertToArray(
      convertKeysToSnakeCase(data)
    ) as ProxyCheckQueryHistory[]
  }

  async getDetections(options: ProxyCheckGetDetectionsOptions = {}) {
    const limit = options.limit ?? 100
    const offset = options.offset ?? 0
    const url = `${BASE_URL}/dashboard/export/detections/?json=1&key=${this.api_key}&limit=${limit}&offset=${offset}`
    const response = await fetch(url)
    const data = await response.json()
    return convertToArray(
      convertKeysToSnakeCase(data)
    ) as ProxyCheckDetectionHistory[]
  }
}

const convertToArray = (obj: any) => {
  const result = []
  for (const key in obj) {
    result.push(obj[key])
  }
  return result
}

function convertKeysToSnakeCase<T extends Object>(obj: T): T {
  const snakeCaseObj = {}

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const snakeCaseKey = key.toLowerCase().replaceAll(" ", "_")

      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        // @ts-ignore
        snakeCaseObj[snakeCaseKey] = convertKeysToSnakeCase(obj[key as keyof T])
      } else {
        // @ts-ignore
        snakeCaseObj[snakeCaseKey] = obj[key]
      }
    }
  }

  // @ts-ignore
  return snakeCaseObj
}

export default ProxyCheck
