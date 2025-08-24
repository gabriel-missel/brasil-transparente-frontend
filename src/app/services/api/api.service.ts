import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DespesaSimplificada } from '../../models/despesa-simplificada.model';
import { Poder } from '../../models/poder.model';
import { environment } from '../../../environments/environment.development';
import { StorageService } from '../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  //TODO mover as URLS para arquivo referente a cada endpoint
  private readonly API_BASE = environment.apiBase;
  private readonly http: HttpClient = inject(HttpClient);
  private readonly storageService: StorageService = inject(StorageService);

  private getWithCache<T>(url: string): Observable<T> {
    const cached = this.storageService.getCached<T>(url);
    if (cached !== null) {
      return new Observable<T>(observer => {
        observer.next(cached);
        observer.complete();
      });
    }
    return new Observable<T>(observer => {
      this.http.get<T>(url).subscribe({
        next: (data) => {
          this.storageService.setCache(url, data);
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