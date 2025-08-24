import { Component, inject, output, signal } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage/storage.service';
import { ReportType } from '../../models/tipos-relatorios.model';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: []
})
export class HeaderComponent {
  private readonly storageService: StorageService = inject(StorageService);
  public readonly router: Router = inject(Router);

  federalEntityName = signal('União Federal');
  federalEntityImage = signal('images/estados/uniao.png');
  activeReport = this.storageService.activeReport

  reportType = ReportType;

  ngOnInit(): void {
    this.storageService.federalEntityName$.subscribe(name => {
      this.federalEntityName.set(name);
    });
    this.storageService.federalEntityImage$.subscribe(image => {
      this.federalEntityImage.set(image);
    });
  }

  setActiveReport(report: ReportType): void {
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
    //TODO mover para o routerLink
    this.router.navigate(['/estados']);
  }
}