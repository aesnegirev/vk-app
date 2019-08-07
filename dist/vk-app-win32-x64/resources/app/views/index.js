const { remote, ipcRenderer } = require('electron')
const { BrowserWindow } = remote

document.getElementById("auth").addEventListener ('click', function () {
  ipcRenderer.sendSync('vk-oauth', 'token')
})
