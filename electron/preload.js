// Expose safe APIs to renderer if needed
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  isDev: process.env.NODE_ENV === 'development'
});
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  isDev: process.env.NODE_ENV === 'development'
});