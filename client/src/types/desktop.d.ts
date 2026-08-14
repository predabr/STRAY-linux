export {};

declare global {
  interface Window {
    strayDesktop?: {
      scanner: { run: () => Promise<unknown> };
      library: {
        scan: () => Promise<{ games: Array<{ appId: number; name: string; installDir: string | null; libraryPath: string }> }>;
        launch: (appId: number) => Promise<{ launched: boolean }>;
      };
    };
  }
}
