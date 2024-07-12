import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { NavbarThemeComponent } from './navbar-theme/navbar-theme.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';



@NgModule({
  declarations: [
    NavbarComponent,
    NavbarThemeComponent,
    MaintenanceComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    NavbarComponent,
    NavbarThemeComponent,
    MaintenanceComponent
  ]
})
export class ComponentsModule { }
