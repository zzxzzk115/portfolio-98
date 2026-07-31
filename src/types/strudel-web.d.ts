declare module "@strudel/web" {
  export function initStrudel(
    options?: { prebake?: () => Promise<unknown> } & Record<string, unknown>
  ): Promise<unknown>;
  export function evaluate(code: string, autoplay?: boolean): Promise<unknown>;
  export function hush(): void;
  export function samples(
    source: string | Record<string, unknown>,
    baseUrl?: string
  ): Promise<unknown>;
  export function getAnalyzerData(
    type: "time" | "frequency",
    id?: string | number
  ): Float32Array;
}
