import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DespesaSimplificada } from '../../models/despesa-simplificada.model';
import { Poder } from '../../models/poder.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_BASE = environment.apiBase;
  private readonly http: HttpClient = Inject(HttpClient);

  getTotalValueSpent(federalEntityId: string): Observable<number> {
    return this.http.get<number>(`${this.API_BASE}/unidade-federativa/${federalEntityId}/total-value-spent`);
  }

  getDespesaSimplificada(federalEntityId: string): Observable<DespesaSimplificada[]> {
    return this.http.get<DespesaSimplificada[]>(`${this.API_BASE}/despesa-simplificada/${federalEntityId}`);
  }

  getPoderes(federalEntityId: string): Observable<Poder[]> {
    return this.http.get<Poder[]>(`${this.API_BASE}/unidade-federativa/${federalEntityId}/poderes`);
  }

  getMinisterios(poderId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BASE}/poder/${poderId}/ministerios`);
  }

  getOrgaos(ministerioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BASE}/ministerio/${ministerioId}/orgaos`);
  }

  getUnidadesGestoras(orgaoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BASE}/orgao/${orgaoId}/unidades-gestoras`);
  }

  getElementoDespesa(unidadeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_BASE}/unidade-gestora/${unidadeId}/elemento-despesa`);
  }
}