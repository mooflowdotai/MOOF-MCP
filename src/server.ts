import { randomUUID } from "node:crypto";
import express, { Request, Response } from "express";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { Server } from "http";
import { Logger } from "./logger.js";
import { ServerConfig } from "./config.js";
import { MoofMcpServer } from "./mcp.js";

let httpServer: Server | null = null;
const transports = {
  streamable: {} as Record<string, StreamableHTTPServerTransport>,
  sse: {} as Record<string, SSEServerTransport>,
};

export async function startHttpServer(
  port: number,
  serverConfig: ServerConfig
): Promise<void> {
  const app = express();
  app.get("/sse", async (req, res) => {
    Logger.log("Establishing new SSE connection");
    const moofApiKey =
      (req.query.moofApiKey as string) || serverConfig.moofApiKey;
    const mcpApiKey = (req.query.mcpApiKey as string) || serverConfig.mcpApiKey;

    const transport = new SSEServerTransport("/messages", res);
    transports.sse[transport.sessionId] = transport;
    Logger.log(
      `New SSE connection established for sessionId ${transport.sessionId}`
    );
    Logger.log("/sse request headers:", req.headers);

    transports.sse[transport.sessionId] = transport;
    res.on("close", () => {
      delete transports.sse[transport.sessionId];
    });

    const mcpServer = new MoofMcpServer(
      moofApiKey,
      mcpApiKey,
      serverConfig.baseUrl,
      serverConfig.mcpBaseUrl
    );

    await mcpServer.connect(transport);
  });

  app.post("/messages", async (req, res) => {
    const sessionId = req.query.sessionId as string;
    const transport = transports.sse[sessionId];
    if (transport) {
      Logger.log(`Received SSE message for sessionId ${sessionId}`);
      Logger.log("/messages request headers:", req.headers);
      Logger.log("/messages request body:", req.body);
      await transport.handlePostMessage(req, res);
    } else {
      res.status(400).send(`No transport found for sessionId ${sessionId}`);
      return;
    }
  });

  httpServer = app.listen(port, () => {
    Logger.log(`HTTP server listening on port ${port}`);
    Logger.log(`SSE endpoint available at http://localhost:${port}/sse`);
    Logger.log(
      `Message endpoint available at http://localhost:${port}/messages`
    );
    Logger.log(
      `StreamableHTTP endpoint available at http://localhost:${port}/mcp`
    );
  });

  process.on("SIGINT", async () => {
    Logger.log("Shutting down server...");

    // Close all active transports to properly clean up resources
    await closeTransports(transports.sse);
    await closeTransports(transports.streamable);

    Logger.log("Server shutdown complete");
    process.exit(0);
  });
}

async function closeTransports(
  transports: Record<string, SSEServerTransport | StreamableHTTPServerTransport>
) {
  for (const sessionId in transports) {
    try {
      await transports[sessionId].close();
      delete transports[sessionId];
    } catch (error) {
      console.error(`Error closing transport for session ${sessionId}:`, error);
    }
  }
}

export async function stopHttpServer(): Promise<void> {
  if (!httpServer) {
    throw new Error("HTTP server is not running");
  }

  return new Promise((resolve, reject) => {
    httpServer!.close((err: Error | undefined) => {
      if (err) {
        reject(err);
        return;
      }
      httpServer = null;
      const closing = Object.values(transports.sse).map((transport) => {
        return transport.close();
      });
      Promise.all(closing).then(() => {
        resolve();
      });
    });
  });
}
