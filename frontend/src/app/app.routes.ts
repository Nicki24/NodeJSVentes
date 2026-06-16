import { Routes } from '@angular/router';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { SalesPage } from './pages/sales/sales.page';
import { AddPage } from './pages/add/add.page';
import { StatisticsPage } from './pages/statistics/statistics.page';

export const routes: Routes = [
  { path: '',          component: DashboardPage,  title: 'Accueil — TechStock' },
  { path: 'sales',     component: SalesPage,       title: 'Tableau des ventes' },
  { path: 'add',       component: AddPage,         title: 'Ajouter une vente' },
  { path: 'statistics',component: StatisticsPage,  title: 'Statistiques' },
  { path: '**',        redirectTo: '' },
];
