/**
 * * Importaciones de Módulos
 */
import { app, BrowserWindow, ipcMain, Menu } from "electron";
import isDev from "electron-is-dev";
import pkg from "electron-updater";
import { execFile } from "child_process";
import Store from "electron-store";
import path from 'path';

const { autoUpdater } = pkg;
const store = new Store();
const __dirname = path.resolve();

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
    if(isDev) {
        appPrelaod.setIcon( './src/assets/favicon.png' );
        appPrelaod.loadURL( 'http://localhost:4200/#/Preload' );
        //appPrelaod.webContents.openDevTools({mode: 'detach'});
    //Si estamos en modo de producción...
    }else {
        appPrelaod.setIcon( 'resources/app/src/assets/favicon.png' );
        appPrelaod.loadURL( `file://${ __dirname }/resources/app/dist/browser/index.html#/Preload` );
        //appPrelaod.webContents.openDevTools({mode: 'detach'});
    }
    //Cuando la ventana está lista para ser mostrada...
    appPrelaod.once( "ready-to-show", () => {
        //Variables con las rutas del script de Powershell
        const pathOu = isDev ? 'src/assets/scripts/Get-ADOrganizationalUnit.ps1' : 'resources/app/src/assets/scripts/Get-ADOrganizationalUnit.ps1';
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
    if(isDev) {
        appWin.setIcon( './src/assets/favicon.png' );
        const menuDev = Menu.buildFromTemplate( menuTemplateDev );
        appWin.setMenu( menuDev );
        appWin.loadURL( 'http://localhost:4200/' );
        //appWin.webContents.openDevTools({mode: 'detach'});
    //Si se está en modo de producción...
    }else {
        appWin.setIcon( 'resources/app/src/assets/favicon.png' );
        appWin.setMenu(null);
        appWin.loadURL( `file://${ __dirname }/resources/app/dist/browser/index.html` );
    }
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
app.whenReady().then( () => createPreload());

/**
 * * Acciones para cerrar la App en MacOs
 */
app.on( "window-all-closed", () => {
    if( process.platform !== 'darwin' ) app.quit();
});

/**
 * * Comunicación entre procesos
 */
//Obtiene las Unidades Organizativas
ipcMain.on('getOus', (event, args) => {
    event.sender.send('getOus', store.get('ous'));
});
//Obtiene un usuario de AD
ipcMain.on('Get-ADUser', (event, data) => {
    const path = isDev ? 'src/assets/scripts/Get-ADUser.ps1' : 'resources/app/src/assets/scripts/Get-ADUser.ps1';
    execFile('powershell.exe',['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path, '-email', data],(error, stdout, stderr) => {
        if(error) {
            event.sender.send('Get-ADUser', { response: 'Error', data: error.message });
            return;
        }
        event.sender.send('Get-ADUser', { response: 'Success', data: stdout });
    });
});
//Obtiene los grupos de un usuario
ipcMain.on('Get-ADGroup', (event, data) => {
    const path = isDev ? 'src/assets/scripts/Get-ADGroup.ps1': 'resources/app/src/assets/scripts/Get-ADGroup.ps1';
    execFile('powershell.exe',['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', path, '-distinguishedName', data],(error, stdout, stderr) => {
        if(error) {
            event.sender.send('Get-ADGroup', { response: 'Error', data: error.message });
            return;
        }
        event.sender.send('Get-ADGroup', { response: 'Success', data: stdout });
    });
});
ipcMain.on('New-ADUser', (event, data) => {
    const path = isDev ? 'src/assets/scripts/New-ADUser.ps1' : 'resources/app/src/assets/scripts/New-ADUser.ps1';
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
//CERRAR APLICACIÓN
ipcMain.on( 'closeApp', ( event, args ) => app.quit());
//DESCARGAR ACTUALIZACION
ipcMain.on( 'downloadApp', () => autoUpdater.downloadUpdate() );
//INSTALAR ACTUALIZACION
ipcMain.on( 'installApp', () => autoUpdater.quitAndInstall() );
//OBTENER VERSION DE APP
ipcMain.on( 'setVersion', ( event, args ) => {
    event.sender.send( 'setVersion', { data: app.getVersion() } );
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