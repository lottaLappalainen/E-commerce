export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'guest' | 'Customer' | 'Admin';
}

export interface AuthState {
  role: 'guest' | 'Customer' | 'Admin';
  user: AuthUser | null;
  accessToken: string | null;
}