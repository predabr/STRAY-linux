"use strict";

const UPDATE_FEED_URL = "https://linuxtoys-ckuyvpj5.manus.space/updates";

function createDesktopUpdater({ app, autoUpdater, dialog, logger = console }) {
  let status = { state: "idle", version: app.getVersion(), progress: 0, detail: null };
  const setStatus = (next) => { status = { ...status, ...next }; };
  const log = (level, message, details = {}) => {
    const output = `[updater] ${message}${Object.keys(details).length ? ` ${JSON.stringify(details)}` : ""}`;
    (logger[level] || logger.info || (() => {}))(output);
  };
  const reportError = (error) => {
    const detail = error instanceof Error ? error.message : "Falha desconhecida ao verificar atualização.";
    setStatus({ state: "error", detail, progress: 0 });
    log("error", "Falha de atualização", { detail });
  };

  if (!app.isPackaged) {
    setStatus({ state: "development", detail: "Atualizações são verificadas somente no aplicativo empacotado." });
    return { check: async () => status, getStatus: () => status, feedUrl: UPDATE_FEED_URL };
  }

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = false;
  autoUpdater.autoRunAppAfterInstall = true;
  autoUpdater.allowDowngrade = false;
  autoUpdater.disableDifferentialDownload = true;
  autoUpdater.fullChangelog = false;

  autoUpdater.on("checking-for-update", () => setStatus({ state: "checking", detail: null, progress: 0 }));
  autoUpdater.on("update-available", (info) => {
    setStatus({ state: "downloading", version: info.version, detail: "Atualização encontrada; validando download.", progress: 0 });
    log("info", "Atualização disponível", { version: info.version });
  });
  autoUpdater.on("update-not-available", (info) => {
    setStatus({ state: "up-to-date", version: info.version || app.getVersion(), detail: "O aplicativo já está atualizado.", progress: 100 });
  });
  autoUpdater.on("download-progress", (progress) => setStatus({ state: "downloading", progress: Math.max(0, Math.min(100, Math.round(progress.percent || 0))), detail: "Baixando atualização publicada." }));
  autoUpdater.on("error", reportError);
  autoUpdater.on("update-downloaded", (info) => {
    setStatus({ state: "ready", version: info.version, progress: 100, detail: "Atualização validada e pronta para instalar." });
    log("info", "Atualização baixada", { version: info.version });
    void dialog.showMessageBox({
      type: "info",
      buttons: ["Reiniciar e atualizar", "Depois"],
      defaultId: 0,
      cancelId: 1,
      title: "Atualização pronta",
      message: `Stray Linux ${info.version} foi baixado e validado.`,
      detail: "O aplicativo só será fechado se você confirmar. Em pacotes Linux, o sistema pode solicitar sua senha para concluir a atualização.",
      noLink: true,
    }).then(({ response }) => {
      if (response !== 0) return;
      setStatus({ state: "installing", detail: "Reiniciando para concluir a atualização." });
      autoUpdater.quitAndInstall(false, true);
    }).catch(reportError);
  });

  return {
    async check() {
      try {
        setStatus({ state: "checking", detail: null, progress: 0 });
        await autoUpdater.checkForUpdates();
        return status;
      } catch (error) {
        reportError(error);
        return status;
      }
    },
    getStatus: () => status,
    feedUrl: UPDATE_FEED_URL,
  };
}

module.exports = { UPDATE_FEED_URL, createDesktopUpdater };
