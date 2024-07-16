/**
 * * Importaciones de Módulos
 */
import { app, BrowserWindow, ipcMain, Menu, Tray } from "electron";
import isDev from "electron-is-dev";
import pkg from "electron-updater";
import { execFile } from "child_process";
import Store from "electron-store";
import path from 'path';
import fs from 'fs';
import xml2js from 'xml2js';

const { autoUpdater } = pkg;
const store = new Store();
const __dirname = path.resolve();

const PATH_ASSETS_PROD = path.join(__dirname, 'resources', 'app', 'src', 'assets');
const PATH_ASSETS_DEV = path.join(__dirname, 'src', 'assets');
const PATH_DIST_PROD = path.join(__dirname, 'resources', 'app', 'dist');

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
let tray = null;

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
const menuDev = Menu.buildFromTemplate( menuTemplateDev );

/**
 * * Función de ventana Preload
 */
function createPreload() {
    //Instancia de una nueva ventana
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
            transparent: false,
            alwaysOnTop: true
        }
    );
    //Si estamos en modo de desarrollo...
    appPrelaod.setIcon(isDev ? `${PATH_ASSETS_DEV}/favicon.png` : `${PATH_ASSETS_PROD}/favicon.png`);
    appPrelaod.loadURL(isDev ? 'http://localhost:4200/#/Preload' : `file://${PATH_DIST_PROD}/browser/index.html#/Preload`);
    
    //Cuando la ventana está lista para ser mostrada...
    appPrelaod.once( "ready-to-show", () => {
        //Variables con las rutas del script de Powershell
        const pathOu = isDev ? `${PATH_ASSETS_DEV}/scripts/Get-ADOrganizationalUnit.ps1` : `${PATH_ASSETS_PROD}/scripts/Get-ADOrganizationalUnit.ps1`;
        execFile('powershell.exe',['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', pathOu],(error, stdout, stderr) => {
            //Si existe un error...
            if (error) {
                //Si existe un JSON llamado 'ous' lo elimina
                if(store.get('ous')) store.delete('ous');
                //Manda por el canal 'getOusError' el error
                appPrelaod.webContents.send('getOusError');
                //Sale de la ejecución
                return;
            }
            //Si el resultado es satisfactorio y existe un JSON llamado 'ous'...
            if(store.get('ous')){
                //Elimina el JSON
                store.delete('ous');
                //Establece un nuevo JSON llamado 'ous' guardando las Unidades Organizativas
                store.set('ous', stdout);
            //Si no existe un JSON llamado 'ous' lo crea guardando las Unidades Organizativas
            }else store.set('ous', stdout);
            appPrelaod.webContents.send('getOusSuccess');
            setTimeout(() => {
                //Cierra la ventana de Preload
                appPrelaod.close();
                //Crea la ventana principal
                createHome();
            }, 3000);
        });
    });
    //Cuando se llama a .close() la ventana Preload se cierra
    appPrelaod.on( "closed", () => appPrelaod = null );
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
    appWin.setIcon(isDev ? `${PATH_ASSETS_DEV}/favicon.png` : `${PATH_ASSETS_PROD}/favicon.png`);
    appWin.setMenu(isDev ? menuDev : null);
    appWin.loadURL(isDev ? 'http://localhost:4200/' : `${PATH_DIST_PROD}/browser/index.html`);
    if(isDev) appWin.webContents.openDevTools({ mode: 'detach' });
    
    //Cuando la ventana está lista para ser mostrada...
    appWin.once( "ready-to-show", () => {
        //Pone a la escucha la comprobación de actualizaciones
        autoUpdater.checkForUpdatesAndNotify();
    });
    //Cuando se llama a .close() la ventana principal se cierra
    appWin.on( "closed", () => appWin = null );
};

/**
 * * Preparar la App
 */
app.whenReady().then( () => {
    //Se Lanza primero la ventana de Preload y continua..
    createPreload();
    //Se crea una instancia de 'Tray' (Icono en la barra de tareas)
    tray = new Tray(`${isDev ? PATH_ASSETS_DEV : PATH_ASSETS_PROD}/favicon.png`);
    //Se crea un nombre para la bandeja
    tray.setToolTip('ADManagement');
    //Se crea un menu para la bandeja
    tray.setContextMenu(Menu.buildFromTemplate([ {label: 'Salir', click: () => app.quit()} ]));
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
//Obtiene las Unidades Organizativas de AD
ipcMain.on('getOus', (event, args) => {
    event.sender.send('getOus', store.get('ous'));
});
//Obtiene un usuario de AD
ipcMain.on('Get-ADUser', (event, data) => {
    const path = isDev ? `${PATH_ASSETS_DEV}/scripts/Get-ADUser.ps1` : `${PATH_ASSETS_PROD}/scripts/Get-ADUser.ps1`;
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
    const path = isDev ? `${PATH_ASSETS_DEV}/scripts/Get-ADGroup.ps1` : `${PATH_ASSETS_PROD}/scripts/Get-ADGroup.ps1`;
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
    const path = isDev ? `${PATH_ASSETS_DEV}/scripts/New-ADUser.ps1` : `${PATH_ASSETS_PROD}/scripts/New-ADUser.ps1`;
    const jsonData = JSON.stringify(data);
    console.log(jsonData);
    execFile('powershell.exe',['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path, '-MyObject', jsonData],(error, stdout, stderr) => {
        if(error) {
            event.sender.send('New-ADUser', { response: 'Error', data: error.message });
            return;
        }
        event.sender.send('New-ADUser', { response: 'Success', data: stdout });
    });
});
//Guarda los datos de configuración de la App
ipcMain.on('setConfig', (event, args) => {
    const path = isDev ? PATH_ASSETS_DEV : PATH_ASSETS_PROD;
    fs.readFile(`${path}/config.xml`, 'utf-8', (error, data) => {
        xml2js.parseString(data, (error, result) => {
            result.config.avatar[0].$.rel = args.avatar;
            result.config.theme[0].$.rel = args.theme;

            const builder = new xml2js.Builder();
            const xml = builder.buildObject(result);

            fs.writeFile(`${path}/config.xml`, xml, (err) => {
                if(err) event.sender.send('setConfig', '002');
                else event.sender.send('setConfig', '001');
            });
        });
    });
});
//Devuelve la configuración del .xml
ipcMain.on('getConfig', (event, args) => {
    const path = isDev ? PATH_ASSETS_DEV : PATH_ASSETS_PROD;
    fs.readFile(`${path}/config.xml`, 'utf-8', (error, data) => {
        xml2js.parseString(data, (error, json) => {
            const dataSend = { avatar: json.config.avatar[0].$.rel, theme: json.config.theme[0].$.rel };
            event.sender.send('getConfig', { dataSend });
        });
    });
});

//CERRAR APLICACIÓN
ipcMain.on( 'closeApp', ( event, args ) => app.quit());
//DESCARGAR ACTUALIZACION
ipcMain.on( 'downloadApp', () => autoUpdater.downloadUpdate() );
//INSTALAR ACTUALIZACION
ipcMain.on( 'installApp', () => autoUpdater.quitAndInstall() );
//OBTENER VERSION DE APP
ipcMain.on( 'getVersion', ( event, args ) => {
    event.sender.send( 'getVersion', { data: app.getVersion() } );
});

/**
 * * Eventos de Actualizaciones Automáticas
 */
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