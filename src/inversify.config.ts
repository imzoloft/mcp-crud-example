import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from './types';
import { IApi } from './interfaces/IApi';
import { MockApi } from './services/mocks/MockApi';
import { MCP } from './services/MCP';

// Create the DI container
const container = new Container();

// Bind interfaces to implementations
container.bind<IApi>(TYPES.IApi).to(MockApi).inSingletonScope();
container.bind<MCP>(TYPES.MCP).to(MCP).inSingletonScope();

export { container };