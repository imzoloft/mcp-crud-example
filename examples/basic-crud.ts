import 'reflect-metadata';
import { container } from '../src/inversify.config';
import { TYPES } from '../src/types';
import { IApi } from '../src/interfaces/IApi';

/**
 * Demonstrates basic CRUD operations using the injected IApi interface
 */
async function demonstrateCRUD() {
  console.log('=== MCP MVP CRUD Demo ===\n');

  // Get API instance from DI container
  const api = container.get<IApi>(TYPES.IApi);

  try {
    // CREATE - Create a user
    console.log('1. Creating a user...');
    const createResult = await api.create('users', {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30
    });
    console.log(`Created user with ID: ${createResult.id}\n`);

    // CREATE - Create another user
    console.log('2. Creating another user...');
    const createResult2 = await api.create('users', {
      name: 'Jane Smith',
      email: 'jane@example.com',
      age: 25
    });
    console.log(`Created user with ID: ${createResult2.id}\n`);

    // CREATE - Create a product
    console.log('3. Creating a product...');
    const productResult = await api.create('products', {
      name: 'Laptop',
      price: 999.99,
      category: 'Electronics'
    });
    console.log(`Created product with ID: ${productResult.id}\n`);

    // LIST - List all users
    console.log('4. Listing all users...');
    const users = await api.list('users');
    console.log('Users:', JSON.stringify(users, null, 2), '\n');

    // GET - Get specific user
    console.log('5. Getting specific user...');
    const user = await api.get('users', createResult.id);
    console.log('User:', JSON.stringify(user, null, 2), '\n');

    // UPDATE - Update user
    console.log('6. Updating user...');
    await api.update('users', createResult.id, {
      age: 31,
      city: 'New York'
    });
    const updatedUser = await api.get('users', createResult.id);
    console.log('Updated user:', JSON.stringify(updatedUser, null, 2), '\n');

    // LIST with query - Filter users
    console.log('7. Listing users with age 25...');
    const filteredUsers = await api.list('users', { age: 25 });
    console.log('Filtered users:', JSON.stringify(filteredUsers, null, 2), '\n');

    // DELETE - Delete a user
    console.log('8. Deleting first user...');
    await api.delete('users', createResult.id);
    console.log('User deleted successfully\n');

    // LIST - Verify deletion
    console.log('9. Listing all users after deletion...');
    const remainingUsers = await api.list('users');
    console.log('Remaining users:', JSON.stringify(remainingUsers, null, 2), '\n');

    // Error handling - Try to get deleted user
    console.log('10. Trying to get deleted user (should error)...');
    try {
      await api.get('users', createResult.id);
    } catch (error: any) {
      console.log(`Error caught: ${error.message}\n`);
    }

    console.log('=== Demo completed successfully ===');

  } catch (error) {
    console.error('Demo error:', error);
  }
}

// Run the demo
demonstrateCRUD().catch(console.error);