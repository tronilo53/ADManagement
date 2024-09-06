import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { NavbarThemeComponent } from './navbar-theme/navbar-theme.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { FormsModule } from '@angular/forms';
import { UserCardComponent } from './user-card/user-card.component';



@NgModule({
  declarations: [
    NavbarComponent,
    NavbarThemeComponent,
    MaintenanceComponent,
    UserCardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  exports: [
    NavbarComponent,
    NavbarThemeComponent,
    MaintenanceComponent,
    UserCardComponent
  ]
})
export class ComponentsModule { }
