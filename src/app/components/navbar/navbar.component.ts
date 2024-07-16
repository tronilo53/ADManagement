import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

  public currentUrl: string;

  constructor(
    private router: Router,
    public storageService: StorageService,
    private cp: ChangeDetectorRef
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
}
