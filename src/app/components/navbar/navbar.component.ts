import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { StorageService } from '../../services/storage.service';

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
  @ViewChild('content') content: ElementRef;

  public currentUrl: string;

  constructor(
    private router: Router,
    public storageService: StorageService,
    private cp: ChangeDetectorRef,
    private renderer: Renderer2
  ) {
    //Se intercepta la ruta que está en curso y se guarda en la variable 'currentUrl'
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.urlAfterRedirects;
    });
  }

  ngOnInit(): void {
    /**
     * !Subscripción obligatoria para detectar los cambios del BehaviorSubject
     */
    this.storageService.getConfigObservable().subscribe(config => {
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

  /**
   * *Function: Procesa los datos para buscar
   * @param content Contenido a buscar
   */
  public search(content: string) {
    if(content !== '') {
      this.router.navigate(['/Dashboard/Search', content]);
      this.renderer.setProperty(this.content.nativeElement, 'value', '');
    }
  }
}
