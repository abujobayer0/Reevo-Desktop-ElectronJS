import { app, ipcMain, desktopCapturer, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
let studio;
let floatingWebcam;
function createWindow() {
  win = new BrowserWindow({
    width: 600,
    height: 600,
    minHeight: 600,
    minWidth: 300,
    frame: false,
    transparent: true,
    hasShadow: false,
    alwaysOnTop: true,
    focusable: true,
    icon: path.join(process.env.VITE_PUBLIC, "logo.svg"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  studio = new BrowserWindow({
    width: 400,
    height: 50,
    minHeight: 70,
    maxHeight: 400,
    minWidth: 300,
    maxWidth: 400,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    icon: path.join(process.env.VITE_PUBLIC, "logo.svg"),
    focusable: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  floatingWebcam = new BrowserWindow({
    width: 400,
    height: 200,
    minHeight: 70,
    maxHeight: 400,
    minWidth: 300,
    maxWidth: 400,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    focusable: true,
    icon: path.join(process.env.VITE_PUBLIC, "logo.svg"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setAlwaysOnTop(true, "screen-saver", 1);
  studio.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  studio.setAlwaysOnTop(true, "screen-saver", 1);
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  studio.webContents.on("did-finish-load", () => {
    studio == null ? void 0 : studio.webContents.send(
      "main-process-message",
      (/* @__PURE__ */ new Date()).toLocaleString()
    );
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    studio.loadURL(`${VITE_DEV_SERVER_URL}/studio.html`);
    floatingWebcam.loadURL(`${VITE_DEV_SERVER_URL}/webcam.html`);
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
    studio.loadFile(path.join(RENDERER_DIST, "studio.html"));
    floatingWebcam.loadFile(path.join(RENDERER_DIST, "webcam.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
    studio = null;
    floatingWebcam = null;
  }
});
ipcMain.on("closeApp", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
    studio = null;
    floatingWebcam = null;
  }
});
ipcMain.handle("getSources", async () => {
  const sources = await desktopCapturer.getSources({
    thumbnailSize: { height: 100, width: 150 },
    fetchWindowIcons: true,
    types: ["window", "screen"]
  });
  console.log(sources);
  return sources;
});
ipcMain.on("media-sources", (event, payload) => {
  console.log(event);
  studio == null ? void 0 : studio.webContents.send("profile-recieved", payload);
});
ipcMain.on("resize-studio", (event, payload) => {
  console.log(event);
  if (payload.shrink) {
    studio == null ? void 0 : studio.setSize(400, 100);
  }
  if (!payload.shrink) {
    studio == null ? void 0 : studio.setSize(400, 250);
  }
});
ipcMain.on("hide-plugin", (event, payload) => {
  console.log(event);
  win == null ? void 0 : win.webContents.send("hide-plugin", payload);
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
app.whenReady().then(createWindow);
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
