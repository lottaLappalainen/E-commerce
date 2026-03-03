export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'guest' | 'customer' | 'admin';
}

export interface AuthState {
  role: 'guest' | 'customer' | 'admin';
  user: AuthUser | null;
  accessToken: string | null;
}