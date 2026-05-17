import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Vente {
  id?: number;
  numProduit: string;
  design: string;
  prix: number;
  quantite: number;
  montant?: number;
  created_at?: string;
}

export interface Stats {
  total: number;
  min: number;
  max: number;
}

@Injectable({ providedIn: 'root' })
export class VenteService {
  private apiUrl = 'http://localhost:3000/vente';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Vente[]> {
    return this.http.get<Vente[]>(this.apiUrl);
  }

  create(vente: Vente): Observable<Vente> {
    return this.http.post<Vente>(this.apiUrl, vente);
  }

  update(id: number, vente: Partial<Vente>): Observable<Vente> {
    return this.http.put<Vente>(`${this.apiUrl}/${id}`, vente);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getStats(): Observable<Stats> {
    return this.http.get<Stats>(`${this.apiUrl}/stats`);
  }
}
