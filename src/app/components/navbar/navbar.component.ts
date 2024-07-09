import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { IpcService } from '../../services/ipc.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  /**
   * *Propiedades
   */
  @ViewChild('navbarTheme') navbarTheme: ElementRef;

  public currentUrl: string;
  public config: any = {avatar: '', theme: ''};
  public isLoading: boolean = true;

  constructor(
    private router: Router,
    private ipcService: IpcService,
    private renderer: Renderer2,
    private cp: ChangeDetectorRef
  ) {
    //Se intercepta la ruta que está en curso y se guarda en la variable 'currentUrl'
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.urlAfterRedirects;
    });
  }

  ngOnInit(): void {
    //Peticion para obtener los datos de configuración del archivo .xml
    this.ipcService.send('getConfig');
    this.ipcService.removeAllListeners('getConfig');
    this.ipcService.on('getConfig', (event, args) => {
      //Se quita la carga
      this.isLoading = false;
      //Se guarda la configuracion como objeto en la variable 'config'
      this.config = {...this.config, avatar: args.data.avatar, theme: args.data.theme};
      //Se modifica el tema del navbar
      this.renderer.addClass(this.navbarTheme.nativeElement, this.getTheme());
      //Se detectan cambios
      this.cp.detectChanges();
    });
  }

  /**
   * *Function: Comprueba la ruta actual
   * @returns Devuelve la ruta
   */
  public isDropdownActive(): boolean {
    return this.currentUrl === '/Dashboard/CreateUsers' ||
           this.currentUrl === '/Dashboard/CreateOUs' ||
           this.currentUrl === '/Dashboard/CreateGroups' ||
           this.currentUrl === '/Dashboard/ManageUsers' ||
           this.currentUrl === '/Dashboard/ManageDevices';
  }

  public getTheme(): string {
    let addClass: string = '';
    switch(this.config.theme) {
      case 'Sweet Honey': addClass = 'bg-warning'; break;
      case 'Healthy Sky': addClass = 'bg-primary'; break;
      case 'Tasty Licorice': addClass = 'bg-danger'; break;
      case 'Gray Storm': addClass = 'bg-secondary'; break;
    }
    return addClass;
  }
}
