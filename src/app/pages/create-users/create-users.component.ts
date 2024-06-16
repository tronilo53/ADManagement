import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { IpcService } from '../../services/ipc.service';

@Component({
  selector: 'app-create-users',
  templateUrl: './create-users.component.html',
  styleUrl: './create-users.component.css'
})
export class CreateUsersComponent {

  @ViewChild('loading') loading: ElementRef;

  constructor(
    private renderer: Renderer2,
    private ipcService: IpcService
  ) {}

  ngOnInit(): void {
    
  }

  public anadirMas(): void {
    
  }
  public crearUsuario(): void {

  }

}
