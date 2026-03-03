import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from './components/navbar/navbar.component';
import { NotificationComponent } from './components/notification/notification.component';
import { NotificationService } from './core/services/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    NotificationComponent
  ],
  template: `
    <div data-testid="app">
      <app-navbar></app-navbar>

      <div *ngIf="notification$ | async as notification">
        <app-notification *ngIf="notification.message"></app-notification>
      </div>

      <router-outlet></router-outlet>
    </div>
  `,
  styleUrl: './app.css'
})
export class AppComponent {

  private notificationService = inject(NotificationService);

  notification$ = this.notificationService.notification$;

}