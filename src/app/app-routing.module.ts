import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreloadComponent } from './pages/preload/preload.component';
import { HomeComponent } from './pages/home/home.component';

const routes: Routes = [
  {path: 'Preload', component: PreloadComponent},
  {path: 'Home', component: HomeComponent },
  {path: '**', pathMatch: 'full', redirectTo: 'Home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
