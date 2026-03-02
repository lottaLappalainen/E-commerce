export type RequestStatus = 'loading' | 'success' | 'error' | '';

export interface NotificationState {
  message: string;
  stateType: 'auth' | 'product' | 'order' | 'user' | 'cart' | '';
  requestStatus: RequestStatus;
}