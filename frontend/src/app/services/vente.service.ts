import { Injectable, signal } from '@angular/core';
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
  minDesign?: string;
  max: number;
  maxDesign?: string;
}

@Injectable({ providedIn: 'root' })
export class VenteService {
  private apiUrl = 'http://localhost:3000/vente';

  // Cache partagé entre toutes les pages
  ventes = signal<Vente[]>([]);
  stats  = signal<Stats>({ total: 0, min: 0, minDesign: '', max: 0, maxDesign: '' });

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

  /** Charge ventes + stats et met à jour les signals partagés */
  loadAll(): void {
    this.getAll().subscribe({
      next: (data) => {
        this.ventes.set(data);
        this.computeStats(data);
      }
    });
  }

  computeStats(ventes: Vente[]): void {
    if (!ventes.length) {
      this.stats.set({ total: 0, min: 0, minDesign: '', max: 0, maxDesign: '' });
      return;
    }
    const montants = ventes.map(v => Number(v.montant));
    const minVal = Math.min(...montants);
    const maxVal = Math.max(...montants);
    this.stats.set({
      total: montants.reduce((a, b) => a + b, 0),
      min:   minVal,
      minDesign: ventes.find(v => Number(v.montant) === minVal)?.design || '',
      max:   maxVal,
      maxDesign: ventes.find(v => Number(v.montant) === maxVal)?.design || '',
    });
  }

  formatMontant(v: number): string {
    if (!v && v !== 0) return '0 Ar';
    return new Intl.NumberFormat('fr-FR').format(Math.round(v)) + ' Ar';
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
         + ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }
}
