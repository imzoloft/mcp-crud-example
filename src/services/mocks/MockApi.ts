import { injectable } from 'inversify';
import { IApi } from '../../interfaces/IApi';
import { ApiError, type ResourceData } from '../../types';

/**
 * Mock implementation of IApi with in-memory storage
 * Simulates database collections for testing and examples
 */
@injectable()
export class MockApi implements IApi {
  // In-memory storage simulating database collections
  private storage = new Map<string, Map<string, any>>();

  async create(resource: string, data: ResourceData): Promise<{ id: string }> {
    const collection = this.getCollection(resource);
    const id = `${resource}-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    collection.set(id, { ...data, id });
    return { id };
  }

  async get(resource: string, id: string): Promise<ResourceData> {
    const collection = this.getCollection(resource);
    const item = collection.get(id);
    if (!item) {
      throw new ApiError(
        'NOT_FOUND',
        `${resource} with id ${id} not found`,
        404
      );
    }
    return item;
  }

  async list(resource: string, query?: any): Promise<ResourceData[]> {
    const collection = this.getCollection(resource);
    let items = Array.from(collection.values());

    // Simple query filtering
    if (query) {
      items = items.filter((item) =>
        Object.entries(query).every(([key, value]) => item[key] === value)
      );
    }

    return items;
  }

  async update(
    resource: string,
    id: string,
    data: ResourceData
  ): Promise<void> {
    const collection = this.getCollection(resource);
    const existing = collection.get(id);
    if (!existing) {
      throw new ApiError(
        'NOT_FOUND',
        `${resource} with id ${id} not found`,
        404
      );
    }
    collection.set(id, { ...existing, ...data, id });
  }

  async delete(resource: string, id: string): Promise<void> {
    const collection = this.getCollection(resource);
    if (!collection.has(id)) {
      throw new ApiError(
        'NOT_FOUND',
        `${resource} with id ${id} not found`,
        404
      );
    }
    collection.delete(id);
  }

  /**
   * Gets or creates a collection for the given resource type
   */
  private getCollection(resource: string): Map<string, any> {
    if (!this.storage.has(resource)) {
      this.storage.set(resource, new Map());
    }
    return this.storage.get(resource)!;
  }
}
