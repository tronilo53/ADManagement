import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { TreeModule } from 'primeng/tree';
import { StepperModule } from 'primeng/stepper';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PreloadComponent } from './pages/preload/preload.component';
import { HomeComponent } from './pages/home/home.component';
import { ManagementUsersComponent } from './pages/management-users/management-users.component';
import { CreateUsersComponent } from './pages/create-users/create-users.component';
import { DashboardComponent } from './pages/shared/dashboard/dashboard.component';
import { ComponentsModule } from './components/components.module';
import { InitComponent } from './pages/init/init.component';

@NgModule({
  declarations: [
    AppComponent,
    PreloadComponent,
    HomeComponent,
    ManagementUsersComponent,
    CreateUsersComponent,
    DashboardComponent,
    InitComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    TreeModule,
    StepperModule,
    ButtonModule,
    CardModule,
    ComponentsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
