// Declarações de tipos para Edge Functions do Supabase

// Módulo do servidor HTTP do Deno
declare module 'https://deno.land/std@0.177.0/http/server.ts' {
  export interface ConnInfo {
    readonly localAddr: Deno.Addr;
    readonly remoteAddr: Deno.Addr;
  }

  export type Handler = (
    request: Request,
    connInfo: ConnInfo
  ) => Response | Promise<Response>;

  export interface ServerInit extends Partial<Deno.ListenOptions> {
    handler: Handler;
    onError?: (error: unknown) => Response | Promise<Response>;
  }

  export class Server {
    constructor(serverInit: ServerInit);
    serve(listener: Deno.Listener): Promise<void>;
    listenAndServe(): Promise<void>;
  }

  export function serve(
    handler: Handler,
    options?: Partial<Deno.ListenOptions>
  ): Promise<void>;
}

// Módulo do Supabase
declare module '@supabase/supabase-js' {
  export interface SupabaseClientOptions {
    auth?: {
      autoRefreshToken?: boolean;
      persistSession?: boolean;
      detectSessionInUrl?: boolean;
    };
    realtime?: {
      params?: Record<string, string>;
    };
    global?: {
      headers?: Record<string, string>;
    };
  }

  export interface QueryBuilder {
    select(columns?: string): QueryBuilder;
    insert(
      values: Record<string, unknown> | Record<string, unknown>[]
    ): QueryBuilder;
    update(values: Record<string, unknown>): QueryBuilder;
    delete(): QueryBuilder;
    eq(column: string, value: unknown): QueryBuilder;
    single(): QueryBuilder;
  }

  export interface AuthClient {
    signUp(credentials: {
      email: string;
      password: string;
    }): Promise<{ data: unknown; error: unknown }>;
    signIn(credentials: {
      email: string;
      password: string;
    }): Promise<{ data: unknown; error: unknown }>;
    signOut(): Promise<{ error: unknown }>;
    getUser(): Promise<{ data: unknown; error: unknown }>;
  }

  export interface StorageClient {
    from(bucketId: string): StorageBucket;
  }

  export interface StorageBucket {
    upload(
      path: string,
      file: File | Blob,
      options?: Record<string, unknown>
    ): Promise<{ data: unknown; error: unknown }>;
    download(path: string): Promise<{ data: Blob | null; error: unknown }>;
    remove(paths: string[]): Promise<{ data: unknown; error: unknown }>;
  }

  export interface FunctionsClient {
    invoke(
      functionName: string,
      options?: { body?: unknown; headers?: Record<string, string> }
    ): Promise<{ data: unknown; error: unknown }>;
  }

  export function createClient(
    url: string,
    key: string,
    options?: SupabaseClientOptions
  ): SupabaseClient;

  export interface SupabaseClient {
    from(table: string): QueryBuilder;
    auth: AuthClient;
    storage: StorageClient;
    functions: FunctionsClient;
  }
}

// Tipos globais do Deno
declare global {
  namespace Deno {
    interface Addr {
      transport: 'tcp' | 'udp';
      hostname: string;
      port: number;
    }

    interface ListenOptions {
      port?: number;
      hostname?: string;
      backlog?: number;
    }

    interface Listener {
      addr: Addr;
      close(): void;
    }

    namespace errors {
      class Http extends Error {
        constructor(message: string);
      }
    }
  }
}

export {};
