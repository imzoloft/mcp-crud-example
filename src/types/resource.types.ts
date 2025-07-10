export interface ResourceInfo {
  name: string;
  uri: string;
  description?: string;
  mimeType?: string;
}

export interface ResourceContent {
  uri: string;
  mimeType?: string;
  text?: string;
  blob?: string;
}

export interface ResourceTemplate {
  uriTemplate: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface ListResourcesResult {
  resources: ResourceInfo[];
}

export interface ReadResourceResult {
  contents: ResourceContent[];
}

export interface ResourceHandler {
  (uri: string, params?: Record<string, string>): Promise<ReadResourceResult>;
}

export interface ResourceRegistry {
  templates: Map<string, ResourceTemplate>;
  handlers: Map<string, ResourceHandler>;
  staticResources: Map<string, ResourceInfo>;
}