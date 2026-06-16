import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar #navbar></app-navbar>

    <div class="main-wrapper">
      <!-- Burger button for mobile -->
      <button class="sidebar-toggle" (click)="navbar.toggleMenu()" aria-label="Menu">
        <i class="fa fa-bars"></i>
      </button>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .main-wrapper {
      margin-left: 260px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .sidebar-toggle {
      display: none;
      position: fixed;
      top: 12px;
      left: 12px;
      z-index: 150;
      width: 42px;
      height: 42px;
      border-radius: 10px;
      border: none;
      background: linear-gradient(135deg, #1976D2, #0d47a1);
      color: #fff;
      font-size: 1.15rem;
      cursor: pointer;
      box-shadow: 0 2px 12px rgba(13,71,161,.35);
      transition: all .22s ease;
    }

    .sidebar-toggle:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 16px rgba(13,71,161,.45);
    }

    @media (max-width: 768px) {
      .main-wrapper {
        margin-left: 0;
        padding-top: 60px;
      }
      .sidebar-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
  `]
})
export class App {}
