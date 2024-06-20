/**
 * * Importaciones de Módulos
 */
import { app, BrowserWindow, ipcMain, Menu } from "electron";
import isDev from "electron-is-dev";
import pkg from "electron-updater";
import { execFile } from "child_process";
import Store from "electron-store";

const { autoUpdater } = pkg;
const store = new Store();

app.disableHardwareAcceleration();

/**
 * * Propiedades de AutoUpdater
 */
autoUpdater.autoDownload = false;
autoUpdater.autoRunAppAfterInstall = true;

/**
 * * Declaraciones de Variables
 */
let appWin;
let appPrelaod;

/**
 * * Preparación del Menú
 */
let menuTemplateDev = [
    {
        label: 'Vista',
        submenu: [
            { role: 'toggledevtools' }
        ]
    }
];

/**
 * * Función de ventana Principal y Preload
 */
function createPreload() {
    appPrelaod = new BrowserWindow(
        {
            width: 600, 
            height: 400,
            resizable: false,
            center: true,
            webPreferences: { 
                contextIsolation: false, 
                nodeIntegration: true 
            },
            frame: false,
            transparent: true,
            alwaysOnTop: true
        }
    );
    if(isDev) {
        appPrelaod.setIcon( './src/assets/favicon.png' );
        appPrelaod.loadURL( 'http://localhost:4200/#/Preload' );
        //appPrelaod.webContents.openDevTools({mode: 'detach'});
    }else {
        appPrelaod.setIcon( 'resources/app/src/assets/favicon.png' );
        appPrelaod.loadURL( `file://${ __dirname }/dist/index.html#/Preload` );
    }
    appPrelaod.once( "ready-to-show", () => {
        const path = 'src/assets/scripts/test.ps1';
        execFile('powershell.exe',['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path],(error, stdout, stderr) => {
            if (error) {
            appWin.webContents.send('getOusError', error.message);
            console.log(error.message);
            return;
            }
            console.log(stdout);
            if(store.get('ous')){
                store.delete('ous');
                store.set('ous', stdout);
            }else store.set('ous', stdout);
            appPrelaod.close();
            //autoUpdater.checkForUpdates();
            createHome();
        });
    });
    appPrelaod.on( "closed", () => appPrelaod = null );
}
function createHome() {
    appWin = new BrowserWindow(
        { 
            width: 950, 
            height: 720,
            resizable: false,
            center: true, 
            webPreferences: { 
                contextIsolation: false, 
                nodeIntegration: true 
            }
        });
    if(isDev) {
        appWin.setIcon( './src/assets/favicon.png' );
        const menuDev = Menu.buildFromTemplate( menuTemplateDev );
        appWin.setMenu( menuDev );
        appWin.loadURL( 'http://localhost:4200/' );
        appWin.webContents.openDevTools({mode: 'detach'});
    }else {
        appWin.setIcon( 'resources/app/src/assets/favicon.png' );
        appWin.loadURL( `file://${ __dirname }/dist/index.html` );
    }
    appWin.once( "ready-to-show", () => {
        //checks();
    });
    appWin.on( "closed", () => appWin = null );
};

/**
 * * Preparar la App
 */
app.whenReady().then( () => {
    createPreload();
});

/**
 * * Acciones para cerrar la App en MacOs
 */
app.on( "window-all-closed", () => {
    if( process.platform !== 'darwin' ) app.quit();
});

/**
 * * Comunicación entre procesos
 */
ipcMain.on('closePreload', (event, args) => {
    appPrelaod.close();
    createHome();
});
ipcMain.on('getOus', (event, args) => {
    event.sender.send('getOus', store.get('ous'));
});
ipcMain.on('Get-ADUser', (event, data) => {
    const path = 'src/assets/scripts/Get-ADUser.ps1';
    execFile('powershell.exe',['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path, '-email', data],(error, stdout, stderr) => {
        if(error) {
            event.sender.send('Get-ADUser', { response: 'Error', data: error.message });
            return;
        }
        event.sender.send('Get-ADUser', { response: 'Success', data: stdout });
    });
});

// Maneja los eventos de IPC desde la interfaz de usuario

//CERRAR APLICACIÓN
ipcMain.on( 'closeApp', ( event, args ) => app.quit());
//DESCARGAR ACTUALIZACION
ipcMain.on( 'downloadApp', () => autoUpdater.downloadUpdate() );
//INSTALAR ACTUALIZACION
ipcMain.on( 'installApp', () => autoUpdater.quitAndInstall() );
//OBTENER VERSION DE APP
ipcMain.on( 'setVersion', ( event, args ) => event.sender.send( 'setVersion', { data: app.getVersion() } ) );

/**
 * * Eventos de Actualizaciones Automáticas
 */
let checks = () => {
    autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.on( 'update-available', ( info ) => {
        appWin.webContents.send( 'update_available' );
    });
    autoUpdater.on( 'update-not-available', () => {
        appWin.webContents.send( 'update_not_available' );
    });
    autoUpdater.on( 'download-progress', ( progressObj ) => {
        appWin.webContents.send( 'download_progress', Math.trunc( progressObj.percent ) );
    });
    autoUpdater.on( 'update-downloaded', () => {
        appWin.webContents.send( 'update_downloaded' );
    });
    autoUpdater.on( 'error', ( error ) => {
        appWin.webContents.send( 'error_update' );
    });
};