import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { switchMap, timer, map, of, startWith } from 'rxjs';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html'
})
export class NotificationComponent {

  private notificationService = inject(NotificationService);

  notification$ = this.notificationService.notification$;

  isVisible$ = this.notification$.pipe(
    switchMap(notification => {
      if (!notification?.message) return of(false);
      return timer(5000).pipe(
        map(() => false),
        startWith(true)
      );
    })
  );
}