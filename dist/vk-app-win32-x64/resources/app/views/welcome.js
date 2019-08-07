const { remote, ipcRenderer } = require('electron')
const { BrowserWindow } = remote


document.getElementById("token").innerHTML = remote.getGlobal('token');
