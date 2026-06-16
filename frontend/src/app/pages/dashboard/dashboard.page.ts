import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VenteService } from '../../services/vente.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css'
})
export class DashboardPage implements OnInit {

  private venteService = inject(VenteService);

  loading = signal(true);
  error   = signal(false);

  ventes  = this.venteService.ventes;
  stats   = this.venteService.stats;

  count   = computed(() => this.ventes().length);

  cards = [
    {
      icon: 'fa-table',
      label: 'Tableau des ventes',
      description: 'Consultez, triez, recherchez et gérez toutes vos ventes en un coup d\'œil.',
      route: '/sales',
      color: 'blue',
      cta: 'Voir le tableau'
    },
    {
      icon: 'fa-plus-circle',
      label: 'Ajouter une vente',
      description: 'Enregistrez rapidement une nouvelle vente avec calcul automatique du montant.',
      route: '/add',
      color: 'green',
      cta: 'Ajouter'
    },
    {
      icon: 'fa-chart-bar',
      label: 'Statistiques',
      description: 'Visualisez vos performances avec histogramme et diagramme circulaire.',
      route: '/statistics',
      color: 'orange',
      cta: 'Voir les stats'
    },
  ];

  ngOnInit() {
    this.venteService.getAll().subscribe({
      next: (data) => {
        this.venteService.ventes.set(data);
        this.venteService.computeStats(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  fmt(v: number) { return this.venteService.formatMontant(v); }
}
