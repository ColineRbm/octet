// to make the file a module and avoid the TypeScript error
export type {};

declare global {
  namespace Express {
    export interface Request {
      // Add user info to request after JWT verification
      user?: {
        id: number;
        role: string;
      };
    }
  }
}
