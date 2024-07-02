import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IpcService } from '../../../services/ipc.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, AfterViewInit {

  @ViewChild('loading') loading: ElementRef;

  constructor(
    private ipcService: IpcService,
    private renderer: Renderer2,
    private router: Router,
  ) {}

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    //Ipc para comprobar si hay datos de configuración guardados
    this.ipcService.send('checkConfig');
    this.ipcService.removeAllListeners('checkConfig');
    this.ipcService.on('checkConfig', (event, args) => {
      //Si existen datos de configuración se oculta el loading
      if(args === '001') this.renderer.addClass(this.loading.nativeElement, 'none');
      //Si no existen datos de configuración redirige al Init
      else this.router.navigate(['/Init']);
    });
  }
}
