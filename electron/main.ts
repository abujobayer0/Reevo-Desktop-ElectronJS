import {
  app,
  BrowserWindow,
  desktopCapturer,
  ipcMain,
  screen,
  shell,
} from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;
let studio: BrowserWindow | null;
let floatingWebcam: BrowserWindow | null;
let authWindow: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    width: 400,
    height: 360,
    minHeight: 360,
    minWidth: 300,
    frame: false,
    transparent: true,
    hasShadow: false,
    x: screen.getPrimaryDisplay().workAreaSize.width - 400,
    y: 0,
    alwaysOnTop: true,
    focusable: true,
    icon: path.join(process.env.VITE_PUBLIC, "logo.svg"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, "preload.mjs"),
    },
  });
  studio = new BrowserWindow({
    width: 300,
    height: 50,
    minHeight: 50,
    maxHeight: 50,
    minWidth: 300,
    maxWidth: 300,
    x: screen.getPrimaryDisplay().workAreaSize.width,
    y: screen.getPrimaryDisplay().workAreaSize.height,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    icon: path.join(process.env.VITE_PUBLIC, "logo.svg"),
    focusable: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, "preload.mjs"),
    },
  });
  floatingWebcam = new BrowserWindow({
    width: 200,
    height: 200,
    minHeight: 200,
    maxHeight: 200,
    minWidth: 200,
    maxWidth: 200,
    frame: false,
    x: screen.getPrimaryDisplay().workAreaSize.width - 250,
    y: screen.getPrimaryDisplay().workAreaSize.height - 230,
    transparent: true,
    alwaysOnTop: true,
    focusable: true,
    icon: path.join(process.env.VITE_PUBLIC, "logo.svg"),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  win.setAlwaysOnTop(true, "screen-saver", 1);

  studio.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  studio.setAlwaysOnTop(true, "screen-saver", 1);

  floatingWebcam.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  floatingWebcam.setAlwaysOnTop(true, "screen-saver", 1);

  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  studio.webContents.on("did-finish-load", () => {
    studio?.webContents.send(
      "main-process-message",
      new Date().toLocaleString()
    );
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    studio.loadURL(`${VITE_DEV_SERVER_URL}/studio.html`);
    floatingWebcam.loadURL(`${VITE_DEV_SERVER_URL}/webcam.html`);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
    studio.loadFile(path.join(RENDERER_DIST, "studio.html"));
    floatingWebcam.loadFile(path.join(RENDERER_DIST, "webcam.html"));
  }

  // Add window close handlers
  win.on("closed", () => {
    win = null;
  });

  studio.on("closed", () => {
    studio = null;
  });

  floatingWebcam.on("closed", () => {
    floatingWebcam = null;
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
    studio = null;
    floatingWebcam = null;
  }
});

ipcMain.on("closeApp", () => {
  // Close all windows
  if (win) win.close();
  if (studio) studio.close();
  if (floatingWebcam) floatingWebcam.close();

  // Quit the app
  app.quit();
});

ipcMain.handle("getSources", async () => {
  const { width, height } = screen.getPrimaryDisplay().size;

  const sources = await desktopCapturer.getSources({
    thumbnailSize: { width: width, height: height },
    fetchWindowIcons: true,
    types: ["window", "screen"],
  });

  return sources;
});

ipcMain.on("media-sources", (event, payload) => {
  console.log(event);
  studio?.webContents.send("profile-recieved", payload);
});

ipcMain.on("resize-studio", (event, payload) => {
  console.log(event);

  if (payload.shrink) {
    studio?.setSize(400, 100);
  }
  if (!payload.shrink) {
    studio?.setSize(400, 250);
  }
});
ipcMain.on("minimizeApp", () => {
  if (win) win.minimize();
});
ipcMain.on("restoreApp", () => {
  if (win) {
    if (win.isMinimized()) {
      win.restore(); // Restore the window if it's minimized
    }
    win.show(); // Make sure the window is visible
  }
});
ipcMain.on("minimizeWebCam", () => {
  if (floatingWebcam) floatingWebcam.minimize();
});
ipcMain.on("restoreWebCam", () => {
  if (floatingWebcam) {
    if (floatingWebcam.isMinimized()) {
      floatingWebcam.restore(); // Restore the window if it's minimized
    }
    floatingWebcam.show(); // Make sure the window is visible
  }
});

ipcMain.on("open-external-link", (_, url) => {
  // Close existing auth window if it exists
  const { width, height } = screen.getPrimaryDisplay().size;
  if (authWindow) {
    authWindow.close();
  }

  // Create new window sharing session with main window
  authWindow = new BrowserWindow({
    width,
    height,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // Share session with main window to maintain login state
      session: win?.webContents.session,
    },
  });

  authWindow.loadURL(url);

  authWindow.webContents.on("will-navigate", (event, newUrl) => {
    event.preventDefault();
    shell.openExternal(newUrl);
    authWindow?.close();
  });

  // Also handle redirects
  authWindow.webContents.on("will-redirect", (event, newUrl) => {
    event.preventDefault();
    shell.openExternal(newUrl);
    authWindow?.close();
  });

  // Clean up on close
  authWindow.on("closed", () => {
    authWindow = null;
  });
});

ipcMain.on("hide-plugin", (event, payload) => {
  console.log(event);
  win?.webContents.send("hide-plugin", payload);
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
