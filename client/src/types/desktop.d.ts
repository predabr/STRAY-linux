export {};

declare global {
  interface Window {
    strayDesktop?: { scanner: { run: () => Promise<unknown> } };
  }
}
