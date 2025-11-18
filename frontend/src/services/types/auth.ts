import type { User, UserRole } from "../../types/auth";

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
  role: UserRole;
}

export interface UserProfile {
  user: User;
  role: UserRole;
}

export interface RegisterData {
  // Datos de Persona
  ci: string;
  paterno: string;
  materno: string;
  nombres: string;
  fecha_naci: string;
  genero: 'M' | 'F' | 'O';
  telefono: string;
  
  // Datos específicos del rol
  role: UserRole;
  email: string;
  password: string;
  direccion?: string;
  fecha_contratacion?: string;
}