# MOOF MCP Server 🚀
## ✨ Overview

This MCP server connects to [MOOF](https://app.moof.fun), a platform for building and sharing powerful AI flows and agents.

### 🔧 Features:

- 📜 Fetch public flow templates
- ✂️ Fork flows from templates
- 👤 Fetch authenticated user’s flows
- 🚀 Publish/unpublish flows to/from the shared flow store
- 🛠️ Deploy MCP servers from GitHub (with optional Phala hosting + env vars)

---

## ⚙️ Setup Options

### Option 1: Run via `npx` (no install)

```bash
MOOF_API_KEY=your-moof-key MCP_API_KEY=your-mcp-key npx -y moof-mcp --stdio
```

---

### Option 2: Run locally (recommended for development)

```bash
git clone https://github.com/your-org/moof-mcp
cd moof-mcp
npm install
```

Create a `.env` file:

```env
MOOF_API_KEY=your-moof-key
MCP_API_KEY=your-mcp-key
BASE_URL=https://app.moof.fun
MCP_BASE_URL=https://dev-mcp-api.moof.fun
```

Then build and run:

```bash
npm run build
node build/index.js --stdio
```

---

## 🧐 Use with Claude Desktop (or other MCP clients)

Register this server as a **Stdio Tool**:

### Claude `.tools` config

```json
{
  "command": "npx",
  "args": ["-y", "moof-mcp", "--stdio"],
  "env": {
    "MOOF_API_KEY": "your-moof-key",
    "MCP_API_KEY": "your-mcp-key"
  },
  "type": "stdio",
  "port": 3000
}
```

Paste into Claude Desktop under **Add Custom Tool → Stdio Tool**.

---

## 🛠️ Available Tools

| Tool ID                       | Description                                                   |
| ----------------------------- | ------------------------------------------------------------- |
| `get_published_flows`         | Fetches all public flow templates on MOOF                     |
| `create_flow_from_template`   | Forks a new flow using a given template ID (`flow_id`)        |
| `get_user_flows`              | Returns up to 5 most recent flows owned by the API key's user |
| `publish_flow`                | Publishes a flow (sets `access_type = PUBLIC`)                |
| `unpublish_flow`              | Unpublishes a flow (sets `access_type = PRIVATE`)             |
| `create_mcp_from_github_link` | Deploys a new MCP server from a public GitHub repository      |

---

## 🧠 Tool: `create_mcp_from_github_link`

This tool lets you **deploy a new MCP server from any public GitHub repository**, optionally hosted on **Phala** and configured with **custom environment variables**.

| Field             | Type                                   | Description                                                                                    |
| ----------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `github_url`      | `string` (required)                    | Public GitHub repository URL. Example: `https://github.com/user/repo`                          |
| `is_phala_hosted` | `boolean` (optional, default: `false`) | Set to `true` to deploy on [Phala](https://phala.network/).                                    |
| `env`             | `record<string,string>` (optional)     | Environment variables in `KEY=VALUE` format. Can be passed directly in the prompt (see below). |

### 🔊 Example Prompts (Claude, Cursor, etc.)

```
Deploy this MCP to Phala from https://github.com/mooflowdotai/solana-quicknode-mcp
with env RPC_URL=https://example.solana.rpc API_KEY=sk-test-abc123
```

```
Create MCP from https://github.com/user/repo with env: RPC_URL=https://... NODE_ENV=production
```

> 💡 **Pro tip**: If `env` doesn't get picked up, try using `env:` to prefix your environment variables clearly in the prompt.

---

## 🔪 Development Workflow

```bash
npm run watch
```

Or:

```bash
npm run build
MOOF_API_KEY=your-moof-key MCP_API_KEY=your-mcp-key node build/index.js --stdio
```

---

## 📝 License

MIT
