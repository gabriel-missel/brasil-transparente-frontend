import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-estados',
  standalone: true,
  templateUrl: './estados.component.html',
  styleUrl: './estados.component.scss',
  imports: [RouterLink, CommonModule]
})
export class EstadosComponent {
  private readonly router: Router = inject(Router);
  readonly estados = environment.estados.sort((a, b) => {
    // União Federativa sempre primeiro
    if (a.id === 1) return -1;
    if (b.id === 1) return 1;

    // Estados ativos antes dos inativos
    if (a.ativo && !b.ativo) return -1;
    if (!a.ativo && b.ativo) return 1;

    // Já estão ordenados por nome, então não precisa mexer
    return 0;
  });

  selectState(federalEntity: string, federalEntityImage: string, federalEntityId: number): void {
    localStorage.setItem("federalEntityName", federalEntity);
    localStorage.setItem("federalEntityImage", federalEntityImage);
    localStorage.setItem("federalEntityId", federalEntityId.toString());
    this.router.navigate(['/']);
  }
}