import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { IpcService } from '../../services/ipc.service';
import { ControllerService } from '../../services/controller.service';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrl: './init.component.css'
})
export class InitComponent implements OnInit {

  /**
   * *Propiedades
   */
  public items: string[] = ['Batman-256.png', 'Capitan-America-256.png', 'Daredevil-256.png', 'Green-Lantern-256.png', 'Invisible-Woman-256.png', 'Mister-Fantastic-256.png', 'Namor-256.png', 'Silver-Surfer-256.png', 'Superman-256.png', 'the-Thing-256.png'];
  public avatarSelect: string | null = null;
  public themeSelected: string = 'Sweet Honey';

  constructor(
    private router: Router,
    private storageService: StorageService,
    private ipcService: IpcService,
    private controllerService: ControllerService
  ) {}

  ngOnInit(): void {
    
  }

  /**
   * *Function: Selección de avatar
   * @param item Avatar elegido
   */
  public selectAvatar(item: string): void {
    //Si hay un avatar elegido...
    if(this.avatarSelect) {
      //Si el avatar elegido es igual al clickeado, el avatar elegido se resetea
      if(this.avatarSelect === item) this.avatarSelect = null;
      //Si el avatar elegido es distinto al clickeado, el avatar elegido será igual al clickeado.
      else this.avatarSelect = item;
    //Si no hay un avatar elegido, el avatar elegido será igual al clickeado.
    }else this.avatarSelect = item;
  }

  /**
   * *Function: Finalizar Init
   */
  public finished(): void {
    //Se muestra el loading
    this.controllerService.createLoading();
    //Se crean los datos de configuración
    const data: any = {
      avatar: this.avatarSelect ? this.avatarSelect : 'default.png',
      theme: this.themeSelected
    };
    //IPC para guardar los datos de configuracion
    this.ipcService.send('setConfig', data);
    this.ipcService.removeAllListeners('setConfig');
    this.ipcService.on('setConfig', (event, args) => {
      //Si se guardan los datos correctamente...
      if(args === '001') {  
        //Se guarda la configuración en el sessionStorage y se modifica el BehaviorSubject
        this.storageService.setConfig(data);
        //Se oculta el loading
        this.controllerService.destroyLoading();
        //Redirige al Dashboard
        this.router.navigate(['/Dashboard']);
      //Si los datos no se guardan correctamente...
      }else {
        //Se oculta el loading
        this.controllerService.destroyLoading();
        //Se crea configuración por defecto solo para el sessionStorage
        this.storageService.setConfig({ avatar: 'default.png', theme: 'Sweet Honey' });
        //Se muestra una alerta con duración y redirección
        this.controllerService.defaultDataError();
      }
    });
  }

  /**
   * *Function: Elección del tema del nav
   * @returns Devuelve el tema del nav (String)
   */
  public getTypeNav(): string {
    if(this.themeSelected === 'Healthy Sky') return 'bg-primary';
    else if(this.themeSelected === 'Tasty Licorice') return 'bg-danger';
    else if(this.themeSelected === 'Gray Storm') return 'bg-secondary';
    else return 'bg-warning';
  }
}
