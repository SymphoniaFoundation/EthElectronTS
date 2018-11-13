import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

import ClientBinaryManager from './modules/ClientBinaryManager';
import Settings from './modules/Settings';
import GethManager from './modules/GethManager';

let mainWindow;
let settingManager;
let binaryManager;
let gethNode

const nodeSettingInit = async() => {
  settingManager = new Settings();
  // Client Binary Download, Download Check
  binaryManager = new ClientBinaryManager(path.join(__dirname, 'clientBinaries.json'), settingManager);
  await binaryManager.ManagerInit();

  gethNode = new GethManager(binaryManager.getBinaryPath(), settingManager);
}

const isNodeDownload = async () => {
  if (binaryManager.isDownloaded()) {
    mainWindow.webContents.send('is-node-downloaded', { status: true });
  } else {
    mainWindow.webContents.send('is-node-downloaded', { status: false });
  }
}

const NodeDownload = async () => {
  // true / false on ipc
  await binaryManager.NodeDownload();
}

const nodeStart = async () => {
  gethNode.setSyncmodeLight();
  gethNode.start();
}

const nodeStop = async () => {
  gethNode.stop();
}

const createBrowserWindow = async () => {
  mainWindow = new BrowserWindow();
  mainWindow.loadURL(path.join('file://', __dirname, 'index.html'));

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', async () => {
  await nodeSettingInit();
  await createBrowserWindow();
  ipcMain.on('get-node-downloaded', isNodeDownload);
  ipcMain.on('node-download', NodeDownload);
  ipcMain.on('node-start', nodeStart);
  ipcMain.on('node-stop', nodeStop);
});