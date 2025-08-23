import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: []
})
export class HeaderComponent {
  private readonly storageService: StorageService = inject(StorageService);
  public router: Router = inject(Router);

  activeReport = signal('simplificado');
  federalEntityName = signal('União Federal');
  federalEntityImage = signal('images/estados/uniao.png');

  afterViewInit(): void {
    this.storageService.federalEntityName$.subscribe(name => {
      this.federalEntityName.set(name);
    });
    this.storageService.federalEntityImage$.subscribe(image => {
      this.federalEntityImage.set(image);
    });
  }

  setActiveReport(report: string): void {
    this.activeReport.set(report);
  }

  onMouseOverStateButton(): void {
    const button = document.querySelector('.report-button[data-report="geral"] span');
    if (button) button.textContent = 'Selecionar outro';
  }

  onMouseOutStateButton(): void {
    const button = document.querySelector('.report-button[data-report="geral"] span');
    if (button) button.textContent = this.federalEntityName();
  }

  navigateToEstados(): void {
    this.router.navigate(['/estados']);
  }
}