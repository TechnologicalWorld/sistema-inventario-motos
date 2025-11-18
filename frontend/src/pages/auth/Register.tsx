// src/pages/auth/Register.tsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { RegisterData } from '../../types/auth';
import { FiMail, FiLock, FiUser, FiPhone, FiMapPin, FiCalendar, FiArrowRight, FiSquare, FiArrowLeft } from 'react-icons/fi';

export const Register: React.FC = () => {
  const { register, loading } = useAuth();
  const [error, setError] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<RegisterData>({
    ci: '',
    paterno: '',
    materno: '',
    nombres: '',
    fecha_naci: '',
    genero: 'M',
    telefono: '',
    role: 'empleado',
    email: '',
    password: '',
    direccion: '',
    fecha_contratacion: ''
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    
    try {
      await register(formData);
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const nextStep = () => {
    // Validar campos del paso actual antes de avanzar
    if (currentStep === 1) {
      if (!formData.ci || !formData.paterno || !formData.materno || !formData.nombres || !formData.fecha_naci || !formData.telefono) {
        setError('Por favor completa todos los campos requeridos');
        return;
      }
    } else if (currentStep === 2) {
      if (!formData.role || !formData.email) {
        setError('Por favor completa todos los campos requeridos');
        return;
      }
    }
    setError('');
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setError('');
    setCurrentStep(prev => prev - 1);
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
                <FiSquare className="h-8 w-8" />
              </div>
              <h1 className="text-2xl font-bold">Sistema Gestión</h1>
            </div>
            <p className="text-white/80 text-lg leading-relaxed">
              Únete a nuestra plataforma de gestión empresarial. 
              Crea tu cuenta y comienza a optimizar tus procesos.
            </p>
          </div>
          
          <div className="space-y-4 mt-8">
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Gestión centralizada</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Reportes automatizados</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="w-2 h-2 bg-white rounded-full"></div>
              <span>Acceso multi-rol seguro</span>
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

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-20 bg-[#E7E1E0] overflow-y-auto">
        <div className="mx-auto w-full max-w-2xl">
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[#95051F] rounded-2xl">
                <FiSquare className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-[#202129]">Sistema Gestión</h1>
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-3xl shadow-sm border border-[#D6D4D4] p-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#202129]">
                Crear Cuenta
              </h2>
              <p className="mt-3 text-[#A59DA6]">
                Completa la información para registrar un nuevo usuario
              </p>
              
              {/* Progress Steps */}
              <div className="flex justify-center mt-6 mb-2">
                <div className="flex items-center">
                  {[1, 2, 3].map((step) => (
                    <React.Fragment key={step}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        step === currentStep 
                          ? 'bg-[#95051F] text-white' 
                          : step < currentStep 
                            ? 'bg-[#875260] text-white'
                            : 'bg-[#E7E1E0] text-[#A59DA6]'
                      }`}>
                        {step}
                      </div>
                      {step < 3 && (
                        <div className={`w-12 h-1 mx-2 ${
                          step < currentStep ? 'bg-[#875260]' : 'bg-[#D6D4D4]'
                        }`}></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="text-sm text-[#A59DA6]">
                {currentStep === 1 && 'Información Personal'}
                {currentStep === 2 && 'Datos de Contacto'}
                {currentStep === 3 && 'Credenciales'}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
                  {error}
                </div>
              )}

              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#202129] mb-2">
                        Cédula de Identidad *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FiUser className="h-5 w-5 text-[#A59DA6]" />
                        </div>
                        <input
                          name="ci"
                          type="text"
                          required
                          value={formData.ci}
                          onChange={handleInputChange}
                          className="block w-full pl-12 pr-4 py-4 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl placeholder-[#A59DA6] focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent transition-all duration-200"
                          placeholder="12345678"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#202129] mb-2">
                        Género *
                      </label>
                      <div className="relative">
                        <select
                          name="genero"
                          required
                          value={formData.genero}
                          onChange={handleInputChange}
                          className="block w-full pl-4 pr-4 py-4 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl text-[#202129] focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent transition-all duration-200 appearance-none"
                        >
                          <option value="M">Masculino</option>
                          <option value="F">Femenino</option>
                          <option value="O">Otro</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <FiUser className="h-5 w-5 text-[#A59DA6]" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#202129] mb-2">
                        Apellido Paterno *
                      </label>
                      <input
                        name="paterno"
                        type="text"
                        required
                        value={formData.paterno}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-4 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl placeholder-[#A59DA6] focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent transition-all duration-200"
                        placeholder="Pérez"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#202129] mb-2">
                        Apellido Materno *
                      </label>
                      <input
                        name="materno"
                        type="text"
                        required
                        value={formData.materno}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-4 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl placeholder-[#A59DA6] focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent transition-all duration-200"
                        placeholder="Gómez"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-[#202129] mb-2">
                        Nombres Completos *
                      </label>
                      <input
                        name="nombres"
                        type="text"
                        required
                        value={formData.nombres}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-4 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl placeholder-[#A59DA6] focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent transition-all duration-200"
                        placeholder="Juan Carlos"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#202129] mb-2">
                        Fecha de Nacimiento *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FiCalendar className="h-5 w-5 text-[#A59DA6]" />
                        </div>
                        <input
                          name="fecha_naci"
                          type="date"
                          required
                          value={formData.fecha_naci}
                          onChange={handleInputChange}
                          className="block w-full pl-12 pr-4 py-4 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl text-[#202129] focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#202129] mb-2">
                        Teléfono *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FiPhone className="h-5 w-5 text-[#A59DA6]" />
                        </div>
                        <input
                          name="telefono"
                          type="tel"
                          required
                          value={formData.telefono}
                          onChange={handleInputChange}
                          className="block w-full pl-12 pr-4 py-4 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl placeholder-[#A59DA6] focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent transition-all duration-200"
                          placeholder="+591 12345678"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Contact & Role Information */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-[#202129] mb-2">
                        Rol en el Sistema *
                      </label>
                      <select
                        name="role"
                        required
                        value={formData.role}
                        onChange={handleInputChange}
                        className="block w-full px-4 py-4 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl text-[#202129] focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent transition-all duration-200 appearance-none"
                      >
                        <option value="gerente">Gerente</option>
                        <option value="empleado">Empleado</option>
                        <option value="propietario">Propietario</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-[#202129] mb-2">
                        Correo Electrónico *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FiMail className="h-5 w-5 text-[#A59DA6]" />
                        </div>
                        <input
                          name="email"
                          type="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="block w-full pl-12 pr-4 py-4 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl placeholder-[#A59DA6] focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent transition-all duration-200"
                          placeholder="usuario@empresa.com"
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-[#202129] mb-2">
                        Dirección
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FiMapPin className="h-5 w-5 text-[#A59DA6]" />
                        </div>
                        <input
                          name="direccion"
                          type="text"
                          value={formData.direccion}
                          onChange={handleInputChange}
                          className="block w-full pl-12 pr-4 py-4 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl placeholder-[#A59DA6] focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent transition-all duration-200"
                          placeholder="Av. Principal #123"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#202129] mb-2">
                        Fecha de Contratación
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FiCalendar className="h-5 w-5 text-[#A59DA6]" />
                        </div>
                        <input
                          name="fecha_contratacion"
                          type="date"
                          value={formData.fecha_contratacion}
                          onChange={handleInputChange}
                          className="block w-full pl-12 pr-4 py-4 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl text-[#202129] focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Credentials */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#202129] mb-2">
                        Contraseña *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <FiLock className="h-5 w-5 text-[#A59DA6]" />
                        </div>
                        <input
                          name="password"
                          type="password"
                          required
                          value={formData.password}
                          onChange={handleInputChange}
                          className="block w-full pl-12 pr-4 py-4 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl placeholder-[#A59DA6] focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent transition-all duration-200"
                          placeholder="Mínimo 8 caracteres"
                        />
                      </div>
                    </div>

                    <div className="bg-[#E7E1E0] p-4 rounded-xl border border-[#D6D4D4]">
                      <h4 className="font-semibold text-[#202129] mb-2">Requisitos de contraseña:</h4>
                      <ul className="text-sm text-[#A59DA6] space-y-1">
                        <li>• Mínimo 8 caracteres</li>
                        <li>• Letras y números</li>
                        <li>• No usar información personal</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-[#D6D4D4]">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="flex items-center px-6 py-3 text-[#95051F] font-semibold rounded-xl border border-[#95051F] hover:bg-[#95051F] hover:text-white transition-all duration-200"
                  >
                    <FiArrowLeft className="mr-2 h-5 w-5" />
                    Anterior
                  </button>
                ) : (
                  <a 
                    href="/login" 
                    className="flex items-center px-6 py-3 text-[#95051F] font-semibold rounded-xl border border-[#95051F] hover:bg-[#95051F] hover:text-white transition-all duration-200"
                  >
                    <FiArrowLeft className="mr-2 h-5 w-5" />
                    Volver al Login
                  </a>
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center px-6 py-3 bg-[#95051F] text-white font-semibold rounded-xl hover:bg-[#870518] transition-all duration-200"
                  >
                    Siguiente
                    <FiArrowRight className="ml-2 h-5 w-5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-6 py-3 bg-[#95051F] text-white font-semibold rounded-xl hover:bg-[#870518] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Registrando...
                      </>
                    ) : (
                      <>
                        Completar Registro
                        <FiArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
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