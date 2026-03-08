const { app, BrowserWindow, dialog, ipcMain, protocol, net } = require('electron');
const path = require('node:path');
const fs = require('node:fs/promises');
const { pathToFileURL } = require('node:url');
const Store = require('electron-store');

const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const store = new Store({
  name: 'manga-reader',
  defaults: {
    library: [],
    readingProgress: {}
  }
});

const toMangaProtocolPath = (absolutePath) => `manga://${encodeURIComponent(absolutePath)}`;

const isImageFile = (fileName) => IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase());

const collectImageFiles = async (baseDir) => {
  const entries = await fs.readdir(baseDir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(baseDir, entry.name);
      if (entry.isDirectory()) {
        return collectImageFiles(fullPath);
      }

      if (entry.isFile() && isImageFile(entry.name)) {
        return [fullPath];
      }

      return [];
    })
  );

  return files.flat().sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
};

const importFolder = async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });

  if (canceled || filePaths.length === 0) {
    return { canceled: true };
  }

  const selectedPath = filePaths[0];
  const images = await collectImageFiles(selectedPath);

  const mangaTitle = {
    id: selectedPath,
    title: path.basename(selectedPath),
    folderPath: selectedPath,
    pages: images.map((filePath) => ({
      filePath,
      src: toMangaProtocolPath(filePath)
    })),
    pageCount: images.length,
    importedAt: new Date().toISOString()
  };

  const currentLibrary = store.get('library');
  const withoutOldVersion = currentLibrary.filter((item) => item.id !== mangaTitle.id);
  const library = [mangaTitle, ...withoutOldVersion];
  store.set('library', library);

  return { canceled: false, mangaTitle, library };
};

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 1480,
    height: 920,
    minWidth: 1100,
    minHeight: 700,
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#090b14',
    vibrancy: 'under-window',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    await mainWindow.loadURL(devServerUrl);
  } else {
    await mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
};

app.whenReady().then(async () => {
  protocol.handle('manga', (request) => {
    const encodedPath = request.url.replace('manga://', '');
    const absolutePath = decodeURIComponent(encodedPath);
    return net.fetch(pathToFileURL(absolutePath).toString());
  });

  ipcMain.handle('library:importFolder', importFolder);
  ipcMain.handle('library:getAll', () => store.get('library'));
  ipcMain.handle('reader:getProgress', (_, mangaId) => {
    const progress = store.get('readingProgress');
    return progress[mangaId] ?? 0;
  });

  ipcMain.handle('reader:saveProgress', (_, { mangaId, pageIndex }) => {
    const progress = store.get('readingProgress');
    progress[mangaId] = pageIndex;
    store.set('readingProgress', progress);
    return true;
  });

  await createWindow();

  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
