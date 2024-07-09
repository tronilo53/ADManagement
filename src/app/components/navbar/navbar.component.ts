import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, AfterViewInit {

  /**
   * *Propiedades
   */
  @ViewChild('navbarTheme') navbarTheme: ElementRef;

  public currentUrl: string;
  public config: any = {avatar: '', theme: ''};

  constructor(
    private router: Router,
    private renderer: Renderer2,
    private cp: ChangeDetectorRef
  ) {
    //Se intercepta la ruta que está en curso y se guarda en la variable 'currentUrl'
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.urlAfterRedirects;
    });
  }

  ngAfterViewInit(): void {
    //Se guarda la configuracion del localStorage en la variable 'config'
    this.config = {...this.config, avatar: JSON.parse(localStorage.getItem('config')).avatar, theme: JSON.parse(localStorage.getItem('config')).theme};
    //Se aplica el tema al navbar
    this.renderer.addClass(this.navbarTheme.nativeElement, this.getTheme());
    //Se detectan los cambios
    this.cp.detectChanges();
  }
  ngOnInit(): void {
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
