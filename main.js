const { app, BrowserWindow, session, protocol, net, ipcMain, Notification, shell, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const { pathToFileURL } = require('url');

const DIST = path.join(__dirname, 'dist');
const PRELOAD = path.join(__dirname, 'preload.js');

let mainWin = null;
let miniWin = null;

// Module scripts don't load from file://, so the built app is served from app://.
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { standard: true, secure: true, supportFetchAPI: true } },
]);

function registerAppProtocol() {
  protocol.handle('app', (request) => {
    const { pathname } = new URL(request.url);
    const rel = decodeURIComponent(pathname === '/' ? '/index.html' : pathname);
    const file = path.normalize(path.join(DIST, rel));
    if (!file.startsWith(DIST + path.sep)) {
      return new Response('Forbidden', { status: 403 });
    }
    return net.fetch(pathToFileURL(file).toString());
  });
}

function setYouTubeReferer() {
  // YouTube refuses embeds that come without a normal web referrer (error 153).
  session.defaultSession.webRequest.onBeforeSendHeaders(
    { urls: ['https://www.youtube.com/*', 'https://*.youtube.com/*'] },
    (details, callback) => {
      details.requestHeaders['Referer'] = 'https://pomodoro-desktop.local/';
      callback({ requestHeaders: details.requestHeaders });
    }
  );
}

function webPrefs() {
  return { preload: PRELOAD, contextIsolation: true, nodeIntegration: false };
}

function createMainWindow() {
  mainWin = new BrowserWindow({
    width: 1200,
    height: 820,
    minWidth: 720,
    minHeight: 560,
    title: 'Pomodoro',
    webPreferences: webPrefs(),
  });
  // Links that open in a new window (like the coffee button) go to the system browser.
  mainWin.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
  mainWin.on('closed', () => {
    mainWin = null;
    closeMini();
  });
  mainWin.loadURL('app://pomodoro/index.html');
}

function openMini() {
  if (miniWin) return;
  miniWin = new BrowserWindow({
    width: 260,
    height: 130,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    fullscreenable: false,
    title: 'Pomodoro mini',
    webPreferences: webPrefs(),
  });
  miniWin.setAlwaysOnTop(true, 'floating');
  miniWin.on('closed', () => {
    miniWin = null;
    mainWin?.webContents.send('pip:closed');
  });
  miniWin.loadURL('app://pomodoro/index.html?mini=1');
}

function closeMini() {
  if (!miniWin) return;
  const win = miniWin;
  miniWin = null;
  win.close();
}

ipcMain.on('notify', (_e, { title, body }) => {
  if (Notification.isSupported()) new Notification({ title, body }).show();
});

// Renderer <-> renderer relays. The main window owns the timer; the mini window only displays it.
ipcMain.on('pip:toggle', () => (miniWin ? closeMini() : openMini()));
ipcMain.on('timer:state', (_e, state) => miniWin?.webContents.send('timer:update', state));
ipcMain.on('timer:request', () => mainWin?.webContents.send('timer:resend'));
ipcMain.on('timer:command', (_e, command) => mainWin?.webContents.send('timer:command', command));

// Checks GitHub for a newer release. Downloads it in the background, then asks the user to restart.
// Updates are optional: any failure is ignored so the timer keeps working.
function setupAutoUpdate() {
  if (!app.isPackaged) return;
  autoUpdater.autoDownload = true;
  autoUpdater.on('update-downloaded', async () => {
    const { response } = await dialog.showMessageBox(mainWin, {
      type: 'info',
      buttons: ['Restart now', 'Later'],
      defaultId: 0,
      title: 'Update ready',
      message: 'A new version of Pomodoro is ready.',
      detail: 'Restart to install it.',
    });
    if (response === 0) autoUpdater.quitAndInstall();
  });
  autoUpdater.on('error', () => {});
  autoUpdater.checkForUpdates().catch(() => {});
}

app.whenReady().then(() => {
  registerAppProtocol();
  setYouTubeReferer();
  createMainWindow();
  setupAutoUpdate();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
