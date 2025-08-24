import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';
import { VoltarInicioComponent } from '../voltar-inicio/voltar-inicio.component';
import { StorageService } from '../../services/storage/storage.service'; // adicione esta linha

@Component({
  selector: 'app-estados',
  standalone: true,
  templateUrl: './estados.component.html',
  styleUrl: './estados.component.scss',
  imports: [RouterLink, CommonModule, VoltarInicioComponent]
})
export class EstadosComponent {
  private readonly router: Router = inject(Router);
  private readonly storageService: StorageService = inject(StorageService);

  readonly estados = environment.estados.sort((a, b) => {
    // União Federativa sempre primeiro
    if (a.id === 1) return -1;
    if (b.id === 1) return 1;

    // Ativos antes dos inativos
    if (a.ativo && !b.ativo) return -1;
    if (!a.ativo && b.ativo) return 1;

    // Dentro de cada grupo, ordenar alfabeticamente
    return a.nome.localeCompare(b.nome);
  });

  selectState(federalEntity: string, federalEntityImage: string, federalEntityId: number): void {
    this.storageService.setFederalEntity(federalEntity, federalEntityImage, federalEntityId.toString());
    this.router.navigate(['/']);
  }
}