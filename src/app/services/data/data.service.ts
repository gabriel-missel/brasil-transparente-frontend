import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  setLoading(isLoading: boolean): void {
    this.isLoadingSubject.next(isLoading);
  }

  formatLargeCurrency(value: number): string {
    const trillion = 1e12;
    const billion = 1e9;
    const million = 1e6;
    const truncate = (num: number) => Math.floor(num * 100) / 100;
    
    if (value >= trillion) {
      const truncated = truncate(value / trillion);
      const formatted = truncated.toFixed(2).replace('.', ',');
      return `R$ ${formatted} ${Math.floor(value / trillion) === 1 ? 'trilhão' : 'trilhões'}`;
    } else if (value >= billion) {
      const truncated = truncate(value / billion);
      const formatted = truncated.toFixed(2).replace('.', ',');
      return `R$ ${formatted} ${Math.floor(value / billion) === 1 ? 'bilhão' : 'bilhões'}`;
    } else if (value >= million) {
      const truncated = truncate(value / million);
      const formatted = truncated.toFixed(2).replace('.', ',');
      return `R$ ${formatted} ${Math.floor(value / million) === 1 ? 'milhão' : 'milhões'}`;
    }
    
    return this.formatCurrency(value);
  }

  formatCurrency(value: number): string {
    return value?.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }
}