import { AfterViewInit, Component, OnInit } from '@angular/core';
import { IpcService } from '../../services/ipc.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Component({
  selector: 'app-preload',
  templateUrl: './preload.component.html',
  styleUrl: './preload.component.css'
})
export class PreloadComponent implements OnInit, AfterViewInit {

  private toastQueue: Array<{ icon: SweetAlertIcon; title: string }> = [];
  private isShowing: boolean = false;

  constructor(private ipcService: IpcService) { }

  ngAfterViewInit(): void {
    //Escucha por si hay algun error al obtener las Unidades Organizativas
    this.ipcService.on('getOusError', (event, args) => this.addToastToQueue("error", "No se han obtenido las OU's"));
    //Escucha por si se han obtenido las OU's de forma satisfactoria
    this.ipcService.on('getOusSuccess', (event, args) => this.addToastToQueue('success', "OU's Obtenidas con éxito"));
    //Escucha algun error en el Token de GIT
    this.ipcService.on('tokenGitError', (event, args) => this.addToastToQueue('error', "No se ha establecido el Token Git"));
    //Escucha si el Token GIT se ha establecido con exito
    this.ipcService.on('tokenGitSuccess', (event, args) => this.addToastToQueue('success', "Token Git establecido con éxito"));
  }
  ngOnInit(): void {

  }

  private Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  private showNextToast() {
    if (this.toastQueue.length > 0) {
      const { icon, title } = this.toastQueue.shift()!;
      this.isShowing = true;
      this.Toast.fire({ icon, title }).then(() => {
        this.isShowing = false;
        this.showNextToast();
      });
    }
  }

  public addToastToQueue(icon: SweetAlertIcon, title: string) {
    this.toastQueue.push({ icon, title });
    if (!this.isShowing) {
      this.showNextToast();
    }
  }
}
