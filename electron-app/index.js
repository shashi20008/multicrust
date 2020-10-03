const { app, BrowserWindow } = require('electron');
const path = require('path');
const { fork } = require('child_process');

function createWindow(host, port) {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const query = `?host=${encodeURIComponent(`http://${host}:${port}`)}`;
  if (process.env.DEV_MODE) {
    win.loadURL(`http://localhost:3000${query}`);
  } else {
    win.loadFile(`build/index.html${query}`);
  }
}

function prepareLocalCore() {
  return new Promise((resolve, reject) => {
    const serverPath = '../core/server/index.js';
    const localServer = fork(serverPath, {
      stdio: [0, 1, 2, 'ipc'],
      env: {
        ...process.env,
        LOCAL_MODE: true,
      },
    });

    localServer.once('message', (port) => {
      console.log('got port', port);
      if (isNaN(port)) {
        return reject(new Error('INVALID_PORT_RECEIVED'));
      }
      return resolve(Number(port));
    });

    localServer.on('error', (err) => {
      console.log('Core died with error:', err.stack);
    });

    localServer.once('exit', (code) => {
      console.log('Core has exited:', code);
      app.quit();
    });
  });
}

Promise.all([app.whenReady(), prepareLocalCore()]).then(([, port]) =>
  createWindow('localhost', port)
);

/**
 * Quits the application when all windows are closed.
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

/**
 * On MacOS a closed app could get re-activated from dock.
 */
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
