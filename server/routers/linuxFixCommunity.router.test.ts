import { describe, expect, it } from "vitest";
import { toSafeProposalContext } from "./linuxFixCommunity";

describe("linuxFixCommunity proposal context", () => {
  it("minimizes the active profile to the explicit diagnostic fields", () => {
    const context = toSafeProposalContext({
      detectedDistribution: "BigLinux",
      kernelVersion: "6.12.8",
      driverVersion: "Mesa 24.3",
      protonVersion: "Proton Experimental",
      wineVersion: "wine-9.0",
      detectedGpu: "AMD Radeon RX 7600",
      storageDescription: "/home/pedro/private-library",
      monitorDescription: "Private display label",
      scannerVersion: "1.0.0",
    } as never);

    expect(context).toEqual({
      distribution: "BigLinux",
      kernel: "6.12.8",
      driver: "Mesa 24.3",
      proton: "Proton Experimental",
      wine: "wine-9.0",
      gpu: "AMD Radeon RX 7600",
    });
    expect(context).not.toHaveProperty("storageDescription");
    expect(context).not.toHaveProperty("monitorDescription");
    expect(context).not.toHaveProperty("scannerVersion");
  });
});
