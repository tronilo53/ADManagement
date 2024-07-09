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
    //Si no existe configuración guardada en el LocalStotage se redirige al Init
    if(!localStorage.getItem('config')) this.router.navigate(['/Init']);
    //Si existe configuración guardada se oculta el loading
    this.renderer.addClass(this.loading.nativeElement, 'none');
  }
}
