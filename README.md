# MCP MVP - Model Context Protocol

A TypeScript implementation of a Model Context Protocol (MCP) demonstrating interface-driven architecture with dependency injection and LLM-compatible service discovery.

## Overview

This project implements a complete MCP system that:
- Performs CRUD operations through an injected `IApi` interface
- Uses InversifyJS for dependency injection
- Registers tools with MCP SDK for service discovery
- Demonstrates clean architecture with interface swapping capability

## Key Features

- **Interface-Driven Design**: All external dependencies injected via interfaces
- **Dependency Injection**: InversifyJS manages all service dependencies
- **Service Discovery**: MCP SDK tool registration with rich metadata
- **Mock Implementation**: In-memory storage for testing without external systems
- **LLM Compatibility**: All services include descriptive metadata

## Project Structure

```
src/
  interfaces/     # Contract definitions
  services/       # Service implementations
  types/          # DI symbols and shared types
  inversify.config.ts  # DI container setup
  index.ts        # Entry point
examples/         # Usage demonstrations
tests/            # Basic test suite
```

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

## Usage

### Start MCP Server

```bash
npm start
```

The server runs with stdio transport, accepting commands via stdin and responding via stdout.

### Run Examples

**Basic CRUD Operations:**
```bash
npm run example:crud
```

**Interface Swapping Demo:**
```bash
npm run example:swap
```

## Architecture

### Dependency Injection

All services use constructor injection via InversifyJS:

```typescript
@injectable()
export class MCP {
  constructor(@inject(TYPES.IApi) private api: IApi) {
    // Service setup
  }
}
```

### Available Tools

The MCP server registers the following tools:

- **create**: Create a new resource
- **get**: Retrieve a resource by ID
- **list**: List resources with optional filtering
- **update**: Update an existing resource
- **delete**: Delete a resource

Each tool includes:
- Descriptive title and description
- Input schema validation using Zod
- Proper error handling
- MCP-formatted responses

### Interface Swapping

The DI container allows easy swapping of implementations:

```typescript
// Default binding
container.bind<IApi>(TYPES.IApi).to(MockApi);

// Swap to different implementation
container.rebind<IApi>(TYPES.IApi).to(AlternativeApi);
```

## Development

### TypeScript Configuration

The project requires these TypeScript settings for InversifyJS:
- `experimentalDecorators: true`
- `emitDecoratorMetadata: true`

### Adding New Tools

1. Define the tool in `MCP.ts` using `registerTool()`
2. Implement the handler delegating to `IApi`
3. Include proper error handling
4. Return MCP content format

### Creating Alternative Implementations

1. Implement the `IApi` interface
2. Add `@injectable()` decorator
3. Bind in the DI container
4. Swap as needed

## Future Migration

This MVP is designed for easy migration to other platforms:
- All business logic is interface-driven
- No hardcoded dependencies
- Ready for .NET SDK compatibility
- Modular architecture supports microservices

## License

ISC
