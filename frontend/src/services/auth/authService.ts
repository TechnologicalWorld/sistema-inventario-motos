import type { User, UserRole } from "../../types/auth";
import api from "../api";
import type { AuthResponse, LoginData, RegisterData } from "../types/auth";

export const authService = {
  /**
   * Iniciar sesión
   */
  async login(credentials: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/login", credentials);
      const { token, role } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role);

      switch (role) {
        case "gerente":
          window.location.href = "/gerente/dashboard";
          break;
        case "empleado":
          window.location.href = "/empleado/dashboard";
          break;
        case "propietario":
          window.location.href = "/propietario/dashboard";
          break;
        default:
          window.location.href = "/";
      }

      return response.data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Credenciales incorrectas"
      );
    }
  },

  /**
   * Registrar nuevo usuario
   */
  async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>("/register", userData);
      const { token, role } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("userRole", role);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      switch (role) {
        case "gerente":
          window.location.href = "/gerente/dashboard";
          break;
        case "empleado":
          window.location.href = "/empleado/dashboard";
          break;
        case "propietario":
          window.location.href = "/propietario/dashboard";
          break;
        default:
          window.location.href = "/";
      }

      return response.data;
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessage = Object.values(errors).flat().join(", ");
        throw new Error(errorMessage);
      }
      throw new Error(
        error.response?.data?.message || "Error al registrar usuario"
      );
    }
  },

  /**
   * Cerrar sesión
   */
  async logout(): Promise<void> {
    try {
      await api.post("/logout");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      delete api.defaults.headers.common["Authorization"];
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
    }
  },

  /**
   * Obtener información del usuario autenticado
   */
  async getUser(): Promise<User> {
    try {
      const response = await api.get<{ user: User; role: UserRole }>("/user");
      const { user, role } = response.data;

      localStorage.setItem("userRole", role);

      return user;
    } catch (error: any) {
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      throw new Error(
        error.response?.data?.message || "Error al obtener usuario"
      );
    }
  },

  /**
   * Verificar si el token es válido
   */
  async checkAuth(): Promise<boolean> {
    try {
      await this.getUser();
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Obtener token almacenado
   */
  getToken(): string | null {
    return localStorage.getItem("token");
  },

  /**
   * Obtener rol del usuario
   */
  getUserRole(): UserRole | null {
    return localStorage.getItem("userRole") as UserRole | null;
  },

  /**
   * Verificar si hay un usuario autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};