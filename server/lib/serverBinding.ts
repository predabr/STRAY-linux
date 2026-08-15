export function serverBindingHost(desktopMode?: string): string | undefined {
  return desktopMode === "1" ? "127.0.0.1" : undefined;
}
