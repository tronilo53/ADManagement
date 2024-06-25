import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
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

  constructor(
    private ipcService: IpcService,
    private renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    this.ipcService.send('update-available');
    this.ipcService.removeAllListeners('update-available');
    this.ipcService.on('update-available', (event, data) => {
      this.updateNotify();
    });
  }
  ngOnInit(): void {
    
  }

  private updateNotify(): void {
    Swal.fire({
      title: "Actualización Disponible!",
      text: "Hay una actualización disponible, ¿Quieres instalarla ahora?",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, instalar ahora"
    }).then((result) => {
      if (result.isConfirmed) {
        this.downloadUpdate();
      }
    });
  }
  private downloadUpdate(): void {
    this.ipcService.send('downloadAppTest');
    this.ipcService.removeAllListeners('downloadAppTest');
    this.ipcService.on('downloadAppTest', (event, data) => {
      this.downloadProgress();
    });
  }
  private downloadProgress(): void {
    this.renderer.removeClass(this.loadingProcess.nativeElement, 'none');
    this.ipcService.send('download-progress');
    this.ipcService.removeAllListeners('download-progress');
    this.ipcService.on('download-progress', (event, progressObj) => {
      this.renderer.setStyle(this.process.nativeElement, 'width', `${progressObj.percent}%`);
      this.renderer.setProperty(this.process.nativeElement, 'innerHTML', `${progressObj.percent}%`);
    });
  }
}
