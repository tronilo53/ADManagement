/**
 * * Importaciones de Módulos
 */
import { app, BrowserWindow, ipcMain, Menu, Tray, dialog } from "electron";
import isDev from "electron-is-dev";
import pkg from "electron-updater";
import { execFile } from "child_process";
import Store from "electron-store";
import path from 'path';
import fs from 'fs';
import isElevated from 'is-elevated';

const { autoUpdater } = pkg;
const store = new Store();
const __dirname = path.resolve();

/**
 * *Constantes
 */
const PATH_ASSETS = isDev ? path.join(__dirname, 'src', 'assets') : path.join(__dirname, 'resources', 'app', 'src', 'assets');
const PATH_ICON = path.join(PATH_ASSETS, 'favicon.png');
const PATH_CHANGELOG = isDev ? path.join(__dirname, 'CHANGELOG.md') : path.join(__dirname, 'resources', 'app', 'CHANGELOG.md');
const PATH_DIST = path.join(__dirname, 'resources', 'app', 'dist', 'browser');
const URL_PRELOAD = isDev ? 'http://localhost:4200/#/Preload' : path.join(__dirname, PATH_DIST, 'index.html#', 'Preload');
const URL_HOME = isDev ? 'http://localhost:4200/' : path.join(__dirname, PATH_DIST, 'index.html');
const MENU_TEMPLATE = isDev ? [
    {
        label: 'Archivo',
        submenu: [
            { role: 'toggledevtools' },
            { label: 'Comprobar Actualizaciones', click: () => autoUpdater.checkForUpdatesAndNotify() }
        ]
    }
] : [
    {
        label: 'Archivo',
        submenu: [
            { label: 'Comprobar Actualizaciones', click: () => autoUpdater.checkForUpdatesAndNotify() }
        ]
    }
];
const MENU = Menu.buildFromTemplate( MENU_TEMPLATE );
const MENU_TRY_TEMPLATE = [ {label: 'Salir', click: () => app.quit()} ];
const MENU_TRY = Menu.buildFromTemplate( MENU_TRY_TEMPLATE );

/**
 * * Propiedades de AutoUpdater
 */
autoUpdater.autoDownload = false;
autoUpdater.autoRunAppAfterInstall = true;

/**
 * * Declaraciones de Variables
 */
let appWin;
let appPreload;
let tray = null;

/**
 * * Función de Inicio de app
 */
function appInit() {
    //Instancia de una nueva ventana
    appPreload = new BrowserWindow(
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
            transparent: false,
            alwaysOnTop: true
        }
    );
    appPreload.setIcon(PATH_ICON);
    appPreload.loadURL(URL_PRELOAD);
    appPreload.webContents.openDevTools({ mode: 'detach' });
    //Cuando la ventana está lista para ser mostrada...
    appPreload.once( "ready-to-show", () => {
        isElevated().then(elevated => {
            if(elevated) {
                //Variables con las rutas del script de Powershell
                const pathOu = path.join(PATH_ASSETS, 'scripts', 'Get-ADOrganizationalUnit.ps1');
                execFile('powershell.exe',['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', pathOu],(error, stdout, stderr) => {
                    //Si existe un error...
                    if (error || stderr) {
                        //Si existen Ou's en store las borra
                        if(store.get('ous', false)) store.delete('ous');
                        //Manda por el canal 'getOusError' el error
                        appPreload.webContents.send('getOusError');
                        setTimeout(() => {
                            //Cierra la ventana de Preload
                            appPreload.close();
                            //Crea la ventana principal
                            createHome();
                        }, 3000);
                    }else {
                        //Establece o reemplaza un nuevo JSON llamado 'ous' guardando las Unidades Organizativas
                        store.set('ous', JSON.parse(stdout));
                        //Cierra la ventana de Preload
                        appPreload.close();
                        //Crea la ventana principal
                        createHome();
                    }
                });
            }else {
                dialog.showMessageBox(appPreload, {
                    type: 'error',
                    title: 'Permiso Denegado',
                    message: 'Se necesitan privilegios para usar la App. Disculpen las molestias.',
                    buttons: ['Cerrar']
                }).then(() => { app.quit() });
            }
        });
    });
    //Cuando se llama a .close() la ventana Preload se cierra
    appPreload.on( "closed", () => appPreload = null );
}
/**
 * * Función de ventana principal
 */
function createHome() {
    //Instancia para una nueva ventana
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
    //Si se está en modo de desarrollo...
    appWin.setIcon(PATH_ICON);
    appWin.setMenu(MENU);
    appWin.loadURL(URL_HOME);
    if(isDev) appWin.webContents.openDevTools({ mode: 'detach' });
    
    //Cuando la ventana está lista para ser mostrada...
    appWin.once( "ready-to-show", () => {
        //UPDATES DE PRUEBA
        /*if(isDev) {
            autoUpdater.updateConfigPath = path.join(__dirname, 'dev-app-update.yml');
            autoUpdater.forceDevUpdateConfig = true; 
        }*/
        //Pone a la escucha la comprobación de actualizaciones
        autoUpdater.checkForUpdatesAndNotify();
        //Pone a la escucha los eventos de actualizaciones
        checks();
    });
    //Cuando se llama a .close() la ventana principal se cierra
    appWin.on( "closed", () => appWin = null );
};

/**
 * * Preparar la App
 */
app.whenReady().then( () => {
    //Se Lanza primero la ventana de Preload y continua..
    appInit();
    //Se crea una instancia de 'Tray' (Icono en la barra de tareas)
    tray = new Tray(PATH_ICON);
    //Se crea un nombre para la bandeja
    tray.setToolTip('ADManagement');
    //Se crea un menu para la bandeja
    tray.setContextMenu(MENU_TRY);
});

/**
 * * Comunicación entre procesos
 */
//Obtiene las Unidades Organizativas de AD guardadas en el store
ipcMain.on('getOus', (event, args) => { event.sender.send('getOus', store.get('ous', false)) });
//Obtiene las Unidades Organizativas de AD
ipcMain.on('getOusReload', (event, args) => {
    const pathOu = path.join(PATH_ASSETS, 'scripts', 'Get-ADOrganizationalUnit.ps1');
    execFile('powershell.exe',['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', pathOu],(error, stdout, stderr) => {
        //Si existe un error...
        if (error || stderr) event.sender.send('getOusReload', '002');
        else event.sender.send('getOusReload', stdout);
    });
});
//Obtiene un usuario de AD
ipcMain.on('Get-ADUser', (event, data) => {
    const path = path.join(PATH_ASSETS, 'scripts', 'Get-ADUser.ps1');
    execFile('powershell.exe',['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path, '-email', data],(error, stdout, stderr) => {
        if(error) {
            event.sender.send('Get-ADUser', { response: 'Error', data: error.message });
            return;
        }
        event.sender.send('Get-ADUser', { response: 'Success', data: stdout });
    });
});
//Obtiene los grupos de un usuario de AD
ipcMain.on('Get-ADGroup', (event, data) => {
    const path = path.join(PATH_ASSETS, 'scripts', 'Get-ADGroup.ps1');
    execFile('powershell.exe',['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path, '-distinguishedName', data],(error, stdout, stderr) => {
        if(error) {
            event.sender.send('Get-ADGroup', { response: 'Error', data: error.message });
            return;
        }
        event.sender.send('Get-ADGroup', { response: 'Success', data: stdout });
    });
});
//Crea un Nuevo Usuario en AD
ipcMain.on('New-ADUser', (event, data) => {
    const path = path.join(PATH_ASSETS, 'scripts', 'New-ADUser.ps1');
    const jsonData = JSON.stringify(data);
    execFile('powershell.exe',['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path, '-MyObject', jsonData],(error, stdout, stderr) => {
        if(error || stderr) event.sender.send('New-ADUser', { response: 'Error' });
        else event.sender.send('New-ADUser', { response: 'Success', data: stdout });
    });
});
//Guarda los datos de configuración de la App
ipcMain.on('setConfig', (event, args) => {
    try { store.set('config', args); event.sender.send('setConfig', '001'); }
    catch(error) { event.sender.send('setConfig', '002') }
});
//comprueba si existe configuracion guardada
ipcMain.on('getConfig', (event, args) => { event.sender.send('getConfig', store.get('config', false)) });
//Comprueba la bandera de que se ha instalado una nueva actualizacion
ipcMain.on('checkChangeLog', (event, args) => { event.sender.send('checkChangeLog', store.get('changeLog', false)) });
//Elimina del store la bandera de la instalacion de la nueva actualizacion
ipcMain.on('deleteChangeLog', (event, args) => {
    try { store.delete('changeLog'); event.sender.send('deleteChangeLog', '001'); } 
    catch (error) { event.sender.send('deleteChangeLog', '002'); }
});
//Obtiene la info del fichero CHANGELOG.md
ipcMain.on('getChangeLog', (event, args) => { fs.readFile(PATH_CHANGELOG, 'utf8', (err, data) => { event.sender.send('getChangeLog', data) }) });

//CERRAR APLICACIÓN
ipcMain.on( 'closeApp', ( event, args ) => app.quit());
//DESCARGAR ACTUALIZACION
ipcMain.on( 'downloadApp', () => autoUpdater.downloadUpdate() );
//INSTALAR ACTUALIZACION
ipcMain.on( 'installApp', () => autoUpdater.quitAndInstall() );
//OBTENER VERSION DE APP
ipcMain.on( 'getVersion', ( event, args ) => { event.sender.send( 'getVersion', app.getVersion() ) });

/**
 * * Eventos de Actualizaciones Automáticas
 */
const checks = () => {
    autoUpdater.on( 'checking-for-update', () => {
        appWin.webContents.send( 'checking_for_update' );
    });
    autoUpdater.on( 'update-available', ( info ) => {
        appWin.webContents.send( 'update_available', info );
    });
    autoUpdater.on( 'update-not-available', () => {
        appWin.webContents.send( 'update_not_available' );
    });
    autoUpdater.on( 'download-progress', ( progressObj ) => {
        appWin.webContents.send( 'download_progress', Math.trunc( progressObj.percent ) );
    });
    autoUpdater.on( 'update-downloaded', () => {
        store.set('changeLog', true);
        appWin.webContents.send( 'update_downloaded' );
    });
    autoUpdater.on( 'error', ( error ) => {
        fs.writeFile(path.join(PATH_ASSETS, 'log.txt'), error, (errorReq) => {
            appWin.webContents.send( 'error_update' );
        });
    });
};