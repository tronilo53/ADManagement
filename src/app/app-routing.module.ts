import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreloadComponent } from './pages/preload/preload.component';
import { HomeComponent } from './pages/home/home.component';
import { ManagementUsersComponent } from './pages/management-users/management-users.component';
import { CreateUsersComponent } from './pages/create-users/create-users.component';

const routes: Routes = [
  {path: 'Preload', component: PreloadComponent},
  {path: 'Home', component: HomeComponent },
  {path: 'ManagementUsers', component: ManagementUsersComponent },
  {path: 'CreateUsers', component: CreateUsersComponent },
  {path: '**', pathMatch: 'full', redirectTo: 'Home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
