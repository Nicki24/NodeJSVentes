import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { VenteService, Vente } from '../../services/vente.service';

interface Toast { id: number; type: 'success' | 'error'; msg: string; }

@Component({
  selector: 'app-add',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add.page.html',
  styleUrl: './add.page.css'
})
export class AddPage {

  form: Vente = { numProduit: '', design: '', prix: 0, quantite: 0 };
  submitted = false;
  loading   = signal(false);
  toasts    = signal<Toast[]>([]);
  toastId   = 0;

  montantPreview = computed(() =>
    (this.form.prix || 0) * (this.form.quantite || 0)
  );

  constructor(private venteService: VenteService, private router: Router) {}

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

  addVente() {
    this.submitted = true;
    if (!this.isFormValid()) return;

    this.loading.set(true);
    const payload = {
      ...this.form,
      numProduit: this.form.numProduit.trim(),
      design: this.form.design.trim(),
    };

    this.venteService.create(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.showToast('success', 'Vente ajoutée avec succès !');
        this.resetForm();
        // Recharger le cache partagé
        this.venteService.loadAll();
        setTimeout(() => this.router.navigate(['/sales']), 1800);
      },
      error: (err) => {
        this.loading.set(false);
        const msg = err.error?.message || 'Erreur lors de l\'ajout.';
        this.showToast('error', msg);
      }
    });
  }

  showToast(type: 'success' | 'error', msg: string) {
    const id = ++this.toastId;
    this.toasts.update(t => [...t, { id, type, msg }]);
    setTimeout(() => this.toasts.update(t => t.filter(x => x.id !== id)), 3500);
  }

  fmt(v: number) { return this.venteService.formatMontant(v); }
}
