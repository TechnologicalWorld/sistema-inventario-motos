// src/pages/auth/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { LoginData } from '../../types/auth';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';

export const Login: React.FC = () => {
  const { login, loading } = useAuth();
  const [formData, setFormData] = useState<LoginData>({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(formData);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Brand Section */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-[#95051F] to-[#875260] relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <FiLock className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-bold">Sistema Gestión</h1>
            </div>
            <p className="text-white/80 text-lg leading-relaxed">
              Plataforma integral de gestión empresarial. 
              Controla inventarios, ventas y reportes en un solo lugar.
            </p>
          </div>
          
          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Gestión de inventario inteligente</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Reportes en tiempo real</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Control multi-usuario</span>
            </div>
          </div>
        </div>
        
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-32 right-32 w-24 h-24 border-2 border-white rounded-full"></div>
          <div className="absolute top-40 right-40 w-16 h-16 border-2 border-white rounded-full"></div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 bg-[#E7E1E0]">
        <div className="mx-auto w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#95051F] rounded-2xl">
                <FiLock className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-[#202129]">Sistema Gestión</h1>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-3xl shadow-sm border border-[#D6D4D4] p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#202129]">
                Iniciar Sesión
              </h2>
              <p className="mt-3 text-[#A59DA6]">
                Ingresa tus credenciales para acceder al sistema
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-[#202129] mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-[#A59DA6]" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl placeholder-[#A59DA6] focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent transition-all duration-200"
                    placeholder="ejemplo@empresa.com"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-[#202129] mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-[#A59DA6]" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl placeholder-[#A59DA6] focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent transition-all duration-200"
                    placeholder="Ingresa tu contraseña"
                  />
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-[#95051F] focus:ring-[#95051F] border-[#D6D4D4] rounded"
                  />
                  <span className="ml-2 text-sm text-[#202129]">Recordar sesión</span>
                </label>
                
                <a href="#" className="text-sm font-medium text-[#95051F] hover:text-[#875260] transition-colors">
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-4 px-6 bg-[#95051F] hover:bg-[#870518] text-white font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Iniciando sesión...
                  </>
                ) : (
                  <>
                    Acceder al sistema
                    <FiArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="mt-8 pt-6 border-t border-[#D6D4D4]">
              <p className="text-center text-sm text-[#A59DA6]">
                ¿No tienes una cuenta?{' '}
                <a href="/register" className="font-semibold text-[#95051F] hover:text-[#875260] transition-colors">
                  Solicitar acceso
                </a>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs text-[#A59DA6]">
              © 2024 Sistema de Gestión. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};