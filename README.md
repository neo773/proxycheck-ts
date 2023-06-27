# ProxyCheck

ProxyCheck is a Type Safe Node.js library for interacting with the ProxyCheck.io API. This library provides an easy-to-use interface for checking if an IP address is a proxy, VPN, or has been involved in any malicious activities. It also provides usage statistics, query history, and detection history from your ProxyCheck.io account.

### Installation

```bash
npm install --save proxycheck-ts
```

### Usage

```javascript
import ProxyCheck from 'proxycheck-ts'

const proxyCheck = new ProxyCheck({ api_key: 'your-api-key' });

// Check single IP
proxyCheck.checkIP('8.8.8.8').then(console.log).catch(console.error);

// Check multiple IPs
proxyCheck.checkIP(['8.8.8.8', '8.8.4.4']).then(console.log).catch(console.error);

// Get usage
proxyCheck.getUsage().then(console.log).catch(console.error);

// Get queries
proxyCheck.getQueries().then(console.log).catch(console.error);

// Get detections
proxyCheck.getDetections({ limit: 10, offset: 0 }).then(console.log).catch(console.error);
```

### Methods

- `checkIP(ip: string | string[], options: ProxyCheckOptions = {})`: Checks if an IP or array of IPs are proxies or VPNs. Returns a `ProxyCheckResponse`.

- `getUsage()`: Retrieves your ProxyCheck.io account usage. Returns a `ProxyCheckGetUsageReturn`.

- `getQueries()`: Retrieves your ProxyCheck.io account query history. Returns a `ProxyCheckQueryHistory[]`.

- `getDetections(options: ProxyCheckGetDetectionsOptions = {})`: Retrieves your ProxyCheck.io account detection history. Returns a `ProxyCheckDetectionHistory[]`.

### Types

For detailed information on the data types returned by these methods, refer to the code comments in the library.

### Note

This library is not officially affiliated with ProxyCheck.io.

### License

MIT