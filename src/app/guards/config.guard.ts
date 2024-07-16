import { Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { IpcService } from '../services/ipc.service';
import { ControllerService } from '../services/controller.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigGuard implements CanActivateChild {

  constructor(
    private storageService: StorageService,
    private ipcService: IpcService,
    private controllerService: ControllerService,
    private router: Router
  ) { }

  canActivateChild(): Promise<boolean> {
    return new Promise((resolve) => {
      this.controllerService.createLoading();
      //IPC para comprobar si hay configuración guardada en el .xml
      this.ipcService.send('getConfig');
      this.ipcService.once('getConfig', (event, args) => {
        //Si existe configuración guardada...
        if(args.dataSend.avatar !== '') {
          //Se guarda la configuración en el sessionStorage y se modifica el Behavior
          this.storageService.setConfig(args.dataSend);
          //Se oculta el loading
          this.controllerService.destroyLoading();
          //Permite el acceso
          resolve(true);
        //Si no existe configuración guardada...
        }else {
          //Se oculta el loading
          this.controllerService.destroyLoading();
          //Redirige al Init
          this.router.navigate(['/Init']);
          //Deniega el acceso
          resolve(false);
        }
      });
    });
  }
  
}
