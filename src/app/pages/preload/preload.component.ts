import { Component, OnInit } from '@angular/core';
import { IpcService } from '../../services/ipc.service';
import { ControllerService } from '../../services/controller.service';

@Component({
  selector: 'app-preload',
  templateUrl: './preload.component.html',
  styleUrl: './preload.component.css'
})
export class PreloadComponent implements OnInit {

  constructor(
    private ipcService: IpcService,
    private controllerService: ControllerService
  ) { }

  ngOnInit(): void {
    //Escucha por si hay algun error al obtener las Unidades Organizativas
    this.ipcService.on('getOusError', (event, args) => this.controllerService.createMixin('top-end', 'error', 'Ha habido un error al contactar con el dominio.'));
  }
}
