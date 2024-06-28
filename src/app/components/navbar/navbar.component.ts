import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  public currentUrl: string;
  public pathAvatar: string = 'assets/avatars/default.png';

  constructor(private router: Router) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.urlAfterRedirects;
    });
  }

  ngOnInit(): void {
    
  }

  public isDropdownActive(): boolean {
    return this.currentUrl === '/Dashboard/CreateUsers' ||
           this.currentUrl === '/Dashboard/CreateOUs' ||
           this.currentUrl === '/Dashboard/CreateGroups' ||
           this.currentUrl === '/Dashboard/ManageUsers' ||
           this.currentUrl === '/Dashboard/ManageDevices';
  }
}
