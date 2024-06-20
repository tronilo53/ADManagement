/**
 * * Importaciones de Módulos
 */
import { app, BrowserWindow, ipcMain, Menu } from "electron";
import isDev from "electron-is-dev";
import pkg from "electron-updater";
const { autoUpdater } = pkg;
import { exec } from "child_process";
import Store from "electron-store";
const store = new Store();

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
function createWindow() {
    //autoUpdater.checkForUpdates();
    appWin = new BrowserWindow(
        { 
            width: 950, 
            height: 720,
            resizable: false,
            center: true, 
            webPreferences: { 
                contextIsolation: false, 
                nodeIntegration: true 
            },
            show: false
        }
    );
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
            show: true,
            frame: false,
            transparent: true,
            alwaysOnTop: true
        }
    );
    if(isDev) {
        appWin.setIcon( './src/assets/favicon.png' );
        appPrelaod.setIcon( './src/assets/favicon.png' );
        const menuDev = Menu.buildFromTemplate( menuTemplateDev );
        appWin.setMenu( menuDev );
        appWin.loadURL( 'http://localhost:4200/' );
        appPrelaod.loadURL( 'http://localhost:4200/#/Preload' );
        //appPrelaod.webContents.openDevTools({mode: 'detach'});
        appWin.webContents.openDevTools({mode: 'detach'});
    }else {
        appWin.setIcon( 'resources/app/src/assets/favicon.png' );
        appPrelaod.setIcon( 'resources/app/src/assets/favicon.png' );
        appWin.loadURL( `file://${ __dirname }/dist/index.html` );
        appPrelaod.loadURL( `file://${ __dirname }/dist/index.html#/Preload` );
    }
    appPrelaod.once( "ready-to-show", () => {
        //checks();
        const path = 'src/assets/scripts/test.ps1';
        exec(`powershell.exe -ExecutionPolicy Bypass -Command "& { . '${path}' }"`, (error, stdout, stderr) => {
            if (error) {
            appWin.webContents.send('getOusError', error.message);
            return;
            }
            if(store.get('ous')){
                store.delete('ous');
                store.set('ous', stdout);
            }else store.set('ous', stdout);
            appPrelaod.close();
            appWin.show();
        });
    });

    appWin.on( "closed", () => appWin = null );
    //appPrelaod.on( "closed", () => appPrelaod = null );
};

/**
 * * Preparar la App
 */
app.whenReady().then( () => {
    createWindow();
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
    appWin.show();
});
ipcMain.on('getOus', (event, args) => {
    event.sender.send('getOus', store.get('ous'));
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