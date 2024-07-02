import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IpcService } from '../../services/ipc.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-init',
  templateUrl: './init.component.html',
  styleUrl: './init.component.css'
})
export class InitComponent implements OnInit {

  /**
   * *Propiedades
   */
  @ViewChild('loading') loading: ElementRef;
  public items: string[] = ['Batman-256.png', 'Capitan-America-256.png', 'Daredevil-256.png', 'Green-Lantern-256.png', 'Invisible-Woman-256.png', 'Mister-Fantastic-256.png', 'Namor-256.png', 'Silver-Surfer-256.png', 'Superman-256.png', 'the-Thing-256.png'];
  public avatarSelect: string | null = null;
  public themeSelected: string = 'Sweet Honey';

  constructor(
    private renderer: Renderer2,
    private ipcService: IpcService,
    private router: Router
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
    //Se muestra el Loading
    this.renderer.removeClass(this.loading.nativeElement, 'none');
    //Se crean los datos de configuración
    const data: any = {
      avatar: this.avatarSelect ? this.avatarSelect : 'default.png',
      theme: this.themeSelected
    };
    //Ipc para guardar los datos de configuración
    this.ipcService.send('saveConf', data);
    this.ipcService.removeAllListeners('saveConf');
    this.ipcService.on('saveConf', (event, args) => {
      //Si no se guardan los datos...
      if(args === '002') {
        //Se oculta el Loading
        this.renderer.addClass(this.loading.nativeElement, 'none');
        //Se muestra una alerta
        this.alert('error', 'Hubo un error no controlado al guardar la configuración. Inténtalo de nuevo o contacta con soporte.');
      //Si se guardan los datos redirecciona al Dashboard
      }else this.router.navigate(['/Dashboard']);
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
  private alert(icon: any, text: string): void {
    Swal.fire({
      icon,
      text,
      allowOutsideClick: false
    });
  }
}
