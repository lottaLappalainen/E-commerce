export interface AuthUser {
  id: number;
  username: string;
  role: 'guest' | 'user' | 'admin';
}

export interface AuthState {
  role: 'guest' | 'user' | 'admin';
  user?: AuthUser | null;
}