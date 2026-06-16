import { Component, OnInit, inject, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VenteService } from '../../services/vente.service';

declare const Chart: any;

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './statistics.page.html',
  styleUrl: './statistics.page.css'
})
export class StatisticsPage implements OnInit, AfterViewInit, OnDestroy {

  private venteService = inject(VenteService);

  stats   = this.venteService.stats;
  ventes  = this.venteService.ventes;
  loading = signal(true);

  private barChart: any;
  private pieChart: any;
  private dataReady = false;

  ngOnInit() {
    this.venteService.getAll().subscribe({
      next: (data) => {
        this.venteService.ventes.set(data);
        this.venteService.computeStats(data);
        this.loading.set(false);
        this.dataReady = true;
        setTimeout(() => this.renderCharts(), 80);
      },
      error: () => this.loading.set(false)
    });
  }

  ngAfterViewInit() {
    if (this.dataReady) setTimeout(() => this.renderCharts(), 80);
  }

  ngOnDestroy() {
    this.barChart?.destroy();
    this.pieChart?.destroy();
  }

  renderCharts() {
    const s = this.stats();
    this.barChart?.destroy();
    this.pieChart?.destroy();

    // Bar chart
    const barCtx = (document.getElementById('barChart') as HTMLCanvasElement)?.getContext('2d');
    if (barCtx) {
      this.barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: ['Total', 'Minimum', 'Maximum'],
          datasets: [{
            label: 'Montant (Ar)',
            data: [s.total, s.min, s.max],
            backgroundColor: ['rgba(25,118,210,.80)', 'rgba(46,125,50,.80)', 'rgba(230,81,0,.80)'],
            borderColor: ['#1976D2', '#2e7d32', '#e65100'],
            borderWidth: 2,
            borderRadius: 10,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (ctx: any) => ` ${this.fmt(ctx.parsed.y)}` } }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { callback: (v: any) => this.fmt(v) },
              grid: { color: 'rgba(0,0,0,.05)' }
            },
            x: { grid: { display: false } }
          },
          animation: { duration: 900, easing: 'easeOutQuart' }
        }
      });
    }

    // Doughnut chart per vente
    const pieCtx = (document.getElementById('pieChart') as HTMLCanvasElement)?.getContext('2d');
    const ventes = this.ventes();
    if (pieCtx && ventes.length > 0) {
      const colors = [
        '#1976D2','#2e7d32','#e65100','#7b1fa2','#c62828',
        '#00838f','#f57f17','#4527a0','#558b2f','#d84315'
      ];
      this.pieChart = new Chart(pieCtx, {
        type: 'doughnut',
        data: {
          labels: ventes.map(v => v.design),
          datasets: [{
            data: ventes.map(v => Number(v.montant)),
            backgroundColor: ventes.map((_, i) => colors[i % colors.length]),
            borderColor: '#fff',
            borderWidth: 3,
            hoverOffset: 14
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { padding: 16, font: { family: 'Poppins', size: 12 } } },
            tooltip: { callbacks: { label: (ctx: any) => ` ${ctx.label}: ${this.fmt(ctx.parsed)}` } }
          },
          animation: { duration: 900, easing: 'easeOutQuart' }
        }
      });
    }
  }

  fmt(v: number) { return this.venteService.formatMontant(v); }
}
