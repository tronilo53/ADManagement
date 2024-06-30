import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar-theme',
  templateUrl: './navbar-theme.component.html',
  styleUrl: './navbar-theme.component.css'
})
export class NavbarThemeComponent implements OnInit {

  @Input() typeNav: string = 'bg-warning';

  constructor() {}

  ngOnInit(): void {
    
  }
}
