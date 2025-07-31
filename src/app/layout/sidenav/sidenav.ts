import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@Component({
  selector: 'app-sidenav',
  imports: [CommonModule, ScrollPanelModule, RouterModule],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss'
})
export class Sidenav {
  constructor(private router: Router) {}

  isActiveRoute(routes: string[]): boolean {
    return routes.some(route => this.router.url.startsWith(route));
  }
}
