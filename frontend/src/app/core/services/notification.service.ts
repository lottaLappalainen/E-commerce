import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NotificationState } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private state = new BehaviorSubject<NotificationState>({
    message: '',
    stateType: '',
    requestStatus: ''
  });

  notification$ = this.state.asObservable();

  set(notification: NotificationState) {
    this.state.next(notification);
  }

  clear() {
    this.state.next({
      message: '',
      stateType: '',
      requestStatus: ''
    });
  }
}