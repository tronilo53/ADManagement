import { ChangeDetectorRef, Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { IpcService } from '../services/ipc.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class InitGuard implements CanActivateChild {

  constructor(
    private ipcService: IpcService,
    private cd: ChangeDetectorRef
  ) {}

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | any {
    //Ipc para comprobar si hay datos de configuración guardados
    this.ipcService.send('checkConfig');
    this.ipcService.removeAllListeners('checkConfig');
    this.ipcService.on('checkConfig', (event, args) => {
      //Si existen datos de configuración...
      if(args === '001') {
        console.log('Existen datos');
        return false;
      //Si no existen datos de configuración...
      }else {
        console.log('No existen datos');
        return false;
      }
      this.cd.detectChanges();
    });
  }
}