import 'reflect-metadata';
import { container } from './inversify.config';
import { TYPES } from './types';
import { MCP } from './services/MCP';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

/**
 * Application entry point
 * Sets up and starts the MCP server with stdio transport
 */
async function main() {
  try {
    // Get MCP instance from DI container
    const mcp = container.get<MCP>(TYPES.MCP);
    const server = mcp.getServer();

    // Create stdio transport
    const transport = new StdioServerTransport();

    // Connect server to transport
    await server.connect(transport);

    console.error('MCP server started successfully');
  } catch (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

// Start the server
main().catch(console.error);
