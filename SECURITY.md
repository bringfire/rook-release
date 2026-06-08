# Security Policy

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability in Rook, report it through GitHub's private vulnerability reporting:

1. Go to the [Security tab](../../security) of this repository
2. Click **Report a vulnerability**
3. Fill in the details

You can expect an initial response within 7 days. Once a fix is available, we'll coordinate disclosure with you.

## What to include

- A description of the vulnerability and its impact
- Steps to reproduce, ideally with a minimal repro case
- Affected versions if known
- Any suggested mitigations

## Scope

In scope:
- The C++ native plugin (`src/RookNative/`) and its HTTP server
- The C# companion plugin (`src/Rook/`)
- The Python MCP server (`mcp_server/`) and its agents
- The chat server and any HTTP endpoints exposed by Rook

Out of scope:
- Vulnerabilities in upstream dependencies (Rhino SDK, Grasshopper SDK, third-party Python packages) — please report those to their maintainers directly
- Issues that require local administrator access on the user's machine
- Theoretical attacks without a demonstrated impact path

## Supported versions

Only the latest released version of Rook receives security fixes. Users on older versions should upgrade.

## Disclosure policy

We follow coordinated disclosure. Once a fix ships, we publish a security advisory describing the issue and credit the reporter (unless they prefer to remain anonymous).
