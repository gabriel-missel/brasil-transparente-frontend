import { Component, inject, Inject, OnInit } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { DataService } from '../../services/data/data.service';
import { StorageService } from '../../services/storage/storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class HomeComponent {
  private readonly apiService: ApiService = inject(ApiService);
  private readonly dataService: DataService = inject(DataService);
  private readonly storageService: StorageService = inject(StorageService);

  federalEntityId: string = '1';
  totalValue: number = 0;
  isLoading: boolean = false;
  // TODO remover a string e colocar enum
  activeReport: string = 'simplificado!';
  simplifiedData: any[] = [];
  poderes: any[] = [];

  ngOnInit(): void {
    this.storageService.federalEntityId$.subscribe(id => {
      this.federalEntityId = id;
      this.loadData();
    });
  }

  loadData(): void {
    this.isLoading = true;
    this.apiService.getTotalValueSpent(this.federalEntityId).subscribe(total => {
      this.totalValue = total;
      this.loadReportData();
    });

    // TODO ao mudar o tipo de relatório, fazer a nova chamada.
    // this.activeReport
  }

  loadReportData(): void {
    if (this.activeReport === 'simplificado') {
      this.loadSimplifiedReport();
    } else {
      this.loadDetailedReport();
    }
  }

  loadSimplifiedReport(): void {
    this.apiService.getDespesaSimplificada(this.federalEntityId).subscribe(data => {
      this.simplifiedData = data;
      this.isLoading = false;
    });
  }

  loadDetailedReport(): void {
    this.isLoading = true;
    this.apiService.getPoderes(this.federalEntityId).subscribe(poderes => {
      this.poderes = poderes;
      this.isLoading = false;
    });
  }

  getBarColor(level: number): string {
    const colors = ['#3db6f2', '#5cbef3', '#7fcdf4', '#a1dbf3', '#bbbbb8'];
    return colors[level] ?? '#3db6f2';
  }

  setActiveReport(report: string): void {
    this.activeReport = report;
    this.loadReportData();
  }

  formatLargeCurrency(value: number): string {
    return this.dataService.formatLargeCurrency(value);
  }

  formatCurrency(value: number): string {
    return this.dataService.formatCurrency(value);
  }

}