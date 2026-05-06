# Security Policy

## Supported Versions

| Version | Supported |
|---|---|
| 1.2.x | Yes |
| < 1.2 | No |

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Email **markyu0615@gmail.com** with:

- A description of the vulnerability and its potential impact
- Steps to reproduce or proof-of-concept code
- Any suggested mitigations

You should receive a response within 72 hours. If the vulnerability is confirmed, a fix will be prioritized and released as a patch.

## Scope

This is a client-side SPA with no backend, no user authentication, and no stored credentials. It uses only public APIs that require no API keys.

The most likely vulnerability classes relevant to this project:

- **XSS** via unsanitized API response data rendered as HTML
- **Dependency vulnerabilities** in npm packages
- **Sensitive data exposure** if API keys were accidentally committed (none are used, but worth noting)

Out of scope:

- Issues in third-party APIs (CoinGecko, Binance, etc.) — report those to the respective providers
- Issues that require physical access to a user's device
- Social engineering attacks
