import { app, BrowserWindow, dialog, Menu } from 'electron';
import pkg from 'electron-updater';
const { autoUpdater } = pkg;
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    autoHideMenuBar: true
  });
  
  // Remove default menu to improve aesthetics
  Menu.setApplicationMenu(null);

  // In production, load the built index.html
  // In development, you could load the Vite dev server URL
  if (app.isPackaged) {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  } else {
    // Assuming Vite runs on port 5173
    win.loadURL('http://localhost:5173');
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  // Setup Auto Updater
  if (app.isPackaged) {
    autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.on('update-available', () => {
      dialog.showMessageBox({
        type: 'info',
        title: 'Pembaruan Tersedia',
        message: 'Versi baru dari Mubtadiaat Admin tersedia. Mengunduh pembaruan di latar belakang...'
      });
    });

    autoUpdater.on('update-downloaded', () => {
      dialog.showMessageBox({
        type: 'question',
        buttons: ['Restart Sekarang', 'Nanti'],
        defaultId: 0,
        title: 'Pembaruan Siap',
        message: 'Pembaruan telah berhasil diunduh. Aplikasi akan dimulai ulang untuk menerapkan pembaruan.',
      }).then(result => {
        if (result.response === 0) {
          autoUpdater.quitAndInstall();
        }
      });
    });
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
