import { Component } from '@angular/core';
import { VoltarInicioComponent } from '../voltar-inicio/voltar-inicio.component';

@Component({
  selector: 'app-sobre',
  imports: [VoltarInicioComponent],
  templateUrl: './sobre.component.html',
  styleUrl: './sobre.component.scss',
  standalone: true
})
export class SobreComponent {

}
