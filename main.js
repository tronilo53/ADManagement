/**
 * * Importaciones de Módulos
 */
const { app, BrowserWindow, ipcMain, Menu } = require( "electron" );
const isDev = require( "electron-is-dev" );
const { autoUpdater } = require( "electron-updater" );

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
createWindow = () => {
    //autoUpdater.checkForUpdates();
    appWin = new BrowserWindow(
        { 
            width: 800, 
            height: 670,
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
            frame: false,
            transparent: true,
            alwaysOnTop: true
        }
    );
    if(isDev) {
        appWin.setIcon( 'src/assets/favicon.png' );
        appPrelaod.setIcon( 'src/assets/favicon.png' );
        const menuDev = Menu.buildFromTemplate( menuTemplateDev );
        appWin.setMenu( menuDev );
        appWin.loadURL( 'http://localhost:4200/' );
        appPrelaod.loadURL( 'http://localhost:4200/#/Preload' );
    }else {
        appWin.setIcon( 'resources/app/src/assets/favicon.png' );
        appPrelaod.setIcon( 'resources/app/src/assets/favicon.png' );
        appWin.loadURL( `file://${ __dirname }/dist/index.html` );
        appPrelaod.loadURL( `file://${ __dirname }/dist/index.html#/Preload` );
    }
    appWin.once( "ready-to-show", () => {
        //checks();
    });

    setTimeout( () => {
        appPrelaod.close();
        appWin.show();
    }, 3000);

    appWin.on( "closed", () => appWin = null );
    appPrelaod.on( "closed", () => appPrelaod = null );
};

/**
 * * Preparar la App
 */
app.whenReady().then( () => createWindow() );

/**
 * * Acciones para cerrar la App en MacOs
 */
app.on( "window-all-closed", () => {
    if( process.platform !== 'darwin' ) app.quit();
});

/**
 * * Comunicación entre procesos
 */
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