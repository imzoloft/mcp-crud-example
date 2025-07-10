import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { container } from './inversify.config';
import { TYPES } from './types';
import { MCP } from './services/MCP';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isJSONRPCRequest } from '@modelcontextprotocol/sdk/types.js';

/**
 * HTTP server entry point for MCP
 * Provides a stateless HTTP transport for remote access
 */
async function main() {
  const app = express();
  const port = process.env.PORT || 3000;

  // Parse allowed origins from environment variable
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
    : ['http://localhost:3000', 'http://localhost:6274', 'https://claude.ai'];

  // Parse allowed hosts from environment variable
  const allowedHosts = process.env.ALLOWED_HOSTS
    ? process.env.ALLOWED_HOSTS.split(',').map((host) => host.trim())
    : [
        'localhost',
        '127.0.0.1',
        'localhost:3000',
        'localhost:6274',
        '127.0.0.1',
      ];

  // Configure middleware
  app.use(express.json());

  // Configure CORS
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like Postman or curl)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['X-Request-Id'],
    })
  );

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'mcp-http-server',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // Get MCP instance from DI container
  const mcp = container.get<MCP>(TYPES.MCP);
  const server = mcp.getServer();

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV !== 'production';

  // Create stateless HTTP transport
  const transport = new StreamableHTTPServerTransport({
    // No session management for stateless operation
    sessionIdGenerator: () => 'stateless',
    enableDnsRebindingProtection: !isDevelopment, // Disable in development
    ...(isDevelopment
      ? {}
      : {
          allowedHosts: allowedHosts,
          allowedOrigins: allowedOrigins,
        }),
  });

  // Connect server to transport
  await server.connect(transport);

  // Handle MCP requests
  app.post('/mcp', async (req, res) => {
    try {
      // Validate request body
      if (!isJSONRPCRequest(req.body)) {
        res.status(400).json({
          jsonrpc: '2.0',
          error: {
            code: -32600,
            message: 'Invalid Request: Not a valid JSON-RPC request',
          },
          id: null,
        });
        return;
      }

      // Handle the request through the transport
      await transport.handleRequest(req, res, req.body);
    } catch (error: any) {
      console.error('Error handling MCP request:', error);
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal error',
          data: error.message,
        },
        id: req.body?.id || null,
      });
    }
  });

  // Handle GET requests for server-sent events (if needed for notifications)
  app.get('/mcp', async (req, res) => {
    try {
      await transport.handleRequest(req, res);
    } catch (error: any) {
      console.error('Error handling SSE request:', error);
      res.status(500).send('Internal Server Error');
    }
  });

  // Error handling middleware
  app.use(
    (
      err: Error,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      console.error('Express error:', err);
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
          data: err.message,
        },
        id: null,
      });
    }
  );

  // Start the server
  app.listen(port, () => {
    console.log(`MCP HTTP server running on port ${port}`);
    console.log(`Mode: ${isDevelopment ? 'DEVELOPMENT' : 'PRODUCTION'}`);
    console.log(`Health check: http://localhost:${port}/health`);
    console.log(`MCP endpoint: http://localhost:${port}/mcp`);
    console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);
    console.log(
      `DNS rebinding protection: ${isDevelopment ? 'DISABLED' : 'ENABLED'}`
    );
  });
}

// Start the HTTP server
main().catch((error) => {
  console.error('Failed to start HTTP server:', error);
  process.exit(1);
});
