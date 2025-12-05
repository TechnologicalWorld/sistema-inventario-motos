import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiCalendar, FiMapPin, FiEdit2, FiLock, FiSave, FiX, FiAlertCircle } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

export const Perfil: React.FC = () => {
  const { user, getRole } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    nombres: '',
    paterno: '',
    materno: '',
    ci: '',
    fechaNacimiento: '',
    genero: 'M',
    telefono: '',
    email: '',
    direccion: '',
    fechaContratacion: '',
    rol: ''
  });

  const [passwordData, setPasswordData] = useState({
    password_actual: '',
    nuevo_password: '',
    nuevo_password_confirmation: ''
  });

  const formatDateFromBackend = (dateString: string): string => {
    if (!dateString) return '';
    // Extraer solo la parte de la fecha (yyyy-MM-dd)
    return dateString.split('T')[0].split(' ')[0];
  };

  useEffect(() => {
    if (user?.persona) {
      setFormData({
        nombres: user.persona.nombres || '',
        paterno: user.persona.paterno || '',
        materno: user.persona.materno || '',
        ci: user.persona.ci || '',
        fechaNacimiento: formatDateFromBackend(user.persona.fecha_naci || ''),
        genero: user.persona.genero || 'M',
        telefono: user.persona.telefono || '',
        email: user.email || '',
        direccion: user.direccion || '',
        fechaContratacion: formatDateFromBackend(user.fecha_contratacion || ''),
        rol: getRole() === 'gerente' ? 'Gerente' : 
             getRole() === 'empleado' ? 'Empleado' : 
             getRole() === 'propietario' ? 'Propietario' : 'Usuario'
      });
    }
  }, [user, getRole]);

  const getInitials = () => {
    return `${formData.nombres.charAt(0)}${formData.paterno.charAt(0)}`.toUpperCase();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getGeneroValue = (generoText: string): string => {
    if (generoText === 'Masculino' || generoText === 'M') return 'M';
    if (generoText === 'Femenino' || generoText === 'F') return 'F';
    return 'O';
  };

  const formatDateForBackend = (dateString: string): string => {
    if (!dateString) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const dataToSend = {
        paterno: formData.paterno,
        materno: formData.materno,
        nombres: formData.nombres,
        fecha_naci: formatDateForBackend(formData.fechaNacimiento),
        genero: getGeneroValue(formData.genero),
        telefono: formData.telefono
      };

      console.log('Datos a enviar:', dataToSend); 

      const response = await api.put('/perfil/datos-personales', dataToSend);
      
      if (response.data.success) {
        setSuccess('Perfil actualizado correctamente');
        setIsEditing(false);
        
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      console.error('Error al guardar:', err);
      
      if (err.response?.data?.errors) {
        const errors = Object.values(err.response.data.errors).flat();
        setError(errors.join(', '));
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Error al actualizar el perfil');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    if (user?.persona) {
      setFormData({
        nombres: user.persona.nombres || '',
        paterno: user.persona.paterno || '',
        materno: user.persona.materno || '',
        ci: user.persona.ci || '',
        fechaNacimiento: formatDateFromBackend(user.persona.fecha_naci || ''),
        genero: user.persona.genero || 'M',
        telefono: user.persona.telefono || '',
        email: user.email || '',
        direccion: user.direccion || '',
        fechaContratacion: formatDateFromBackend(user.fecha_contratacion || ''),
        rol: getRole() === 'gerente' ? 'Gerente' : 
             getRole() === 'empleado' ? 'Empleado' : 
             getRole() === 'propietario' ? 'Propietario' : 'Usuario'
      });
    }
    setIsEditing(false);
    setError(null);
  };

  const handleChangePassword = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    if (!passwordData.password_actual) {
      setError('Debes ingresar tu contraseña actual');
      setLoading(false);
      return;
    }

    if (passwordData.nuevo_password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    if (passwordData.nuevo_password !== passwordData.nuevo_password_confirmation) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      const response = await api.put('/perfil/cambiar-password', {
        password_actual: passwordData.password_actual,
        nuevo_password: passwordData.nuevo_password,
        nuevo_password_confirmation: passwordData.nuevo_password_confirmation
      });
      
      if (response.data.success) {
        setSuccess('Contraseña actualizada correctamente');
        setShowChangePassword(false);
        setPasswordData({ 
          password_actual: '', 
          nuevo_password: '', 
          nuevo_password_confirmation: '' 
        });
        
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      console.error('Error al cambiar contraseña:', err);
      
      if (err.response?.data?.errors) {
        const errors = Object.values(err.response.data.errors).flat();
        setError(errors.join(', '));
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError('Error al cambiar la contraseña');
      }
    } finally {
      setLoading(false);
    }
  };

  const getGeneroDisplay = (genero: string): string => {
    if (genero === 'M') return 'Masculino';
    if (genero === 'F') return 'Femenino';
    return 'Otro';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Mensajes de éxito y error */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl flex items-center gap-2">
          <FiAlertCircle className="text-lg" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex items-center gap-2">
          <FiAlertCircle className="text-lg" />
          <span>{error}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#D6D4D4] p-6">
        <h1 className="text-2xl font-bold text-[#202129]">Mi Perfil</h1>
        <p className="text-[#A59DA6] mt-1">Gestiona tu información personal y configuración de cuenta</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda - Tarjeta de Usuario */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-[#D6D4D4] p-6 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-[#95051F] to-[#875260] rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              {getInitials()}
            </div>
            
            <h2 className="text-xl font-bold text-[#202129]">
              {formData.nombres} {formData.paterno}
            </h2>
            
            <div className="inline-flex items-center gap-2 bg-[#E7E1E0] px-3 py-1 rounded-full mt-2">
              <FiUser className="text-[#95051F] text-sm" />
              <span className="text-sm font-medium text-[#202129] capitalize">{formData.rol}</span>
            </div>

            <div className="space-y-3 mt-6 text-left">
              <div className="flex items-center gap-3 text-[#202129]">
                <FiPhone className="text-[#A59DA6] text-lg" />
                <span className="text-sm">{formData.telefono}</span>
              </div>
              
              <div className="flex items-center gap-3 text-[#202129]">
                <FiMail className="text-[#A59DA6] text-lg" />
                <span className="text-sm break-all">{formData.email}</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={() => setIsEditing(true)}
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full bg-[#95051F] text-white py-3 px-4 rounded-xl hover:bg-[#870518] transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiEdit2 className="text-lg" />
                Editar Perfil
              </button>
              
              <button
                onClick={() => setShowChangePassword(true)}
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full border border-[#95051F] text-[#95051F] py-3 px-4 rounded-xl hover:bg-[#95051F] hover:text-white transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <button 
                    onClick={handleSaveProfile}
                    disabled={loading}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiSave className="text-sm" />
                    {loading ? 'Guardando...' : 'Guardar'}
                  </button>
                  <button 
                    onClick={handleCancelEdit}
                    disabled={loading}
                    className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                        name="nombres"
                        value={formData.nombres}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-[#E7E1E0] rounded-xl text-[#202129]">{formData.nombres}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#202129] mb-2">Apellido Paterno</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="paterno"
                        value={formData.paterno}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-[#E7E1E0] rounded-xl text-[#202129]">{formData.paterno}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#202129] mb-2">Apellido Materno</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="materno"
                        value={formData.materno}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-[#E7E1E0] rounded-xl text-[#202129]">{formData.materno}</p>
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
                    <p className="px-4 py-3 bg-[#E7E1E0] rounded-xl text-[#202129]">{formData.ci}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#202129] mb-2">Fecha de Nacimiento</label>
                    {isEditing ? (
                      <input
                        type="date"
                        name="fechaNacimiento"
                        value={formData.fechaNacimiento}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-[#E7E1E0] rounded-xl text-[#202129]">
                        {formData.fechaNacimiento ? new Date(formData.fechaNacimiento).toLocaleDateString('es-ES') : '-'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#202129] mb-2">Género</label>
                    {isEditing ? (
                      <select
                        name="genero"
                        value={formData.genero}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent"
                      >
                        <option value="M">Masculino</option>
                        <option value="F">Femenino</option>
                        <option value="O">Otro</option>
                      </select>
                    ) : (
                      <p className="px-4 py-3 bg-[#E7E1E0] rounded-xl text-[#202129]">{getGeneroDisplay(formData.genero)}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#202129] mb-2">Teléfono</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent"
                      />
                    ) : (
                      <p className="px-4 py-3 bg-[#E7E1E0] rounded-xl text-[#202129]">{formData.telefono}</p>
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
                    <label className="block text-sm font-medium text-[#202129] mb-2">Email</label>
                    <div className="flex items-center gap-3 px-4 py-3 bg-[#E7E1E0] rounded-xl text-[#202129]">
                      <FiMail className="text-[#A59DA6] flex-shrink-0" />
                      <span>{formData.email}</span>
                    </div>
                  </div>

                  {formData.fechaContratacion && (
                    <div>
                      <label className="block text-sm font-medium text-[#202129] mb-2">Fecha de Contratación</label>
                      <div className="flex items-center gap-3 px-4 py-3 bg-[#E7E1E0] rounded-xl text-[#202129]">
                        <FiCalendar className="text-[#A59DA6] flex-shrink-0" />
                        <span>{new Date(formData.fechaContratacion).toLocaleDateString('es-ES')}</span>
                      </div>
                    </div>
                  )}
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
                  value={passwordData.password_actual}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, password_actual: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent"
                  placeholder="Ingresa tu contraseña actual"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#202129] mb-2">Nueva Contraseña</label>
                <input
                  type="password"
                  value={passwordData.nuevo_password}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, nuevo_password: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent"
                  placeholder="Ingresa tu nueva contraseña (mín. 6 caracteres)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#202129] mb-2">Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  value={passwordData.nuevo_password_confirmation}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, nuevo_password_confirmation: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#E7E1E0] border border-[#D6D4D4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#95051F] focus:border-transparent"
                  placeholder="Confirma tu nueva contraseña"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button 
                onClick={handleChangePassword}
                disabled={loading}
                className="flex-1 bg-[#95051F] text-white py-3 px-4 rounded-xl hover:bg-[#870518] transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Actualizando...' : 'Actualizar Contraseña'}
              </button>
              <button 
                onClick={() => {
                  setShowChangePassword(false);
                  setPasswordData({ 
                    password_actual: '', 
                    nuevo_password: '', 
                    nuevo_password_confirmation: '' 
                  });
                  setError(null);
                }}
                disabled={loading}
                className="flex-1 border border-[#95051F] text-[#95051F] py-3 px-4 rounded-xl hover:bg-[#95051F] hover:text-white transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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