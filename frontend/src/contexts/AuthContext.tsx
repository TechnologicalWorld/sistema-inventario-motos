import React, { createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth/authService";
import type { LoginData, RegisterData, User, UserRole } from "../types/auth";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (credentials: LoginData) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  getRole: () => UserRole | null;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = authService.getToken();
      if (token) {
        const userData = await authService.getUser();
        setUser(userData);
      }
    } catch (error: any) {
      console.log(error);
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginData) => {
    await authService.login(credentials);
    const userData = await authService.getUser();
    setUser(userData);
  };

  const register = async (userData: RegisterData) => {
    await authService.register(userData);
    const user = await authService.getUser();
    setUser(user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    navigate("/login", { replace: true });
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    return rolesArray.includes(user.role);
  };

  const getRole = (): UserRole | null => {
    const rol = authService.getUserRole();
    return rol;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading,
    hasRole,
    getRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};