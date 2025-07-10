import { ResourceInfo, ResourceContent, ResourceTemplate, ListResourcesResult, ReadResourceResult } from '../types/resource.types.js';

export interface IResourceManager {
  registerResource(uri: string, info: Omit<ResourceInfo, 'uri'>): void;
  
  registerResourceTemplate(
    template: string,
    info: Omit<ResourceTemplate, 'uriTemplate'>,
    handler: (uri: string, params: Record<string, string>) => Promise<ReadResourceResult>
  ): void;
  
  listResources(): Promise<ListResourcesResult>;
  
  readResource(uri: string): Promise<ReadResourceResult>;
  
  hasResource(uri: string): boolean;
}