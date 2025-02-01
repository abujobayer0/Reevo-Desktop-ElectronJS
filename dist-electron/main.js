import { app as l, ipcMain as c, screen as r, desktopCapturer as u, BrowserWindow as d } from "electron";
import { fileURLToPath as w } from "node:url";
import n from "node:path";
const p = n.dirname(w(import.meta.url));
process.env.APP_ROOT = n.join(p, "..");
const a = process.env.VITE_DEV_SERVER_URL, b = n.join(process.env.APP_ROOT, "dist-electron"), h = n.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = a ? n.join(process.env.APP_ROOT, "public") : h;
let o, e, s;
function m() {
  o = new d({
    width: 400,
    height: 360,
    minHeight: 360,
    minWidth: 300,
    frame: !1,
    transparent: !0,
    hasShadow: !1,
    x: r.getPrimaryDisplay().workAreaSize.width - 400,
    y: 0,
    alwaysOnTop: !0,
    focusable: !0,
    icon: n.join(process.env.VITE_PUBLIC, "logo.svg"),
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      devTools: !0,
      preload: n.join(p, "preload.mjs")
    }
  }), e = new d({
    width: 300,
    height: 50,
    minHeight: 50,
    maxHeight: 50,
    minWidth: 300,
    maxWidth: 300,
    x: r.getPrimaryDisplay().workAreaSize.width,
    y: r.getPrimaryDisplay().workAreaSize.height,
    frame: !1,
    transparent: !0,
    alwaysOnTop: !0,
    icon: n.join(process.env.VITE_PUBLIC, "logo.svg"),
    focusable: !0,
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      devTools: !0,
      preload: n.join(p, "preload.mjs")
    }
  }), s = new d({
    width: 200,
    height: 200,
    minHeight: 200,
    maxHeight: 200,
    minWidth: 200,
    maxWidth: 200,
    frame: !1,
    x: r.getPrimaryDisplay().workAreaSize.width - 250,
    y: r.getPrimaryDisplay().workAreaSize.height - 230,
    transparent: !0,
    alwaysOnTop: !0,
    focusable: !0,
    icon: n.join(process.env.VITE_PUBLIC, "logo.svg"),
    webPreferences: {
      nodeIntegration: !1,
      contextIsolation: !0,
      devTools: !0,
      preload: n.join(p, "preload.mjs")
    }
  }), e.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }), e.setAlwaysOnTop(!0, "screen-saver", 1), s.setVisibleOnAllWorkspaces(!0, { visibleOnFullScreen: !0 }), s.setAlwaysOnTop(!0, "screen-saver", 1), o.webContents.on("did-finish-load", () => {
    o == null || o.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  }), e.webContents.on("did-finish-load", () => {
    e == null || e.webContents.send(
      "main-process-message",
      (/* @__PURE__ */ new Date()).toLocaleString()
    );
  }), a ? (o.loadURL(a), e.loadURL(`${a}/studio.html`), s.loadURL(`${a}/webcam.html`)) : (o.loadFile(n.join(h, "index.html")), e.loadFile(n.join(h, "studio.html")), s.loadFile(n.join(h, "webcam.html")));
}
l.on("window-all-closed", () => {
  process.platform !== "darwin" && (l.quit(), o = null, e = null, s = null);
});
c.on("closeApp", () => {
  process.platform !== "darwin" && (l.quit(), o = null, e = null, s = null);
});
c.handle("getSources", async () => {
  const { width: i, height: t } = r.getPrimaryDisplay().size;
  return await u.getSources({
    thumbnailSize: { width: i, height: t },
    fetchWindowIcons: !0,
    types: ["window", "screen"]
  });
});
c.on("media-sources", (i, t) => {
  console.log(i), e == null || e.webContents.send("profile-recieved", t);
});
c.on("resize-studio", (i, t) => {
  console.log(i), t.shrink && (e == null || e.setSize(400, 100)), t.shrink || e == null || e.setSize(400, 250);
});
c.on("hide-plugin", (i, t) => {
  console.log(i), o == null || o.webContents.send("hide-plugin", t);
});
l.on("activate", () => {
  d.getAllWindows().length === 0 && m();
});
l.whenReady().then(m);
export {
  b as MAIN_DIST,
  h as RENDERER_DIST,
  a as VITE_DEV_SERVER_URL
};
