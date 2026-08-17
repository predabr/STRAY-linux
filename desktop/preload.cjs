"use strict";

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("strayDesktop", Object.freeze({
  scanner: Object.freeze({ run: () => ipcRenderer.invoke("stray:scanner:run") }),
  maintenance: Object.freeze({ preview: () => ipcRenderer.invoke("stray:maintenance:preview") }),
  performance: Object.freeze({ pickLog: () => ipcRenderer.invoke("stray:performance:pick-log") }),
  library: Object.freeze({ scan: () => ipcRenderer.invoke("stray:library:scan"), launch: (appId) => ipcRenderer.invoke("stray:library:launch", appId), reveal: (gameId) => ipcRenderer.invoke("stray:library:reveal", gameId), scanMods: () => ipcRenderer.invoke("stray:library:scan-mods"), pickExternal: () => ipcRenderer.invoke("stray:library:pick-external") }),
  updates: Object.freeze({ status: () => ipcRenderer.invoke("stray:updates:status"), check: () => ipcRenderer.invoke("stray:updates:check") }),
}));
