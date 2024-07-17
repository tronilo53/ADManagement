import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { IpcService } from '../../services/ipc.service';
import Swal from 'sweetalert2';
import { StorageService } from '../../services/storage.service';
import { ControllerService } from '../../services/controller.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit {

  /**
   * *Propiedades de la clase
   */
  @ViewChild('loadingProcess') loadingProcess: ElementRef;
  @ViewChild('process') process: ElementRef;
  public version: string | null = null;

  constructor(
    private ipcService: IpcService,
    private renderer: Renderer2,
    public storageService: StorageService,
    private controllerService: ControllerService,
    private cp: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    //Se obtiene la version de la App
    this.getVersionApp();
    //Escucha si está comprobando actualizaciones
    this.ipcService.on('checking_for_update', (event, data) => {
      this.controllerService.createLoading('Buscando Actualizaciones...');
    });
    //Escucha si hay una actualización disponible
    this.ipcService.on('update_available', (event, data) => {
      this.update_available(data);
    });
    //Escucha si no hay ninguna actualización disponible
    this.ipcService.on('update_not_available', (event, data) => {
      if(Swal) this.controllerService.destroyLoading();
      this.controllerService.createMixin('top-end', 'info', 'No hay Actualizaciones');
    });
    //Escucha el progreso de la descarga
    this.ipcService.on('download_progress', (event, progressObj) => {
      this.renderer.setStyle(this.process.nativeElement, 'width', `${progressObj}%`);
      this.renderer.setProperty(this.process.nativeElement, 'innerHTML', `${progressObj}%`);
    });
    //escucha si la actualización se ha descargado
    this.ipcService.on('update_downloaded', (event, data) => {
      this.ipcService.send('installApp');
      this.ipcService.removeAllListeners('installApp');
    });
    //Escucha si hay algun error en la actualización
    this.ipcService.on('error_update', (event, data) => {
      Swal.fire({
        icon: 'error',
        text: 'Ha habido un error en la actualización. Por favor, revisa los log',
        allowOutsideClick: false
      });
    });
  }

  /**
   * *Function: Muestra una alerta de actualización disponible
   */
  private update_available(data: any): void {
    Swal.fire({
      title: "Actualización Disponible!",
      html: `Hay una actualización disponible<br>Versión: <strong>${data.version}</strong><br>¿Quieres descargarla ahora?`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: `${this.storageService.getThemeCss('swal')}`,
      cancelButtonColor: "var(--bs-danger)",
      cancelButtonText: 'Cancelar',
      confirmButtonText: "Si, descargar ahora",
      allowOutsideClick: false
    }).then((result) => {
      //Si se clickea a 'Si, descargar ahora'...
      if (result.isConfirmed) {
        //Se muestra la ventana de descarga
        this.renderer.removeClass(this.loadingProcess.nativeElement, 'none');
        //Se envia ipc para descargar la App
        this.ipcService.send('downloadApp');
        this.ipcService.removeAllListeners('downloadApp');
      }
    });
  }

  public getVersionApp(): void {
    //ipc para obtener la versión actual de la App
    this.ipcService.send('getVersion');
    this.ipcService.removeAllListeners('getVersion');
    this.ipcService.on('getVersion', (event, args) => {
      //Guarda la version en la variable 'version'
      this.version = args.data;
      //Detecta los cambios en la vista
      this.cp.detectChanges();
    });
  }
}
