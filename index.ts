import { app, BrowserWindow } from 'electron';
import * as path from 'path';

import ClientBinaryManager from './modules/ClientBinaryManager';
import Settings from './modules/Settings';
import GethManager from './modules/GethManager';

let mainWindow;
let settingManager;
let binaryManager;
let gethNode

app.on('ready', async () => {
  settingManager = new Settings();

  // Client Binary Download, Download Check
  binaryManager = new ClientBinaryManager(path.join(__dirname, 'clientBinaries.json'), settingManager);
  await binaryManager.ManagerInit();
  if (!binaryManager.isDownloaded()) {
    await binaryManager.NodeDownload();
  }

  gethNode = new GethManager(binaryManager.getBinaryPath(), settingManager);
  gethNode.setSyncmodeLight();
  gethNode.start();
  
  mainWindow = new BrowserWindow();
  mainWindow.loadURL(path.join('file://', __dirname, 'index.html'));

  mainWindow.on('closed', function() {
    mainWindow = null;
    gethNode.stop();
  });
});