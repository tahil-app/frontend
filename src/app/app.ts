import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./layout/header/header";
import { Sidenav } from './layout/sidenav/sidenav';
import { Footer } from "./layout/footer/footer";
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { NgxUiLoaderModule } from 'ngx-ui-loader';

@Component({
  selector: 'app-root',
  imports: [Header, Sidenav, Footer, RouterOutlet, TooltipModule, ToastModule, NgxUiLoaderModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('tahil');
}
