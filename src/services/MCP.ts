import { injectable, inject } from 'inversify';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { TYPES } from '../types';
import { IApi } from '../interfaces/IApi';

/**
 * Main MCP service that registers tools and delegates operations to IApi
 */
@injectable()
export class MCP {
  private server: McpServer;

  constructor(@inject(TYPES.IApi) private api: IApi) {
    this.server = new McpServer({
      name: 'mcp-mvp',
      version: '1.0.0',
      description: 'Modular Control Panel with abstracted data operations',
    });
    this.registerTools();
    this.registerResources();
  }

  /**
   * Registers all CRUD tools with the MCP SDK
   */
  private registerTools() {
    // Create tool
    this.server.registerTool(
      'create',
      {
        title: 'Create Resource',
        description: 'Creates a new resource in the specified collection',
        inputSchema: {
          resource: z
            .string()
            .describe("Resource type (e.g., 'users', 'products')"),
          data: z.object({}).passthrough().describe('Resource data to create'),
        },
      },
      async ({ resource, data }: { resource: string; data: any }) => {
        try {
          const result = await this.api.create(resource, data);
          return {
            content: [
              {
                type: 'text',
                text: `Created ${resource} with id: ${result.id}`,
              },
            ],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: 'text',
                text: `Error creating ${resource}: ${error.message}`,
              },
            ],
          };
        }
      }
    );

    // Get tool
    this.server.registerTool(
      'get',
      {
        title: 'Get Resource',
        description: 'Retrieves a specific resource by ID',
        inputSchema: {
          resource: z.string().describe('Resource type'),
          id: z.string().describe('Resource ID'),
        },
      },
      async ({ resource, id }: { resource: string; id: string }) => {
        try {
          const data = await this.api.get(resource, id);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(data, null, 2),
              },
            ],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: 'text',
                text: `Error: ${error.message}`,
              },
            ],
          };
        }
      }
    );

    // List tool
    this.server.registerTool(
      'list',
      {
        title: 'List Resources',
        description: 'Lists all resources of a type with optional filtering',
        inputSchema: {
          resource: z.string().describe('Resource type'),
          query: z
            .object({})
            .passthrough()
            .optional()
            .describe('Optional filter criteria'),
        },
      },
      async ({ resource, query }: { resource: string; query?: any }) => {
        try {
          const items = await this.api.list(resource, query);
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(items, null, 2),
              },
            ],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: 'text',
                text: `Error listing ${resource}: ${error.message}`,
              },
            ],
          };
        }
      }
    );

    // Update tool
    this.server.registerTool(
      'update',
      {
        title: 'Update Resource',
        description: 'Updates an existing resource',
        inputSchema: {
          resource: z.string().describe('Resource type'),
          id: z.string().describe('Resource ID'),
          data: z.object({}).passthrough().describe('Data to update'),
        },
      },
      async ({
        resource,
        id,
        data,
      }: {
        resource: string;
        id: string;
        data: any;
      }) => {
        try {
          await this.api.update(resource, id, data);
          return {
            content: [
              {
                type: 'text',
                text: `Successfully updated ${resource} with id: ${id}`,
              },
            ],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: 'text',
                text: `Error: ${error.message}`,
              },
            ],
          };
        }
      }
    );

    // Delete tool
    this.server.registerTool(
      'delete',
      {
        title: 'Delete Resource',
        description: 'Deletes a resource by ID',
        inputSchema: {
          resource: z.string().describe('Resource type'),
          id: z.string().describe('Resource ID'),
        },
      },
      async ({ resource, id }: { resource: string; id: string }) => {
        try {
          await this.api.delete(resource, id);
          return {
            content: [
              {
                type: 'text',
                text: `Successfully deleted ${resource} with id: ${id}`,
              },
            ],
          };
        } catch (error: any) {
          return {
            content: [
              {
                type: 'text',
                text: `Error: ${error.message}`,
              },
            ],
          };
        }
      }
    );
  }

  /**
   * Registers resources for listing and getting data
   */
  private registerResources() {
    // Register resources for each collection type
    const resourceTypes = ['users', 'products', 'orders'];

    resourceTypes.forEach((resourceType) => {
      // Register list resource for each type
      this.server.registerResource(
        `${resourceType}-list`,
        `${resourceType}://list`,
        {
          name: `List all ${resourceType}`,
          description: `Returns all ${resourceType} in the collection`,
          mimeType: 'application/json',
        },
        async () => {
          const items = await this.api.list(resourceType);
          return {
            contents: [
              {
                uri: `${resourceType}://list`,
                mimeType: 'application/json',
                text: JSON.stringify(items, null, 2),
              },
            ],
          };
        }
      );

      // Register individual resource access by ID pattern
      this.server.registerResource(
        `${resourceType}-by-id`,
        `${resourceType}://{id}`,
        {
          name: `Get ${resourceType} by ID`,
          description: `Returns a specific ${resourceType} by its ID`,
          mimeType: 'application/json',
        },
        async (uri: URL) => {
          const match = uri
            .toString()
            .match(new RegExp(`^${resourceType}://(.+)$`));
          if (!match) {
            throw new Error('Invalid resource URI');
          }

          const id = match[1];
          const data = await this.api.get(resourceType, id);

          return {
            contents: [
              {
                uri: uri.href,
                mimeType: 'application/json',
                text: JSON.stringify(data, null, 2),
              },
            ],
          };
        }
      );
    });
  }

  /**
   * Returns the MCP server instance
   */
  getServer() {
    return this.server;
  }
}
