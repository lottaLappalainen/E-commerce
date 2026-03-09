import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';
import { switchMap, timer, map, of, startWith } from 'rxjs';
import { NotificationState } from '../../core/models/notification.model';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html'
})
export class NotificationComponent {

  private notificationService = inject(NotificationService);

  notification$ = this.notificationService.notification$;

  visibleNotification$ = this.notification$.pipe(
    switchMap((notification: NotificationState) => {

      if (!notification?.message) {
        return of(null);
      }

      return timer(0).pipe(  
        switchMap(() =>
          timer(5000).pipe(
            map(() => null),
            startWith(notification)
          )
        )
      );
    })
  );
}