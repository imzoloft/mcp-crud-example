import 'reflect-metadata';
import { Container } from 'inversify';
import { TYPES } from '../../src/types';
import { IApi } from '../../src/interfaces/IApi';
import { MCP } from '../../src/services/MCP';
import { MockApi } from '../../src/services/mocks/MockApi';

/**
 * Basic tests for MCP service
 * Note: This is a simple test runner without a framework
 */
async function runTests() {
  console.log('=== MCP Service Tests ===\n');
  
  let passed = 0;
  let failed = 0;

  // Test 1: MCP service can be instantiated
  console.log('Test 1: MCP service instantiation');
  try {
    const container = new Container();
    container.bind<IApi>(TYPES.IApi).to(MockApi);
    container.bind<MCP>(TYPES.MCP).to(MCP);
    
    const mcp = container.get<MCP>(TYPES.MCP);
    const server = mcp.getServer();
    
    if (server && typeof server.registerTool === 'function') {
      console.log('✅ PASSED: MCP service created successfully\n');
      passed++;
    } else {
      throw new Error('Server instance invalid');
    }
  } catch (error) {
    console.log('❌ FAILED:', error);
    failed++;
  }

  // Test 2: API operations through MockApi
  console.log('Test 2: MockApi CRUD operations');
  try {
    const api = new MockApi();
    
    // Create
    const { id } = await api.create('test', { name: 'Test Item' });
    
    // Get
    const item = await api.get('test', id);
    if (item.name !== 'Test Item') throw new Error('Get failed');
    
    // Update
    await api.update('test', id, { name: 'Updated Item' });
    const updated = await api.get('test', id);
    if (updated.name !== 'Updated Item') throw new Error('Update failed');
    
    // List
    const items = await api.list('test');
    if (items.length !== 1) throw new Error('List failed');
    
    // Delete
    await api.delete('test', id);
    try {
      await api.get('test', id);
      throw new Error('Delete failed - item still exists');
    } catch (e: any) {
      if (!e.message.includes('not found')) throw e;
    }
    
    console.log('✅ PASSED: All CRUD operations work correctly\n');
    passed++;
  } catch (error) {
    console.log('❌ FAILED:', error);
    failed++;
  }

  // Test 3: Error handling
  console.log('Test 3: Error handling');
  try {
    const api = new MockApi();
    
    // Test NOT_FOUND errors
    try {
      await api.get('test', 'non-existent');
    } catch (error: any) {
      if (error.code !== 'NOT_FOUND' || error.statusCode !== 404) {
        throw new Error('Incorrect error format');
      }
    }
    
    console.log('✅ PASSED: Error handling works correctly\n');
    passed++;
  } catch (error) {
    console.log('❌ FAILED:', error);
    failed++;
  }

  // Test 4: Query filtering
  console.log('Test 4: Query filtering');
  try {
    const api = new MockApi();
    
    // Create test data
    await api.create('users', { name: 'Alice', age: 25 });
    await api.create('users', { name: 'Bob', age: 30 });
    await api.create('users', { name: 'Charlie', age: 25 });
    
    // Test filtering
    const age25Users = await api.list('users', { age: 25 });
    if (age25Users.length !== 2) {
      throw new Error(`Expected 2 users with age 25, got ${age25Users.length}`);
    }
    
    const bobUsers = await api.list('users', { name: 'Bob' });
    if (bobUsers.length !== 1 || bobUsers[0].name !== 'Bob') {
      throw new Error('Query filtering failed');
    }
    
    console.log('✅ PASSED: Query filtering works correctly\n');
    passed++;
  } catch (error) {
    console.log('❌ FAILED:', error);
    failed++;
  }

  // Summary
  console.log('=== Test Summary ===');
  console.log(`Total tests: ${passed + failed}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log(`Success rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(console.error);