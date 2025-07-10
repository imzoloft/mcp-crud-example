import type { ResourceData } from '../types';

/**
 * Unified interface for all data operations
 * All external data access goes through this interface
 */
export interface IApi {
  /**
   * Creates a new resource in the specified collection
   * @param resource - Resource type (e.g., 'users', 'products')
   * @param data - Resource data to create
   * @returns Object containing the generated ID
   */
  create(resource: string, data: ResourceData): Promise<{ id: string }>;

  /**
   * Retrieves a specific resource by ID
   * @param resource - Resource type
   * @param id - Resource ID
   * @returns The resource data
   * @throws ApiError if resource not found
   */
  get(resource: string, id: string): Promise<ResourceData>;

  /**
   * Lists all resources of a type with optional filtering
   * @param resource - Resource type
   * @param query - Optional filter criteria
   * @returns Array of resources
   */
  list(resource: string, query?: any): Promise<ResourceData[]>;

  /**
   * Updates an existing resource
   * @param resource - Resource type
   * @param id - Resource ID
   * @param data - Data to update (partial update supported)
   * @throws ApiError if resource not found
   */
  update(resource: string, id: string, data: ResourceData): Promise<void>;

  /**
   * Deletes a resource by ID
   * @param resource - Resource type
   * @param id - Resource ID
   * @throws ApiError if resource not found
   */
  delete(resource: string, id: string): Promise<void>;
}
