import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ReportType } from '../../models/tipos-relatorios.model';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  // TODO alterar para signal
  private federalEntityNameSubject = new BehaviorSubject<string>('União Federal');
  private federalEntityImageSubject = new BehaviorSubject<string>('/images/estados/uniao.png');
  private federalEntityIdSubject = new BehaviorSubject<string>('1');

  federalEntityName$ = this.federalEntityNameSubject.asObservable();
  federalEntityImage$ = this.federalEntityImageSubject.asObservable();
  federalEntityId$ = this.federalEntityIdSubject.asObservable();

  activeReport = signal<ReportType>(ReportType.Simplificado);

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage(): void {
    const name = localStorage.getItem('federalEntityName');
    const image = localStorage.getItem('federalEntityImage');
    const id = localStorage.getItem('federalEntityId');

    //TODO simplificar
    if (name) this.federalEntityNameSubject.next(name);
    if (image) this.federalEntityImageSubject.next(image);
    if (id) this.federalEntityIdSubject.next(id);
  }

  setFederalEntity(name: string, image: string, id: string): void {
    localStorage.setItem('federalEntityName', name);
    localStorage.setItem('federalEntityImage', image);
    localStorage.setItem('federalEntityId', id);

    this.federalEntityNameSubject.next(name);
    this.federalEntityImageSubject.next(image);
    this.federalEntityIdSubject.next(id);
  }

  private cacheKey(url: string): string {
    return `apiCache:${url}`;
  }

  getCached<T>(url: string): T | null {
    const cached = localStorage.getItem(this.cacheKey(url));
    if (!cached) return null;

    try {
      const { data, timestamp } = JSON.parse(cached);
      // 1 dia = 86400000 ms
      if (Date.now() - timestamp < 86400000) {
        return data as T;
      }
    } catch {
      console.error(`Erro ao parsear cache para a URL: ${url}`);
    }
    localStorage.removeItem(this.cacheKey(url));
    return null;
  }

  setCache<T>(url: string, data: T): void {
    localStorage.setItem(
      this.cacheKey(url),
      JSON.stringify({ data, timestamp: Date.now() })
    );
  }
}