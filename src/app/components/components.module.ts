import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { NavbarThemeComponent } from './navbar-theme/navbar-theme.component';



@NgModule({
  declarations: [
    NavbarComponent,
    NavbarThemeComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    NavbarThemeComponent
  ]
})
export class ComponentsModule { }
