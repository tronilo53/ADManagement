import { Component, OnInit } from '@angular/core';
import { StorageService } from '../../services/storage.service';
import { ControllerService } from '../../services/controller.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  public avatarSelect: string | null = null;
  public themeSelected: string = 'Sweet Honey';

  constructor(
    public storageService: StorageService,
    private controllerService: ControllerService
  ) { }

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

  public setAvatar(): void {
    //Si no hay ningun avatar seleccionado...
    if(!this.avatarSelect) this.controllerService.createAlert('info', 'No se ha seleccionado ningún avatar');
    //Si se selecciona algun avatar...
    else {
      //Si el avatar que se selecciona es igual al avatar ya establecido se muestra una alerta
      if(this.avatarSelect === this.storageService.getConfig().avatar) this.controllerService.createAlert('info', 'Este avatar ya está establecido');
      //Si se selecciona un avatar diferente...
      else {
        //Se establece el nuevo avatar
        this.storageService.setAvatar(this.avatarSelect);
        //Se restablece el avatar
        this.avatarSelect = null;
        //Se muestra una notificación
        this.controllerService.createToast('top-end', 'success', 'Avatar establecido!');
      }
    }
  }
}
