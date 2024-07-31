/**
 * * Importaciones de Módulos
 */
import { app, BrowserWindow, ipcMain, Menu, Tray, dialog, shell } from "electron";
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
const ASSETS = isDev ? path.join(__dirname, 'src', 'assets') : path.join(process.resourcesPath, 'app.asar', 'src', 'assets');
const SCRIPTS = isDev ? path.join(__dirname, 'src', 'assets', 'scripts') : path.join(process.resourcesPath, 'scripts');
const CHANGELOG = isDev ? path.join(__dirname, 'CHANGELOG.md') : path.join(process.resourcesPath, 'app.asar', 'CHANGELOG.md');
const URL_PRELOAD = isDev ? 'http://localhost:4200#/Preload' : `file://${path.join(process.resourcesPath, 'app.asar', 'dist', 'browser', 'index.html')}#/Preload`;
const URL_HOME = isDev ? 'http://localhost:4200/' : `file://${path.join(process.resourcesPath, 'app.asar', 'dist', 'browser', 'index.html')}`;
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
            alwaysOnTop: true,
            icon: `${ASSETS}/favicon.png`
        }
    );
    appPreload.loadURL(URL_PRELOAD);
    //Cuando la ventana está lista para ser mostrada...
    appPreload.once( "ready-to-show", () => {
        //Si existen Unidades organizativas o Usuarios en el store los borra
        store.delete('ous');
        store.delete('users');
        //Verifica si se ejecuta como ADM
        isElevated().then(elevated => {
            //Si se ejecuta como ADM...
            if(elevated) {
                //Se ejecuta el script 'Get-ADOrganizationalUnit.ps1'
                execFile('powershell.exe',['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(SCRIPTS, 'Get-ADOrganizationalUnit.ps1')],(errorOu, stdoutOu, stderrOu) => {
                    //Si da un error al obtener las Unidades Organizativas...
                    if(errorOu || stderrOu) {
                        //Muestra una Alerta Nativa
                        alertNative(appPreload, 'error', 'Dominio EUHSI', 'No se ha podido contactar con el dominio. Algunos datos no se han obtenido.', ['Continuar'], () => {
                            //Cierra la Ventana AppPreload
                            appPreload.close();
                            //Crea la Ventana Principal
                            createHome();
                        });
                    //Si no da ningun error al obtener las unidades Organizativas...
                    }else {
                        //Se ejecuta el script 'Get-ADUsersAll.ps1'
                        execFile('powershell.exe',['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(SCRIPTS, 'Get-ADUsersAll.ps1')], (errorUs, stdoutUs, stderrUs) => {
                            //Se lee el archivo json de los usuarios
                            fs.readFile('C:\\temp\\users.json', 'utf8', (error, data) => {
                                //Se guarda el arreglo del json
                                const cleanData = stripBom(data);
                                //Se guarda el json limpio
                                const users = JSON.parse(cleanData);
                                //Se guardan las OU's y los usuarios en el store
                                store.set('ous', stdoutOu);
                                store.set('users', users);
                                //Se elimina el archivo json temporal
                                fs.unlink('C:\\temp\\users.json', () => {
                                    //Cierra la Ventana AppPreload
                                    appPreload.close();
                                    //Crea la Ventana Principal
                                    createHome();
                                });
                            });
                        });
                    }
                });
            //Si no se ejecuta como ADM, se muestra una alerta nativa y se cierra la Aplicación
            }else alertNative(appPreload, 'error', 'Permiso Denegado', 'Se necesitan privilegios para usar la App. Disculpen las molestias.', ['Salir'], () => { app.quit() });
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
                nodeIntegration: true,
                webSecurity: false
            },
            icon: `${ASSETS}/favicon.png`,
            title: `${app.name} v${app.getVersion()}`
        });
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

function alertNative(parent, type, title, message, buttons, callback) {
    //Muestra una alerta nativa
    dialog.showMessageBox(parent, { type, title, message, buttons }).then(() => { callback() });
}

function stripBom(content) {
    if (content.charCodeAt(0) === 0xFEFF) return content.slice(1);
    return content;
}

/**
 * * Preparar la App
 */
app.whenReady().then( () => {
    //Se Lanza la App
    appInit();
    //Se crea una instancia de 'Tray' (Icono en la barra de tareas)
    tray = new Tray(`${ASSETS}/favicon.png`);
    //Se crea un nombre para la bandeja
    tray.setToolTip('ADManagement');
    //Se crea un menu para la bandeja
    tray.setContextMenu(MENU_TRY);
});

/**
 * * Comunicación entre procesos
 */
//Obtiene los usuarios de AD Guardados en el store
ipcMain.on('getUsers', (event, args) => { event.sender.send('getUsers', store.get('users', false)) });
//Obtiene las Unidades Organizativas de AD guardadas en el store
ipcMain.on('getOus', (event, args) => { event.sender.send('getOus', store.get('ous', false)) });
//Obtiene las Unidades Organizativas de AD
ipcMain.on('getOusReload', (event, args) => {
    //Ejecuta el script 'Get-ADOrganizationalUnit.ps1'
    execFile('powershell.exe',['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(SCRIPTS, 'Get-ADOrganizationalUnit.ps1')],(error, stdout, stderr) => {
        //Si existe un error...
        if (error || stderr) event.sender.send('getOusReload', '002');
        else event.sender.send('getOusReload', stdout);
    });
});
//Obtiene un usuario de AD
ipcMain.on('Get-ADUser', (event, data) => {
    //Ejecuta el script 'Get-ADUser.ps1'
    execFile('powershell.exe',['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(SCRIPTS, 'Get-ADUser.ps1'), '-email', data],(error, stdout, stderr) => {
        if(error) {
            event.sender.send('Get-ADUser', { response: 'Error', data: error.message });
            return;
        }
        event.sender.send('Get-ADUser', { response: 'Success', data: stdout });
    });
});
//Obtiene los grupos de un usuario de AD
ipcMain.on('Get-ADGroup', (event, data) => {
    //Ejecuta el script 'Get-ADGroup.ps1'
    execFile('powershell.exe',['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(SCRIPTS, 'Get-ADGroup.ps1'), '-distinguishedName', data],(error, stdout, stderr) => {
        if(error) {
            event.sender.send('Get-ADGroup', { response: 'Error', data: error.message });
            return;
        }
        event.sender.send('Get-ADGroup', { response: 'Success', data: stdout });
    });
});
//Crea un Nuevo Usuario en AD
ipcMain.on('New-ADUser', (event, data) => {
    //Se pasa a string la data
    const jsonData = JSON.stringify(data);
    //Se ejecuta el script 'New-ADUser.ps1'
    execFile('powershell.exe',['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path.join(SCRIPTS, 'New-ADUser.ps1'), '-MyObject', jsonData],(error, stdout, stderr) => {
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
ipcMain.on('getChangeLog', (event, args) => { fs.readFile(CHANGELOG, 'utf8', (err, data) => { event.sender.send('getChangeLog', data) }) });

//CERRAR APLICACIÓN
ipcMain.on( 'closeApp', ( event, args ) => app.quit());
//DESCARGAR ACTUALIZACION
ipcMain.on( 'downloadApp', () => autoUpdater.downloadUpdate() );
//INSTALAR ACTUALIZACION
ipcMain.on( 'installApp', () => autoUpdater.quitAndInstall() );
//OBTENER VERSION DE APP
ipcMain.on( 'getVersion', ( event, args ) => { event.sender.send( 'getVersion', app.getVersion() ) });

//Manual ejemplo
ipcMain.on('openManual', (event, args) => {
    shell.openPath(`\\\\esmadvfshared\\sw\\Sccm\\Manuales\\${args}`).then(result => {});
});
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
        store.set('logUpdate', error);
        appWin.webContents.send( 'error_update', store.get('logUpdate') );
    });
};