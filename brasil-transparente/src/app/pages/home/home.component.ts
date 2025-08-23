import { Component, Inject, OnInit } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { DataService } from '../../services/data/data.service';
import { StorageService } from '../../services/storage/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
})
export class HomeComponent {
  private readonly apiService: ApiService = Inject(ApiService);
  private readonly dataService: DataService = Inject(DataService);
  private readonly storageService: StorageService = Inject(StorageService);

  federalEntityId: string = '1';
  totalValue: number = 0;
  isLoading: boolean = false;
  activeReport: string = 'simplificado';
  simplifiedData: any[] = [];

  afterViewInit(): void {
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