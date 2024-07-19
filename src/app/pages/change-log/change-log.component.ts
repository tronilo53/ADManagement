import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { IpcService } from '../../services/ipc.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-change-log',
  templateUrl: './change-log.component.html',
  styleUrl: './change-log.component.css'
})
export class ChangeLogComponent {

  public data: any = { version: sessionStorage.getItem('version'), changeLogData: sessionStorage.getItem('changeLogData') };

  constructor(
    private router: Router,
    private ipcService: IpcService,
    public storageService: StorageService
  ) {}

  public redirectoHome(): void {
    //IPC para eliminar la bandera de instalacion de actualizacion
    this.ipcService.send('deleteChangeLog');
    this.ipcService.once('deleteChangeLog', (event, args) => { this.router.navigate(['/Dashboard']) });
  }
}
