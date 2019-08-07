const { session, Tray, ipcMain, nativeImage, Menu, app, BrowserWindow } = require('electron'),
      path = require('path'),
      url = require('url')

require('update-electron-app')({
  repo: 'aesnegirev/vk-app',
  updateInterval: '1 hour',
  logger: require('electron-log')
})



var win = null

global.token = null


  const gotTheLock = app.requestSingleInstanceLock()
  if (!gotTheLock) {
    console.log('donot get the lock, app will exit.')
    app.exit()
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
      if (win) {
        if (win.isMinimized()) win.restore()
          win.focus()
        }
      })
  }


// Этот метод будет вызываться, когда Electron закончит
// инициализацию и готов к созданию окон браузера.
// Некоторые API могут использоваться только после возникновения этого события.
app.on('ready', function () {

  win = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 800,
    minHeight: 600,
    resizable: true,
    kiosk: false,
    skipTaskbar: false,
    simpleFullscreen: true,
    icon: path.join(__dirname, 'assets/img/icon-app.ico'),
    webPreferences: {
      nodeIntegration: true
    }
  })




  win.setMenu(null) // Удалить стадартное меню


  win.on('closed', () => {
    // Разбирает объект окна, обычно вы можете хранить окна
    // в массиве, если ваше приложение поддерживает несколько окон в это время,
    // тогда вы должны удалить соответствующий элемент.
    win = null
  })

  const iconPath = path.join(__dirname, 'assets/img/icon-app.ico');
        win.tray = new Tray(nativeImage.createFromPath(iconPath));

  var contextMenu = Menu.buildFromTemplate([
      { label: 'Развернуть', click:  function(){
          win.show();
      } },
      { label: 'Закрыть', click:  function(){
          app.isQuiting = true;
          app.quit();
      } }
  ]);

  win.tray.on('double-click', function(e){
    if (win.isVisible()) {
      win.hide()
    } else {
      win.show()
    }
  });


  win.tray.setToolTip('VK APP')
  win.tray.setContextMenu(contextMenu)


  win.on('close', function (event) { // Отменяем закрытие и сворачиваем в tray
      if(!app.isQuiting){
          event.preventDefault();
          win.hide();
      }

      return false;
  });

  win.loadFile('views/index.html')
  //win.webContents.openDevTools()















  ipcMain.on('vk-oauth', (event, arg) => {

    var authWindow = new BrowserWindow({ alwaysOnTop: true, minimizable: false, maximazable: false, parent: win, modal: true, resizable: false, width: 800, height: 600, icon: path.join(__dirname, 'assets/img/icon-app.ico') })

    authWindow.loadURL('https://oauth.vk.com/authorize?client_id=6982830&display=page&redirect_uri=https://oauth.vk.com/blank.html&scope=notifications,groups,docs,offline,ads,wall,notes,status,+256,pages,stories,video,audio,photos,friends,notify,stats,email,market&response_type=token&v=5.101&state=123456&revoke=true');
    authWindow.setMenu(null) // Удалить стадартное меню

    authWindow.webContents.on('did-redirect-navigation', function (e, uri) {

      let hash = url.parse(uri)

      if(hash.pathname == "/blank.html"){
        token = hash
        event.returnValue = true
        authWindow.close()
      }

    })
    authWindow.on('close', function(){
      event.returnValue = false
      authWindow = null
    })


  })


















})

// Выходим, когда все окна будут закрыты.
app.on('window-all-closed', () => {
  // Для приложений и строки меню в macOS является обычным делом оставаться
  // активными до тех пор, пока пользователь не выйдет окончательно используя Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
   // На MacOS обычно пересоздают окно в приложении,
   // после того, как на иконку в доке нажали и других открытых окон нету.
  if (win === null) {
    createWindow()
  }
})
