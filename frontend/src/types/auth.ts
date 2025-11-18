// src/types/auth.ts
export type UserRole = 'propietario' | 'gerente' | 'empleado';

export interface Persona {
  idPersona: number;
  ci: string;
  paterno: string;
  materno: string;
  nombres: string;
  fecha_naci: string;
  genero: 'M' | 'F' | 'O';
  telefono: string;
}

export interface UserBase {
  id: number;
  email: string;
  persona: Persona;
  direccion?: string;
  fecha_contratacion?: string;
}

export interface Gerente extends UserBase {
  role: 'gerente';
  idGerente: number;
}

export interface Empleado extends UserBase {
  role: 'empleado';
  idEmpleado: number;
}

export interface Propietario extends UserBase {
  role: 'propietario';
  idPropietario: number;
}

export type User = Gerente | Empleado | Propietario;

export interface LoginData {
  email: string;
  password: string;
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

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
  role: UserRole;
}