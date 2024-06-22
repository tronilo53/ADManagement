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
    //Escucha por si hay algun error al obtener las Unidades Organizativas
    this.ipcService.on('getOusError', (event, args) => {
      //Muestra una alerta
      Swal.fire({
        title: "Datos no cargados",
        text: 'Algunos datos de Active Directory no se han cargado correctamente',
        confirmButtonText: "Continuar",
        allowOutsideClick: false
      }).then((result) => {
        //Si le damos a continuar...
        if (result.isConfirmed) {
          //ipc para que cierre la ventana de Preload y continue con la Aplicación
          this.ipcService.send('closePreload');
          this.ipcService.removeAllListeners('closePreload');
        }
      });
    });
  }
  ngOnInit(): void {

  }
}
