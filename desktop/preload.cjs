"use strict";

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("strayDesktop", Object.freeze({
  scanner: Object.freeze({ run: () => ipcRenderer.invoke("stray:scanner:run") }),
  library: Object.freeze({ scan: () => ipcRenderer.invoke("stray:library:scan"), launch: (appId) => ipcRenderer.invoke("stray:library:launch", appId), scanMods: () => ipcRenderer.invoke("stray:library:scan-mods") }),
}));
