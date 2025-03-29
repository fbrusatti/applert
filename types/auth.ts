export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: 'citizen' | 'admin' | 'police' | 'civil_defense' | 'fire_department';
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

