export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: 'student' | 'supervisor' | 'director';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}
