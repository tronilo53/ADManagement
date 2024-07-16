import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { ControllerService } from '../../services/controller.service';
import { IpcService } from '../../services/ipc.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  /**
   * *Propiedades
   */
  public avatarSelect: string | null = null;
  public selectedTheme: string | null = null;

  constructor(
    public storageService: StorageService,
    private controllerService: ControllerService,
    private ipcService: IpcService,
    private cp: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    //Se guarda el tema actual en la variable 'selectedTheme' para el ngModel
    this.selectedTheme = this.storageService.getConfig().theme;
  }

  /**
   * *Function: Selección de avatar en el DOM
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

  public getType(theme: string): string {
    let themeClass: string = '';
    switch(theme) {
      case 'Sweet Honey': themeClass = 'bg-warning'; break;
      case 'Healthy Sky': themeClass = 'bg-primary'; break;
      case 'Tasty Licorice': themeClass = 'bg-danger'; break;
      case 'Gray Storm': themeClass = 'bg-secondary'; break;
    }
    return themeClass;
  }

  /**
   * *Function: Establece el avatar en el storageService
   */
  public setAvatar(): void {
    //Si no hay ningun avatar seleccionado...
    if(!this.avatarSelect) this.controllerService.createAlert('info', 'No se ha seleccionado ningún avatar');
    //Si se selecciona algun avatar...
    else {
      //Si el avatar que se selecciona es igual al avatar ya establecido se muestra una alerta
      if(this.avatarSelect === this.storageService.getConfig().avatar) this.controllerService.createAlert('info', 'Este avatar ya está establecido');
      //Si se selecciona un avatar diferente...
      else {
        //Se muestra el loading
        this.controllerService.createLoading();
        //Se crea un nuevo Objeto con el nuevo avatar
        const data: any = {...this.storageService.getConfig(), avatar: this.avatarSelect};
        //IPC para guardar los datos de configuracion en el .xml
        this.ipcService.send('setConfig', data);
        this.ipcService.removeAllListeners('setConfig');
        this.ipcService.on('setConfig', (event, args) => {
          //Si se guardan los datos correctamente...
          if(args === '001') {
            //Se modifica la configuración en el sessionStorage y en el Behavior
            this.storageService.setConfig(data);
            //Se restablece el avatar
            this.avatarSelect = null;
            //Se oculta el loading
            this.controllerService.destroyLoading();
            //Se muestra una notificación
            this.controllerService.createToast('top-end', 'success', 'Avatar Actualizado!');
            //Se detectan los cambios en la vista
            this.cp.detectChanges();
          //Si los datos no se guardan correctamente...
          }else {
            //Se oculta el loading
            this.controllerService.destroyLoading();
            //Se muestra una alerta
            this.controllerService.createAlert('error', 'No se han guardardado los datos de Configuración');
          }
        });
      }
    }
  }

  /**
   * *Function: Establece el Tema en el storageService
   */
  public setTheme(): void {
    //Se muestra el loading
    this.controllerService.createLoading();
    //Si el tema seleccionado es igual al tema actual, se muestra una alerta
    if(this.selectedTheme === this.storageService.getConfig().theme) this.controllerService.createAlert('info', 'Este tema ya está aplicado');
    //Si el tema seleccionado es distinto...
    else {
      //Se crea un nuevo Objeto
      const data: any = {...this.storageService.getConfig(), theme: this.selectedTheme};
      //IPC para guardar los datos de configuracion en el .xml
      this.ipcService.send('setConfig', data);
      this.ipcService.removeAllListeners('setConfig');
      this.ipcService.on('setConfig', (event, args) => {
        //Si se guardan los datos correctamente...
        if(args === '001') {
          //Se guarda la configuracion en el sessionStorage y en el Behavior
          this.storageService.setConfig(data);
          //Se restablece el tema con el aplicado
          this.selectedTheme = this.storageService.getConfig().theme;
          //Se oculta el loading
          this.controllerService.destroyLoading();
          //Se muestra una notificación
          this.controllerService.createToast('top-end', 'success', 'Tema Actualizado!');
          //Se detectan los cambios en la vista
          this.cp.detectChanges();
        //Si los datos no se guardan correctamente...
        }else {
          //Se oculta el loading
          this.controllerService.destroyLoading();
          //Se muestra una alerta
          this.controllerService.createAlert('error', 'No se han guardardado los datos de Configuración');
        }
      });
    }
  }
}
