import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { EstadosComponent } from './pages/estados/estados.component';
import { SobreComponent } from './pages/sobre/sobre.component';
import { MetodologiaComponent } from './pages/metodologia/metodologia.component';
import { OrigemComponent } from './pages/origem/origem.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'estados', component: EstadosComponent },
  { path: 'sobre', component: SobreComponent },
  { path: 'metodologia', component: MetodologiaComponent },
  { path: 'origem', component: OrigemComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }