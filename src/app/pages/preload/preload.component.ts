import { AfterViewInit, Component, OnInit } from '@angular/core';
import { IpcService } from '../../services/ipc.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-preload',
  templateUrl: './preload.component.html',
  styleUrl: './preload.component.css'
})
export class PreloadComponent implements OnInit, AfterViewInit {

  constructor(private ipcService: IpcService) { }

  ngAfterViewInit(): void {
    this.ipcService.on('getOusError', (event, args) => {
      Swal.fire({
        title: "Algunos datos no se han cargado correctamente",
        confirmButtonText: "Continuar",
        allowOutsideClick: false
      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this.ipcService.send('closePreload');
          this.ipcService.removeAllListeners('closePreload');
        }
      });
    });
  }
  ngOnInit(): void {

  }
}
