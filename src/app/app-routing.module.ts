import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreloadComponent } from './pages/preload/preload.component';
import { HomeComponent } from './pages/home/home.component';
import { ManagementUsersComponent } from './pages/management-users/management-users.component';
import { CreateUsersComponent } from './pages/create-users/create-users.component';
import { DashboardComponent } from './pages/shared/dashboard/dashboard.component';
import { InitComponent } from './pages/init/init.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ConfigGuard } from './guards/config.guard';
import { ChangeLogComponent } from './pages/change-log/change-log.component';
import { SearchComponent } from './pages/shared/search/search.component';

const routes: Routes = [
  {path: 'Preload', component: PreloadComponent},
  {path: 'ChangeLog', component: ChangeLogComponent},
  {path: 'Init', component: InitComponent},
  {
    path: 'Dashboard', 
    component: DashboardComponent,
    canActivateChild: [ConfigGuard],
    children: [
      {path: 'Home', component: HomeComponent},
      {path: 'CreateUsers', component: CreateUsersComponent },
      {path: 'ManagementUsers', component: ManagementUsersComponent },
      {path: 'Profile', component: ProfileComponent},
      {path: 'Search/:content', component: SearchComponent},
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
