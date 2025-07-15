## <h3>MCP CRUD Example</h3>

<h6>TypeScript implementation of a Modular Control Panel (MCP) with interface-driven architecture and dependency injection</h6>

---

<h4>Overview</h4>

This project implements a complete MCP system that:
- Performs CRUD operations through an injected `IApi` interface
- Uses InversifyJS for dependency injection
- Registers tools with MCP SDK for service discovery
- Demonstrates clean architecture with interface swapping capability

<h4>Key Features</h4>

- **Interface-Driven Design**: All external dependencies injected via interfaces
- **Dependency Injection**: InversifyJS manages all service dependencies
- **Service Discovery**: MCP SDK tool registration with rich metadata
- **Mock Implementation**: In-memory storage for testing without external systems
- **LLM Compatibility**: All services include descriptive metadata

<h4>Installation & Usage</h4>

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Start MCP server
npm start

# Run examples
npm run example:crud
npm run example:swap
```

<h4>Architecture Highlights</h4>

- **Dependency Injection**: All services use constructor injection via InversifyJS
- **Available Tools**: create, get, list, update, delete - all with proper validation
- **Interface Swapping**: Easy implementation switching through DI container
- **Clean Code**: Modular structure with separated concerns

<h4>Future Enhancements</h4>

- Add real database implementations (PostgreSQL, MongoDB)
- Implement authentication and authorization
- Add WebSocket transport support
- Create comprehensive test suite
- Build UI dashboard for visual tool management

<h4>Support me</h4>

- Thanks for looking at this repository, if you like to press the ⭐ button!
- Made by [imzoloft](https://github.com/imzoloft).

<p align="center">
    <b>Informations</b><br>
    <img alt="GitHub Repo stars" src="https://img.shields.io/github/stars/imzoloft/mcp-crud-example?color=fff">
    <img alt="GitHub top language" src="https://img.shields.io/github/languages/top/imzoloft/mcp-crud-example?color=fff">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/imzoloft/mcp-crud-example?color=fff">
    <img alt="GitHub" src="https://img.shields.io/github/license/imzoloft/mcp-crud-example?color=fff">
    <img alt="GitHub watchers" src="https://img.shields.io/github/watchers/imzoloft/mcp-crud-example?color=fff">
</p>
