import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TreeModule } from 'primeng/tree';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PreloadComponent } from './pages/preload/preload.component';
import { HomeComponent } from './pages/home/home.component';
import { ManagementUsersComponent } from './pages/management-users/management-users.component';
import { CreateUsersComponent } from './pages/create-users/create-users.component';

@NgModule({
  declarations: [
    AppComponent,
    PreloadComponent,
    HomeComponent,
    ManagementUsersComponent,
    CreateUsersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    TreeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
