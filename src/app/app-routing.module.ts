import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreloadComponent } from './pages/preload/preload.component';
import { HomeComponent } from './pages/home/home.component';
import { ManagementUsersComponent } from './pages/management-users/management-users.component';
import { CreateUsersComponent } from './pages/create-users/create-users.component';
import { DashboardComponent } from './pages/shared/dashboard/dashboard.component';
import { InitComponent } from './pages/init/init.component';

const routes: Routes = [
  {path: 'Preload', component: PreloadComponent},
  {path: 'Init', component: InitComponent},
  {
    path: 'Dashboard', 
    component: DashboardComponent,
    children: [
      {path: 'Home', component: HomeComponent},
      {path: 'CreateUsers', component: CreateUsersComponent },
      {path: 'ManagementUsers', component: ManagementUsersComponent },
      {path: '**', pathMatch: 'full', redirectTo: 'Home' }
    ]
  },
  {path: '**', pathMatch: 'full', redirectTo: 'Dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
