import { Component, inject, output, signal, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../services/storage/storage.service';
import { ReportType } from '../../models/tipos-relatorios.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: []
})
export class HeaderComponent implements OnDestroy {
  private readonly storageService: StorageService = inject(StorageService);
  public readonly router: Router = inject(Router);

  federalEntityName = signal('União Federal');
  federalEntityImage = signal('images/estados/uniao.png');
  activeReport = this.storageService.activeReport

  reportType = ReportType;

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.storageService.federalEntityName$
      .pipe(takeUntil(this.destroy$))
      .subscribe(name => {
        this.federalEntityName.set(name);
      });
    this.storageService.federalEntityImage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(image => {
        this.federalEntityImage.set(image);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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