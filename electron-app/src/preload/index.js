import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import fs from 'node:fs'
import { Blob } from 'node:buffer' 

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
  selectMediaFile: () => ipcRenderer.invoke('select-media-file'),

  getFileBuffer: async (filePath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) return reject(err)
        resolve(data)
      })
    })
  },

  readFileAsBlob: async (filePath) => {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
        if (err) return reject(err)
        resolve({
          buffer: data.buffer,
          mimeType: '',
        })
      })
    })
  },

  getFileStats: (filePath) => {
    try {
      const stats = fs.statSync(filePath)
      return {
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
      }
    } catch (error) {
      console.error('Error getting file stats:', error)
      return null
    }
  }
})
