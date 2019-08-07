const { remote, shell, ipcRenderer } = require('electron')
const { BrowserWindow } = remote

document.addEventListener('click', function (event) {
  if (event.target.tagName === 'A' && event.target.href.startsWith('http')) {
    event.preventDefault()
    shell.openExternal(event.target.href)
  }
})

document.getElementById("auth").addEventListener ('click', function () {
  ipcRenderer.sendSync('vk-oauth', 'token')
})
