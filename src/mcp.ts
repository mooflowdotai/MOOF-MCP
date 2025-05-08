import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { Transport } from "@modelcontextprotocol/sdk/shared/transport.js";
import yaml from "js-yaml";
import { Logger } from "./logger.js";
import fetch from "node-fetch";
import { FlowResponse } from "./type.js";
import { z } from "zod";
import { customAlphabet } from "nanoid";

export class MoofMcpServer extends McpServer {
  private readonly moofApiKey: string;
  private readonly mcpApiKey: string;
  private readonly baseUrl: string;
  private readonly mcpBaseUrl: string;

  constructor(
    moofApiKey: string,
    mcpApiKey: string,
    baseUrl: string,
    mcpBaseUrl: string
  ) {
    super(
      { name: "Moof MCP Server", version: "0.1.0" },
      { capabilities: { logging: {}, tools: {} } }
    );

    this.moofApiKey = moofApiKey;
    this.mcpApiKey = mcpApiKey;
    this.baseUrl = baseUrl;
    this.mcpBaseUrl = mcpBaseUrl;

    this.registerTools();
  }

  private registerTools(): void {
    this.tool(
      "get_published_flows",
      "Fetches published flow list from MOOF.",
      {},
      async () => {
        try {
          const response = await fetch(
            `${this.baseUrl}/api/v1/flows/flow_published/`
          );

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const data = (await response.json()) as FlowResponse[];

          const simplified = data.map((flow) => ({
            id: flow.id,
            name: flow.name,
            description: flow.description,
            fork_count: flow.fork_count,
            webhook: flow.webhook,
          }));

          return {
            content: [
              {
                type: "text",
                text: yaml.dump(simplified),
              },
            ],
          };
        } catch (err) {
          Logger.error("MOOF flow fetch error:", err);
          return this.errorContent(err);
        }
      }
    );

    this.tool(
      "create_flow_from_template",
      "Clones a published flow template on MOOF using its flow ID.",
      {
        flow_id: z
          .string()
          .uuid()
          .describe("UUID of the template flow to clone"),
      },
      async ({ flow_id }) => {
        try {
          if (!this.moofApiKey) {
            throw new Error("Missing API key. Set it via constructor.");
          }

          const headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-api-key": this.moofApiKey,
          };

          const res = await fetch(
            `${this.baseUrl}/api/v1/flows/fork?origin_template_id=${flow_id}`,
            {
              method: "POST",
              headers,
            }
          );

          if (!res.ok) {
            const err = await res.text();
            throw new Error(`Failed to create flow: ${res.status} ${err}`);
          }

          const json = (await res.json()) as FlowResponse;

          return {
            content: [
              {
                type: "text",
                text: `✅ Created new flow: ${json.name}\n👉 ${json.description}\n🔗 ${this.baseUrl}/flow/${json.id}`,
              },
            ],
          };
        } catch (err) {
          Logger.error("MOOF flow creation error:", err);
          return this.errorContent(err);
        }
      }
    );

    this.tool(
      "get_user_flows",
      "Fetch the 5 most recent flows created by the authenticated user (requires x-api-key).",
      {},
      async () => {
        try {
          if (!this.moofApiKey) {
            throw new Error("Missing API key. Set it via constructor.");
          }

          const headers = {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-api-key": this.moofApiKey,
          };

          const res = await fetch(
            `${this.baseUrl}/api/v1/flows/?get_all=true&header_flows=true`,
            { method: "GET", headers }
          );

          if (!res.ok) {
            const err = await res.text();
            throw new Error(`Failed to fetch user flows: ${res.status} ${err}`);
          }

          const flows = (await res.json()) as FlowResponse[];

          const simplified = flows
            .sort(
              (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
            )
            .slice(0, 5)
            .map((f) => ({
              id: f.id,
              name: f.name,
              description: f.description,
              fork_count: f.fork_count,
              webhook: f.webhook,
            }));

          return {
            content: [
              {
                type: "text",
                text: yaml.dump(simplified),
              },
            ],
          };
        } catch (err) {
          Logger.error("MOOF user flow fetch error:", err);
          return this.errorContent(err);
        }
      }
    );

    // Tool: Publish flow
    this.tool(
      "publish_flow",
      "Set access_type of a flow to PUBLIC (visible in store). Requires x-api-key.",
      z.object({
        flow_id: z
          .string()
          .uuid("Must be a valid UUID")
          .describe("ID of the flow to publish"),
      }).shape,
      async ({ flow_id }) => {
        try {
          if (!this.moofApiKey)
            throw new Error("Missing API key. Set it via constructor.");

          const res = await fetch(`${this.baseUrl}/api/v1/flows/${flow_id}`, {
            method: "PATCH",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "x-api-key": this.moofApiKey,
            },
            body: JSON.stringify({ access_type: "PUBLIC" }),
          });

          if (!res.ok) {
            const err = await res.text();
            throw new Error(`Failed to publish flow: ${res.status} ${err}`);
          }

          const json = (await res.json()) as FlowResponse;
          return {
            content: [
              {
                type: "text",
                text: `✅ Published: "${json.name}"\nID: ${json.id}`,
              },
            ],
          };
        } catch (err) {
          Logger.error("Publish flow error:", err);
          return this.errorContent(err);
        }
      }
    );

    // Tool: Unpublish flow
    this.tool(
      "unpublish_flow",
      "Set access_type of a flow to PRIVATE (hide from store). Requires x-api-key.",
      z.object({
        flow_id: z
          .string()
          .uuid("Must be a valid UUID")
          .describe("ID of the flow to unpublish"),
      }).shape,
      async ({ flow_id }) => {
        try {
          if (!this.moofApiKey)
            throw new Error("Missing API key. Set it via constructor.");

          const res = await fetch(`${this.baseUrl}/api/v1/flows/${flow_id}`, {
            method: "PATCH",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "x-api-key": this.moofApiKey,
            },
            body: JSON.stringify({ access_type: "PRIVATE" }),
          });

          if (!res.ok) {
            const err = await res.text();
            throw new Error(`Failed to unpublish flow: ${res.status} ${err}`);
          }

          const json = (await res.json()) as FlowResponse;
          return {
            content: [
              {
                type: "text",
                text: `✅ Unpublished: "${json.name}"\nID: ${json.id}`,
              },
            ],
          };
        } catch (err) {
          Logger.error("Unpublish flow error:", err);
          return this.errorContent(err);
        }
      }
    );

    this.tool(
      "create_mcp_from_github_link",
      "Create a new MCP server from a public GitHub repository link (supports Phala deploy & custom environment).",
      z.object({
        github_url: z
          .string()
          .url()
          .describe(
            "Public GitHub repository URL, e.g. https://github.com/user/repo"
          ),
        is_phala_hosted: z
          .boolean()
          .optional()
          .default(false)
          .describe("Set true to host on Phala. Default is false."),
        env_string: z
          .string()
          .optional()
          .describe(
            `Optional environment variables as plain string.
        Format: "RPC_URL=https://... API_KEY=abc123"`
          ),
      }).shape,
      async ({ github_url, is_phala_hosted = false, env_string = "" }) => {
        try {
          function parseEnvString(envString: string): Record<string, string> {
            const entries = envString.match(/\b(\w+)=([^\s]+)/g);
            return (
              entries?.reduce((acc, entry) => {
                const [key, value] = entry.split("=");
                acc[key] = value;
                return acc;
              }, {} as Record<string, string>) || {}
            );
          }

          // then in your tool logic:
          const env = parseEnvString(env_string ?? "");

          if (!this.mcpApiKey)
            throw new Error("Missing API key. Set it via constructor.");

          const parsed = this.parseGithubUrl(github_url);
          if (!parsed)
            return {
              content: [
                {
                  type: "text",
                  text: "❌ Invalid GitHub URL. Must be in the format: https://github.com/{owner}/{repo}",
                },
              ],
            };

          const { repo_owner, repo_name, branch } = parsed;

          // 🛡 Step 1: Validate repo before creation
          const validateRes = await fetch(
            `${this.mcpBaseUrl}/creator/github/validate?owner=${repo_owner}&repo=${repo_name}&branch=${branch}`,
            {
              method: "GET",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                "x-api-key": this.mcpApiKey,
              },
            }
          );

          const validateJson = (await validateRes.json()) as any;

          if (!validateJson?.data?.valid) {
            return {
              content: [
                {
                  type: "text",
                  text:
                    validateJson?.data?.message ??
                    "❌ Repository failed validation. Please check required files.",
                },
              ],
            };
          }

          // 🛠 Step 2: Proceed with MCP creation
          const nanoid = customAlphabet(
            "abcdefghijklmnopqrstuvwxyz0123456789",
            6
          );
          const qualified_name = `${repo_name}-${nanoid()}`;

          const body = {
            qualified_name,
            base_directory: ".",
            local: false,
            repo_owner,
            repo_name,
            branch,
            is_phala_hosted,
            env,
          };

          const res = await fetch(`${this.mcpBaseUrl}/creator/mcp/new`, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              "x-api-key": this.mcpApiKey,
            },
            body: JSON.stringify(body),
          });

          if (!res.ok) {
            const errText = await res.text();
            throw new Error(`Failed to create MCP: ${res.status} ${errText}`);
          }

          const json = (await res.json()) as any;

          const uiUrl = `${this.baseUrl}/servers/others/detail/${json?.data?.server?.id}?tab=deployments`;

          return {
            content: [
              {
                type: "text",
                text: `✅ MCP request created successfully!\n🔗 Open in MOOF: ${uiUrl}`,
              },
              {
                type: "text",
                text: yaml.dump(json),
              },
            ],
          };
        } catch (err) {
          Logger.error("Create MCP from GitHub error:", err);
          return this.errorContent(err);
        }
      }
    );
  }

  private parseGithubUrl(
    url: string
  ): { repo_owner: string; repo_name: string; branch: string } | null {
    try {
      const parsed = new URL(url);
      if (parsed.hostname !== "github.com") return null;

      const [owner, repo, tree, branch] = parsed.pathname
        .split("/")
        .filter(Boolean);

      if (!owner || !repo) return null;

      return {
        repo_owner: owner,
        repo_name: repo,
        branch: branch || "main",
      };
    } catch {
      return null;
    }
  }

  private errorContent(err: unknown) {
    return {
      isError: true,
      content: [
        {
          type: "text" as const,
          text: `Error: ${err instanceof Error ? err.message : String(err)}`,
        },
      ],
    };
  }

  async connect(transport: Transport): Promise<void> {
    await super.connect(transport);

    const originalStdoutWrite = process.stdout.write.bind(process.stdout);
    process.stdout.write = (chunk: any, encoding?: any, callback?: any) => {
      if (typeof chunk === "string" && !chunk.trim().startsWith("{")) {
        return true;
      }
      return originalStdoutWrite(chunk, encoding, callback);
    };

    Logger.log("MOOF MCP server is running.");
  }
}
