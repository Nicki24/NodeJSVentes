import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { VenteService, Vente, Stats } from './services/vente.service';

declare const Chart: any;

interface Toast { id: number; type: 'success' | 'error'; msg: string; }

type SortField = 'numProduit' | 'design' | 'prix' | 'quantite' | 'montant' | 'created_at';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  // ── État ──
  ventes    = signal<Vente[]>([]);
  stats     = signal<Stats>({ total: 0, min: 0, minDesign: '', max: 0, maxDesign: '' });
  loading   = signal(false);
  toasts    = signal<Toast[]>([]);
  toastId   = 0;

  // ── Formulaire ajout ──
  form: Vente = { numProduit: '', design: '', prix: 0, quantite: 0 };
  submitted = false;
  montantPreview = computed(() =>
    (this.form.prix || 0) * (this.form.quantite || 0)
  );

  // ── Édition inline ──
  editingId: number | null = null;
  editForm: Partial<Vente> = {};

  // ── Recherche ──
  searchTerm = signal('');

  // ── Tri ──
  sortField = signal<SortField>('created_at');
  sortDir   = signal<SortDir>('desc');

  // ── Pagination ──
  currentPage = signal(1);
  pageSize    = 5;

  // ── Ventes filtrées + triées + paginées ──
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
      if (va > vb) return dir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  });

  totalPages = computed(() => Math.max(1, Math.ceil(this.sortedVentes().length / this.pageSize)));

  displayedVentes = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.sortedVentes().slice(start, start + this.pageSize);
  });

  // ── Exposé pour le template ──
  Math = Math;

  // ── Date ──
  today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  private barChart: any;
  private pieChart: any;

  constructor(private venteService: VenteService) {}

  ngOnInit() {
    this.loadData();
  }

  // ───────────────── CHARGEMENT ─────────────────
  loadData() {
    this.loading.set(true);
    this.venteService.getAll().subscribe({
      next: (data) => {
        this.ventes.set(data);
        this.computeStats(data);
        setTimeout(() => this.renderCharts(), 100);
        this.loading.set(false);
      },
      error: () => {
        this.showToast('error', 'Impossible de contacter le serveur.');
        this.loading.set(false);
      }
    });
  }

  computeStats(ventes: Vente[]) {
    if (!ventes.length) { this.stats.set({ total: 0, min: 0, minDesign: '', max: 0, maxDesign: '' }); return; }
    const montants = ventes.map(v => Number(v.montant));
    const minVal = Math.min(...montants);
    const maxVal = Math.max(...montants);
    const minVente = ventes.find(v => Number(v.montant) === minVal);
    const maxVente = ventes.find(v => Number(v.montant) === maxVal);
    this.stats.set({
      total: montants.reduce((a, b) => a + b, 0),
      min:   minVal,
      minDesign: minVente?.design || '',
      max:   maxVal,
      maxDesign: maxVente?.design || '',
    });
  }

  // ───────────────── RECHERCHE ─────────────────
  onSearch(term: string) {
    this.searchTerm.set(term);
    this.currentPage.set(1);
  }

  // ───────────────── TRI ─────────────────
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

  // ───────────────── PAGINATION ─────────────────
  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  pageNumbers = computed(() => {
    const total = this.totalPages();
    const curr  = this.currentPage();
    const pages: number[] = [];
    const start = Math.max(1, curr - 2);
    const end   = Math.min(total, curr + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  });

  // ───────────────── AJOUT ─────────────────
  addVente() {
    this.submitted = true;
    if (!this.isFormValid()) return;

    const payload = {
      ...this.form,
      numProduit: this.form.numProduit.trim(),
      design: this.form.design.trim(),
    };

    this.venteService.create(payload).subscribe({
      next: () => {
        this.showToast('success', 'Vente ajoutée avec succès !');
        this.resetForm();
        this.loadData();
      },
      error: (err) => {
        const msg = err.error?.message || 'Erreur lors de l\'ajout.';
        this.showToast('error', msg);
      }
    });
  }

  isFormValid(): boolean {
    return !!this.form.numProduit?.trim()
        && !!this.form.design?.trim()
        && this.form.prix > 0
        && this.form.quantite > 0;
  }

  resetForm() {
    this.form = { numProduit: '', design: '', prix: 0, quantite: 0 };
    this.submitted = false;
  }

  // ───────────────── ÉDITION INLINE ─────────────────
  startEdit(vente: Vente) {
    this.editingId = vente.id!;
    this.editForm = { numProduit: vente.numProduit, design: vente.design, prix: vente.prix, quantite: vente.quantite };
  }

  cancelEdit() { this.editingId = null; this.editForm = {}; }

  saveEdit(id: number) {
    if (!this.editForm.prix || this.editForm.prix <= 0) { this.showToast('error', 'Prix invalide.'); return; }
    if (!this.editForm.quantite || this.editForm.quantite <= 0) { this.showToast('error', 'Quantité invalide.'); return; }

    const payload = {
      ...this.editForm,
      numProduit: this.editForm.numProduit?.trim(),
      design: this.editForm.design?.trim(),
    };

    this.venteService.update(id, payload).subscribe({
      next: () => {
        this.showToast('success', 'Vente modifiée avec succès !');
        this.editingId = null;
        this.loadData();
      },
      error: (err) => {
        const msg = err.error?.message || 'Erreur lors de la modification.';
        this.showToast('error', msg);
      }
    });
  }

  // ───────────────── SUPPRESSION ─────────────────
  deleteVente(id: number, design: string) {
    if (!confirm(`Supprimer la vente "${design}" ?`)) return;
    this.venteService.delete(id).subscribe({
      next: () => {
        this.showToast('success', `Vente "${design}" supprimée.`);
        this.loadData();
      },
      error: () => this.showToast('error', 'Erreur lors de la suppression.')
    });
  }

  // ───────────────── GRAPHIQUES ─────────────────
  renderCharts() {
    const s = this.stats();

    if (this.barChart) this.barChart.destroy();
    if (this.pieChart) this.pieChart.destroy();

    const barCtx = (document.getElementById('barChart') as HTMLCanvasElement)?.getContext('2d');
    if (barCtx) {
      this.barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: ['Total', 'Minimum', 'Maximum'],
          datasets: [{
            label: 'Montant (Ar)',
            data: [s.total, s.min, s.max],
            backgroundColor: [
              'rgba(25,118,210,0.80)',
              'rgba(46,125,50,0.80)',
              'rgba(230,81,0,0.80)'
            ],
            borderColor: ['#1976D2','#2e7d32','#e65100'],
            borderWidth: 2,
            borderRadius: 8,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (ctx: any) => ` ${this.formatMontant(ctx.parsed.y)}`
              }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: (v: any) => this.formatMontant(v)
              },
              grid: { color: 'rgba(0,0,0,.05)' }
            },
            x: { grid: { display: false } }
          },
          animation: { duration: 800, easing: 'easeOutQuart' }
        }
      });
    }

    const pieCtx = (document.getElementById('pieChart') as HTMLCanvasElement)?.getContext('2d');
    if (pieCtx && (s.total > 0 || s.min > 0 || s.max > 0)) {
      this.pieChart = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
          labels: ['Total', 'Minimum', 'Maximum'],
          datasets: [{
            data: [s.total, s.min, s.max],
            backgroundColor: ['#1976D2','#2e7d32','#e65100'],
            borderColor: ['#fff','#fff','#fff'],
            borderWidth: 3,
            hoverOffset: 12
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { padding: 20, font: { family: 'Poppins', size: 13 } } },
            tooltip: {
              callbacks: {
                label: (ctx: any) => ` ${ctx.label}: ${this.formatMontant(ctx.parsed)}`
              }
            }
          },
          animation: { duration: 800, easing: 'easeOutQuart' }
        }
      });
    }
  }

  // ───────────────── UTILITAIRES ─────────────────
  formatMontant(v: number): string {
    if (!v && v !== 0) return '0 Ar';
    return new Intl.NumberFormat('fr-FR').format(Math.round(v)) + ' Ar';
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) +
           ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  }

  showToast(type: 'success'|'error', msg: string) {
    const id = ++this.toastId;
    this.toasts.update(t => [...t, { id, type, msg }]);
    setTimeout(() => this.toasts.update(t => t.filter(x => x.id !== id)), 3500);
  }

  trackByVente(_: number, v: Vente) { return v.id; }
}
