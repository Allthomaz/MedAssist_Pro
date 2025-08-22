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
  export function createClient(
    url: string,
    key: string,
    options?: any
  ): SupabaseClient;

  export interface SupabaseClient {
    from(table: string): any;
    auth: any;
    storage: any;
    functions: any;
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
