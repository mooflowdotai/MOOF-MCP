import { config } from "dotenv";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

// Load .env variables
config();

export interface ServerConfig {
  port: number;
  moofApiKey: string;
  mcpApiKey: string;
  baseUrl: string;
  mcpBaseUrl: string;
  configSources: {
    port: "cli" | "env" | "default";
    moofApiKey: "env" | "missing";
    mcpApiKey: "env" | "missing";
    baseUrl: "env" | "default";
    mcpBaseUrl: "env" | "derived";
  };
}

interface CliArgs {
  port?: number;
}

export function getServerConfig(isStdioMode = false): ServerConfig {
  const argv = yargs(hideBin(process.argv))
    .options({
      port: {
        type: "number",
        description: "Port to run the server on",
      },
    })
    .help()
    .version("0.1.0")
    .parseSync() as CliArgs;

  const rawBaseUrl = process.env.BASE_URL || "https://app.moof.fun";
  const mcpBaseUrl =
    process.env.MCP_BASE_URL || "https://dev-mcp-api.mooflow.ai";

  const config: ServerConfig = {
    port: 3000,
    moofApiKey: process.env.MOOF_API_KEY || "",
    mcpApiKey: process.env.MCP_API_KEY || "",
    baseUrl: rawBaseUrl,
    mcpBaseUrl: mcpBaseUrl,
    configSources: {
      port: "default",
      moofApiKey: process.env.MOOF_API_KEY ? "env" : "missing",
      mcpApiKey: process.env.MCP_API_KEY ? "env" : "missing",
      baseUrl: process.env.BASE_URL ? "env" : "default",
      mcpBaseUrl: process.env.MCP_BASE_URL ? "env" : "derived",
    },
  };

  if (argv.port) {
    config.port = argv.port;
    config.configSources.port = "cli";
  } else if (process.env.PORT) {
    config.port = parseInt(process.env.PORT, 10);
    config.configSources.port = "env";
  }

  if (!isStdioMode) {
    console.log("\nConfiguration:");
    console.log(
      `- PORT: ${config.port} (source: ${config.configSources.port})`
    );
    console.log(
      `- BASE_URL: ${config.baseUrl} (source: ${config.configSources.baseUrl})`
    );
    console.log(
      `- MCP_BASE_URL: ${config.mcpBaseUrl} (source: ${config.configSources.mcpBaseUrl})`
    );
    console.log(
      config.moofApiKey
        ? "- MOOF_API_KEY: [loaded from env]"
        : "- MOOF_API_KEY: MISSING ⚠️"
    );
    console.log(
      config.mcpApiKey
        ? "- MCP_API_KEY: [loaded from env]"
        : "- MCP_API_KEY: MISSING ⚠️"
    );
    console.log();
  }

  return config;
}
