import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DespesaSimplificada } from '../../models/despesa-simplificada.model';
import { Poder } from '../../models/poder.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  //TODO mover as URLS para arquivo referente a cada endpoint
  private readonly API_BASE = environment.apiBase;
  private readonly http: HttpClient = inject(HttpClient);

  private cacheKey(url: string): string {
    return `apiCache:${url}`;
  }

  private getCached<T>(url: string): T | null {
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

  private setCache<T>(url: string, data: T): void {
    localStorage.setItem(
      this.cacheKey(url),
      JSON.stringify({ data, timestamp: Date.now() })
    );
  }

  private getWithCache<T>(url: string): Observable<T> {
    const cached = this.getCached<T>(url);
    if (cached !== null) {
      return new Observable<T>(observer => {
        observer.next(cached);
        observer.complete();
      });
    }
    return new Observable<T>(observer => {
      this.http.get<T>(url).subscribe({
        next: (data) => {
          this.setCache(url, data);
          observer.next(data);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  getTotalValueSpent(federalEntityId: string): Observable<number> {
    const url = `${this.API_BASE}/unidade-federativa/${federalEntityId}/total-value-spent`;
    return this.getWithCache<number>(url);
  }

  getDespesaSimplificada(federalEntityId: string): Observable<DespesaSimplificada[]> {
    const url = `${this.API_BASE}/despesa-simplificada/${federalEntityId}`;
    return this.getWithCache<DespesaSimplificada[]>(url);
  }

  getPoderes(federalEntityId: string): Observable<Poder[]> {
    const url = `${this.API_BASE}/unidade-federativa/${federalEntityId}/poderes`;
    return this.getWithCache<Poder[]>(url);
  }

  getMinisterios(poderId: number): Observable<any[]> {
    const url = `${this.API_BASE}/poder/${poderId}/ministerios`;
    return this.getWithCache<any[]>(url);
  }

  getOrgaos(ministerioId: number): Observable<any[]> {
    const url = `${this.API_BASE}/ministerio/${ministerioId}/orgaos`;
    return this.getWithCache<any[]>(url);
  }

  getUnidadesGestoras(orgaoId: number): Observable<any[]> {
    const url = `${this.API_BASE}/orgao/${orgaoId}/unidades-gestoras`;
    return this.getWithCache<any[]>(url);
  }

  getElementoDespesa(unidadeId: number): Observable<any[]> {
    const url = `${this.API_BASE}/unidade-gestora/${unidadeId}/elemento-despesa`;
    return this.getWithCache<any[]>(url);
  }
}