import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { VenteService, Vente } from '../../services/vente.service';

interface Toast { id: number; type: 'success' | 'error'; msg: string; }
type SortField = 'numProduit' | 'design' | 'prix' | 'quantite' | 'montant' | 'created_at';
type SortDir   = 'asc' | 'desc';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sales.page.html',
  styleUrl: './sales.page.css'
})
export class SalesPage implements OnInit {

  private venteService = inject(VenteService);
  ventes  = this.venteService.ventes;
  loading = signal(false);
  toasts  = signal<Toast[]>([]);
  toastId = 0;

  // Édition inline
  editingId: number | null = null;
  editForm: Partial<Vente> = {};

  // Recherche
  searchTerm = signal('');

  // Tri
  sortField = signal<SortField>('created_at');
  sortDir   = signal<SortDir>('desc');

  // Pagination
  currentPage = signal(1);
  pageSize    = 5;
  Math = Math;

  filteredVentes = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();
    if (!term) return this.ventes();
    return this.ventes().filter(v =>
      v.numProduit.toLowerCase().includes(term) ||
      v.design.toLowerCase().includes(term)
    );
  });

  sortedVentes = computed(() => {
    const field = this.sortField();
    const dir   = this.sortDir();
    const arr   = [...this.filteredVentes()];
    arr.sort((a, b) => {
      let va: any, vb: any;
      switch (field) {
        case 'numProduit': va = a.numProduit.toLowerCase(); vb = b.numProduit.toLowerCase(); break;
        case 'design':     va = a.design.toLowerCase();     vb = b.design.toLowerCase();     break;
        case 'prix':       va = a.prix;                     vb = b.prix;                     break;
        case 'quantite':   va = a.quantite;                 vb = b.quantite;                 break;
        case 'montant':    va = a.montant;                  vb = b.montant;                  break;
        case 'created_at': va = a.created_at;               vb = b.created_at;               break;
        default: return 0;
      }
      if (va < vb) return dir === 'asc' ? -1 : 1;
      if (va > vb) return dir === 'asc' ?  1 : -1;
      return 0;
    });
    return arr;
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.sortedVentes().length / this.pageSize)));

  displayedVentes = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.sortedVentes().slice(start, start + this.pageSize);
  });

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const curr  = this.currentPage();
    const pages: number[] = [];
    const start = Math.max(1, curr - 2);
    const end   = Math.min(total, curr + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.venteService.getAll().subscribe({
      next: (data) => {
        this.venteService.ventes.set(data);
        this.venteService.computeStats(data);
        this.loading.set(false);
      },
      error: () => {
        this.showToast('error', 'Impossible de contacter le serveur.');
        this.loading.set(false);
      }
    });
  }

  onSearch(term: string) { this.searchTerm.set(term); this.currentPage.set(1); }

  setSort(field: SortField) {
    if (this.sortField() === field) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDir.set('asc');
    }
    this.currentPage.set(1);
  }

  sortIcon(field: SortField): string {
    if (this.sortField() !== field) return 'fa-sort';
    return this.sortDir() === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) this.currentPage.set(page);
  }

  startEdit(vente: Vente) {
    this.editingId = vente.id!;
    this.editForm = { numProduit: vente.numProduit, design: vente.design, prix: vente.prix, quantite: vente.quantite };
  }

  cancelEdit() { this.editingId = null; this.editForm = {}; }

  saveEdit(id: number) {
    if (!this.editForm.prix || this.editForm.prix <= 0)    { this.showToast('error', 'Prix invalide.'); return; }
    if (!this.editForm.quantite || this.editForm.quantite <= 0) { this.showToast('error', 'Quantité invalide.'); return; }
    const payload = {
      ...this.editForm,
      numProduit: this.editForm.numProduit?.trim(),
      design: this.editForm.design?.trim(),
    };
    this.venteService.update(id, payload).subscribe({
      next: () => { this.showToast('success', 'Vente modifiée avec succès !'); this.editingId = null; this.loadData(); },
      error: (err) => { const msg = err.error?.message || 'Erreur lors de la modification.'; this.showToast('error', msg); }
    });
  }

  deleteVente(id: number, design: string) {
    if (!confirm(`Supprimer la vente "${design}" ?`)) return;
    this.venteService.delete(id).subscribe({
      next: () => { this.showToast('success', `Vente "${design}" supprimée.`); this.loadData(); },
      error: () => this.showToast('error', 'Erreur lors de la suppression.')
    });
  }

  showToast(type: 'success' | 'error', msg: string) {
    const id = ++this.toastId;
    this.toasts.update(t => [...t, { id, type, msg }]);
    setTimeout(() => this.toasts.update(t => t.filter(x => x.id !== id)), 3500);
  }

  fmt(v: number)              { return this.venteService.formatMontant(v); }
  fmtDate(d?: string)         { return this.venteService.formatDate(d); }
  trackByVente(_: number, v: Vente) { return v.id; }
}
