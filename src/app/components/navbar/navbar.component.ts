import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  /**
   * *Propiedades
   */
  @ViewChild('navbarTheme') navbarTheme: ElementRef;

  public currentUrl: string;

  constructor(
    private router: Router,
    public storageService: StorageService
  ) {
    //Se intercepta la ruta que está en curso y se guarda en la variable 'currentUrl'
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.urlAfterRedirects;
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
