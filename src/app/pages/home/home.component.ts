import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IpcService } from '../../services/ipc.service';
import Swal from 'sweetalert2';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit {

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
    private cp: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    //Se obtiene la version de la App
    this.getVersionApp();
    //Escucha si hay una actualización disponible
    this.ipcService.on('update_available', (event, data) => {
      this.update_available();
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
        text: 'Ha habido un error al descargar la actualización',
        allowOutsideClick: false
      });
    });
  }
  ngOnInit(): void {
    
  }

  /**
   * *Function: Muestra una alerta de actualización disponible
   */
  private update_available(): void {
    Swal.fire({
      title: "Actualización Disponible!",
      text: "Hay una actualización disponible, ¿Quieres descargarla ahora?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      cancelButtonText: 'Cancelar',
      confirmButtonText: "Si, descargar ahora"
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
