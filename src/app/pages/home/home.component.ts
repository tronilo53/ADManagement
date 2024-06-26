import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IpcService } from '../../services/ipc.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('loadingProcess') loadingProcess: ElementRef;
  @ViewChild('process') process: ElementRef;
  public version: string = '';

  constructor(
    private ipcService: IpcService,
    private renderer: Renderer2,
    private cd: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.setVersion();
    this.ipcService.on('update_available', (event, data) => {
      this.update_available();
    });
    this.ipcService.on('download_progress', (event, progressObj) => {
      this.renderer.removeClass(this.loadingProcess.nativeElement, 'none');
      this.renderer.setStyle(this.process.nativeElement, 'width', `${progressObj}%`);
      this.renderer.setProperty(this.process.nativeElement, 'innerHTML', `${progressObj}%`);
    });
    this.ipcService.on('update_downloaded', (event, data) => {
      this.ipcService.send('installApp');
      this.ipcService.removeAllListeners('installApp');
    });
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

  private update_available(): void {
    Swal.fire({
      title: "Actualización Disponible!",
      text: "Hay una actualización disponible, ¿Quieres descargarla ahora?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, descargar ahora"
    }).then((result) => {
      if (result.isConfirmed) {
        this.ipcService.send('downloadApp');
        this.ipcService.removeAllListeners('downloadApp');
      }
    });
  }
  private setVersion(): void {
    this.ipcService.send('setVersion');
    this.ipcService.removeAllListeners('setVersion');
    this.ipcService.on('setVersion', (event, args) => {
      this.version = args.data;
      this.cd.detectChanges();
    });
  }
}
