export interface AuthUser {
  id: string;
  username: string;
  role: 'guest' | 'customer' | 'admin';
}

export interface AuthState {
  role: 'guest' | 'customer' | 'admin';
  user?: AuthUser | null;
}