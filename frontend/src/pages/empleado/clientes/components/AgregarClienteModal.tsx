import React, { useState } from 'react';
import { FiX, FiUserPlus } from 'react-icons/fi';

interface Props {
  open: boolean;
  onClose: () => void;
  onCrearCliente: (clienteData: any) => Promise<boolean>;
}

const AgregarClienteModal: React.FC<Props> = ({ open, onClose, onCrearCliente }) => {
  const [formData, setFormData] = useState({
    ci: '',
    paterno: '',
    materno: '',
    nombres: '',
    fecha_naci: '',
    genero: 'M' as 'M' | 'F' | 'O',
    telefono: '',
    nit: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await onCrearCliente(formData);
    if (success) {
      onClose();
      setFormData({
        ci: '',
        paterno: '',
        materno: '',
        nombres: '',
        fecha_naci: '',
        genero: 'M',
        telefono: '',
        nit: ''
      });
    }
    
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <FiUserPlus className="text-blue-600" />
            <h2 className="text-lg font-semibold">Agregar Cliente</h2>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">CI *</label>
              <input
                type="text"
                name="ci"
                value={formData.ci}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">NIT</label>
              <input
                type="text"
                name="nit"
                value={formData.nit}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nombres *</label>
            <input
              type="text"
              name="nombres"
              value={formData.nombres}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Apellido Paterno *</label>
              <input
                type="text"
                name="paterno"
                value={formData.paterno}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Apellido Materno *</label>
              <input
                type="text"
                name="materno"
                value={formData.materno}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Fecha Nacimiento *</label>
              <input
                type="date"
                name="fecha_naci"
                value={formData.fecha_naci}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Género *</label>
              <select
                name="genero"
                value={formData.genero}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
              >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
                <option value="O">Otro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Teléfono *</label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creando...' : 'Crear Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarClienteModal;