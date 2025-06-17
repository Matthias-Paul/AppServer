import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  window.electron = electronAPI
  window.api = api
}




contextBridge.exposeInMainWorld('electronAPI', {
  getConfig: async () => {
    try {
      // fetch from backend
      const response = await fetch('http://localhost:5000/api/config')
      if (response.ok) {
        return await response.json()
      }
      return null
    } catch (error) {
      console.error('Error fetching config:', error)
      return null
    }
  },
  selectMediaFile: () => ipcRenderer.invoke('select-media-file')
});
