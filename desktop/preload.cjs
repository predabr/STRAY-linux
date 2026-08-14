"use strict";

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("strayDesktop", Object.freeze({
  scanner: Object.freeze({ run: () => ipcRenderer.invoke("stray:scanner:run") }),
}));
