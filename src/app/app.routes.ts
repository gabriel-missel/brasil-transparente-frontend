import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { EstadosComponent } from './components/estados/estados.component';
import { SobreComponent } from './components/sobre/sobre.component';
import { MetodologiaComponent } from './components/metodologia/metodologia.component';
import { OrigemComponent } from './components/origem/origem.component';

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