import 'reflect-metadata';
import { Container, injectable } from 'inversify';
import { TYPES } from '../src/types';
import { IApi } from '../src/interfaces/IApi';
import { MockApi } from '../src/services/mocks/MockApi';
import { ApiError } from '../src/types';

/**
 * Alternative API implementation that logs all operations
 */
@injectable()
class LoggingApi implements IApi {
  private logs: string[] = [];

  async create(resource: string, data: any): Promise<{ id: string }> {
    const id = `logged-${Date.now()}`;
    this.logs.push(`CREATE ${resource}: ${JSON.stringify(data)} -> ${id}`);
    console.log(`[LOG] Creating ${resource} with data:`, data);
    return { id };
  }

  async get(resource: string, id: string): Promise<any> {
    this.logs.push(`GET ${resource}/${id}`);
    console.log(`[LOG] Getting ${resource} with id:`, id);
    return { id, resource, mock: true, retrieved: new Date().toISOString() };
  }

  async list(resource: string, query?: any): Promise<any[]> {
    this.logs.push(`LIST ${resource}: ${JSON.stringify(query || {})}`);
    console.log(`[LOG] Listing ${resource} with query:`, query);
    return [
      { id: '1', resource, mock: true },
      { id: '2', resource, mock: true }
    ];
  }

  async update(resource: string, id: string, data: any): Promise<void> {
    this.logs.push(`UPDATE ${resource}/${id}: ${JSON.stringify(data)}`);
    console.log(`[LOG] Updating ${resource} ${id} with data:`, data);
  }

  async delete(resource: string, id: string): Promise<void> {
    this.logs.push(`DELETE ${resource}/${id}`);
    console.log(`[LOG] Deleting ${resource} with id:`, id);
  }

  getLogs(): string[] {
    return [...this.logs];
  }
}

/**
 * Demonstrates swapping API implementations using DI container
 */
async function demonstrateInterfaceSwap() {
  console.log('=== Interface Swapping Demo ===\n');

  // Create a new container for this demo
  const container = new Container();

  // First, use the MockApi
  console.log('1. Using MockApi implementation...\n');
  container.bind<IApi>(TYPES.IApi).to(MockApi).inSingletonScope();
  
  let api = container.get<IApi>(TYPES.IApi);
  
  // Create some data
  const result1 = await api.create('users', { name: 'Test User' });
  console.log(`Created with MockApi: ${result1.id}`);
  
  const user = await api.get('users', result1.id);
  console.log('Retrieved:', user, '\n');

  // Now swap to LoggingApi
  console.log('2. Swapping to LoggingApi implementation...\n');
  container.unbind(TYPES.IApi);
  container.bind<IApi>(TYPES.IApi).to(LoggingApi).inSingletonScope();
  
  api = container.get<IApi>(TYPES.IApi);
  
  // Use the new implementation
  const result2 = await api.create('products', { name: 'Test Product' });
  console.log(`Created with LoggingApi: ${result2.id}`);
  
  await api.update('products', result2.id, { price: 99.99 });
  await api.delete('products', result2.id);
  
  const products = await api.list('products');
  console.log('Listed products:', products, '\n');

  // Show logs if using LoggingApi
  if (api instanceof LoggingApi) {
    console.log('3. Operation logs from LoggingApi:');
    api.getLogs().forEach(log => console.log(`   - ${log}`));
  }

  console.log('\n=== Demo completed ===');
  console.log('This demonstrates how different implementations can be swapped');
  console.log('without changing the code that uses the IApi interface.');
}

// Run the demo
demonstrateInterfaceSwap().catch(console.error);