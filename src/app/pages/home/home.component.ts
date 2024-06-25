import { AfterViewInit, Component, OnInit } from '@angular/core';
import { IpcService } from '../../services/ipc.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(private ipcService: IpcService) {}

  ngAfterViewInit(): void {
    this.ipcService.on('update_available', (event, data) => {
      this.alert('info', 'Hay una Actualización disponible');
    });
  }
  ngOnInit(): void {
    
  }

  private alert(icon: any, text: string): void {
    Swal.fire({
      icon,
      text,
      allowOutsideClick: false
    });
  }
}
