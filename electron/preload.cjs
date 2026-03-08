const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('mangaAPI', {
  importFolder: () => ipcRenderer.invoke('library:importFolder'),
  getLibrary: () => ipcRenderer.invoke('library:getAll'),
  getProgress: (mangaId) => ipcRenderer.invoke('reader:getProgress', mangaId),
  saveProgress: (payload) => ipcRenderer.invoke('reader:saveProgress', payload)
});
