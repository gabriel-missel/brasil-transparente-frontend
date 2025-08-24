import { Component, effect, inject, signal } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { DataService } from '../../services/data/data.service';
import { StorageService } from '../../services/storage/storage.service';
import { CommonModule } from '@angular/common';
import { ToggleBarItemComponent } from '../toggle-bar-item/toggle-bar-item.component';
import { ReportType } from '../../models/tipos-relatorios.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, ToggleBarItemComponent]
})
export class HomeComponent {
  private readonly apiService: ApiService = inject(ApiService);
  private readonly dataService: DataService = inject(DataService);
  private readonly storageService: StorageService = inject(StorageService);
  private destroy$ = new Subject<void>();

  federalEntityId: string = '1';
  totalValue: number = 0;
  isLoading: boolean = false;
  activeReport = this.storageService.activeReport;
  simplifiedData: any[] = [];
  poderes: any[] = [];
  showRawTotal = signal(false);
  reportType = ReportType;

  constructor() {
    let initialized = false;
    effect(() => {
      this.activeReport();

      if (!initialized) {
        initialized = true;
        return; // Ignora a primeira execução
      }

      // Só executa a partir da segunda vez
      this.loadReportData();
    });
  }

  ngOnInit(): void {
    this.storageService.federalEntityId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(id => {
        this.federalEntityId = id;
        this.loadData();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadData(): void {
    this.isLoading = true;
    this.apiService.getTotalValueSpent(this.federalEntityId).subscribe(total => {
      //TODO adicionar mensagem de erro caso dê erro
      this.totalValue = total;
      this.loadReportData();
    });
  }

  loadReportData(): void {
    if (this.activeReport() === ReportType.Simplificado) {
      this.loadSimplifiedReport();
    } else {
      this.loadDetailedReport();
    }
  }

  loadSimplifiedReport(): void {
    this.isLoading = true;

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

  formatLargeCurrency(value: number): string {
    return this.dataService.formatLargeCurrency(value);
  }

  formatCurrency(value: number): string {
    return this.dataService.formatCurrency(value);
  }

  onTogglePoder(item: any): void {
    item.expanded = !item.expanded;
    if (item.expanded && !item.children) {
      let observable;

      switch (item.level) {
        case 0:
          observable = this.apiService.getMinisterios(item.id);
          break;
        case 1:
          observable = this.apiService.getOrgaos(item.id);
          break;
        case 2:
          observable = this.apiService.getUnidadesGestoras(item.id);
          break;
        case 3:
          observable = this.apiService.getElementoDespesa(item.id);
          break;
        default:
          observable = null;
      }

      if (observable) {
        observable.subscribe(children => {
          item.children = children.map(child => ({
            ...child,
            expanded: false,
            children: null
          }));
        });
      }
    }
  }
}