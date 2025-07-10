/**
 * Dependency Injection type symbols for InversifyJS
 */
export const TYPES = {
  IApi: Symbol.for("IApi"),
  MCP: Symbol.for("MCP")
};

/**
 * Generic resource data structure
 */
export interface ResourceData {
  id?: string;
  [key: string]: any;
}

/**
 * API Error class for consistent error handling
 */
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'ApiError';
  }
}