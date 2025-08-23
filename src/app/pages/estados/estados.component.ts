import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-estados',
  standalone: true,
  templateUrl: './estados.component.html',
  styleUrl: './estados.component.scss',
  imports: [RouterLink, CommonModule]
})
export class EstadosComponent {
  private readonly router: Router = inject(Router);

  selectState(federalEntity: string, federalEntityImage: string, federalEntityId: number): void {
    localStorage.setItem("federalEntityName", federalEntity);
    localStorage.setItem("federalEntityImage", federalEntityImage);
    localStorage.setItem("federalEntityId", federalEntityId.toString());
    this.router.navigate(['/']);
  }
}