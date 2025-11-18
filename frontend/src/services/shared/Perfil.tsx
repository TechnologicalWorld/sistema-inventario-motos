// src/pages/shared/Perfil.tsx
import React, { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiEdit2, FiLock, FiSave, FiX } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';

export const Perfil: React.FC = () => {
  const { user, getRole } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Datos del usuario - en un proyecto real vendrían de la API
  const userData = {
    nombres: user?.persona?.nombres || 'Nombre',
    paterno: user?.persona?.paterno || 'Apellido',
    materno: user?.persona?.materno || 'Materno',
    ci: user?.persona?.ci || '12345678',
    fechaNacimiento: user?.persona?.fecha_naci || '1990-01-01',
    genero: user?.persona?.genero === 'M' ? 'Masculino' : user?.persona?.genero === 'F' ? 'Femenino' : 'Otro',
    telefono: user?.persona?.telefono || '+591 12345678',
    email: user?.email || 'usuario@empresa.com',
    direccion: user?.direccion || 'Av. Principal #123',
    fechaContratacion: user?.fecha_contratacion || '2020-01-01',
    rol: getRole() === 'gerente' ? 'Gerente' : 
         getRole() === 'empleado' ? 'Empleado' : 
         getRole() === 'propietario' ? 'Propietario' : 'Usuario'
  };

  const getInitials = () => {
    return `${userData.nombres.charAt(0)}${userData.paterno.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#D6D4D4] p-6">
        <h1 className="text-2xl font-bold text-[#202129]">Mi Perfil</h1>
        <p className="text-[#A59DA6] mt-1">Gestiona tu información personal y configuración de cuenta</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda - Tarjeta de Usuario */}
        <div className="lg:col-span-1 space-y-6">
          {/* Tarjeta de Información del Usuario */}
          <div className="bg-white rounded-2xl shadow-sm border border-[#D6D4D4] p-6 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-[#95051F] to-[#875260] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              {getInitials()}
            </div>
            
            <h2 className="text-xl font-bold text-[#202129]">
              {userData.nombres} {userData.paterno}
            </h2>
            
            <div className="inline-flex items-center gap-2 bg-[#E7E1E0] px-3 py-1 rounded-full mt-2">
              <FiUser className="text-[#95051F] text-sm" />
              <span className="text-sm font-medium text-[#202129] capitalize">{userData.rol}</span>
            </div>

            <div className="space-y-3 mt-6 text-left">
              <div className="flex items-center gap-3 text-[#202129]">
                <FiPhone className="text-[#A59DA6] text-lg" />
                <span className="text-sm">{userData.telefono}</span>
              </div>
              
              <div className="flex items-center gap-3 text-[#202129]">
                <FiMail className="text-[#A59DA6] text-lg" />
                <span className="text-sm break-all">{userData.email}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 w-full bg-[#95051F] text-white py-3 px-4 rounded-xl hover:bg-[#870518] transition-colors duration-200 font-medium"
              >
                <FiEdit2 className="text-lg" />
                Editar Perfil
              </button>
              
              <button
                onClick={() => setShowChangePassword(true)}
                className="flex items-center justify-center gap-2 w-full border border-[#95051F] text-[#95051F] py-3 px-4 rounded-xl hover:bg-[#95051F] hover:text-white transition-colors duration-200 font-medium"
              >
                <FiLock className="text-lg" />
                Cambiar Contraseña
              </button>
            </div>
          </div>
        </div>

        {/* Columna Derecha - Datos Personales */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-[#D6D4D4] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#202129]">Datos Personales</h2>
              {isEditing && (
                <div className="flex gap-2">
                  <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                    <FiSave className="text-sm" />
                    Guardar
                  </button>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <FiX className="text-sm" />
                    Cancelar
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información Básica */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-[#202129] border-b border-[#D6D4D4] pb-2">
                  Información Básica
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#202129] mb-2">Nombres</label>
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={userData.nombres}
                        className="w-full px-4 py-3 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-[#E7E1E0] rounded-xl text-[#202129]">{userData.nombres}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#202129] mb-2">Apellido Paterno</label>
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={userData.paterno}
                        className="w-full px-4 py-3 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-[#E7E1E0] rounded-xl text-[#202129]">{userData.paterno}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#202129] mb-2">Apellido Materno</label>
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={userData.materno}
                        className="w-full px-4 py-3 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-[#E7E1E0] rounded-xl text-[#202129]">{userData.materno}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Información de Contacto */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-[#202129] border-b border-[#D6D4D4] pb-2">
                  Información de Contacto
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#202129] mb-2">Cédula de Identidad</label>
                    <p className="px-4 py-3 bg-[#E7E1E0] rounded-xl text-[#202129]">{userData.ci}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#202129] mb-2">Fecha de Nacimiento</label>
                    {isEditing ? (
                      <input
                        type="date"
                        defaultValue={userData.fechaNacimiento}
                        className="w-full px-4 py-3 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-[#E7E1E0] rounded-xl text-[#202129]">
                        {new Date(userData.fechaNacimiento).toLocaleDateString('es-ES')}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#202129] mb-2">Género</label>
                    {isEditing ? (
                      <select
                        defaultValue={userData.genero}
                        className="w-full px-4 py-3 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent"
                      >
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                      </select>
                    ) : (
                      <p className="px-4 py-3 bg-[#E7E1E0] rounded-xl text-[#202129]">{userData.genero}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Información Adicional */}
              <div className="md:col-span-2 space-y-6">
                <h3 className="text-lg font-semibold text-[#202129] border-b border-[#D6D4D4] pb-2">
                  Información Adicional
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#202129] mb-2">Dirección</label>
                    {isEditing ? (
                      <input
                        type="text"
                        defaultValue={userData.direccion}
                        className="w-full px-4 py-3 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center gap-3 px-4 py-3 bg-[#E7E1E0] rounded-xl text-[#202129]">
                        <FiMapPin className="text-[#A59DA6] flex-shrink-0" />
                        <span>{userData.direccion}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#202129] mb-2">Fecha de Contratación</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-[#E7E1E0] rounded-xl text-[#202129]">
                      <FiCalendar className="text-[#A59DA6] flex-shrink-0" />
                      <span>{new Date(userData.fechaContratacion).toLocaleDateString('es-ES')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Cambiar Contraseña */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-lg border border-[#D6D4D4] p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-[#202129] mb-4">Cambiar Contraseña</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#202129] mb-2">Contraseña Actual</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent"
                  placeholder="Ingresa tu contraseña actual"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#202129] mb-2">Nueva Contraseña</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent"
                  placeholder="Ingresa tu nueva contraseña"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#202129] mb-2">Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent"
                  placeholder="Confirma tu nueva contraseña"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button className="flex-1 bg-[#95051F] text-white py-3 px-4 rounded-xl hover:bg-[#870518] transition-colors duration-200 font-medium">
                Actualizar Contraseña
              </button>
              <button 
                onClick={() => setShowChangePassword(false)}
                className="flex-1 border border-[#95051F] text-[#95051F] py-3 px-4 rounded-xl hover:bg-[#95051F] hover:text-white transition-colors duration-200 font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};