// empresa/components/EmpresaEditModal.tsx
import React, { useState } from "react";
import { Empresa, EmpresaUpdatePayload } from "../empresa.service";

interface Props {
  empresa: Empresa;
  open: boolean;
  onClose: () => void;
  onSave: (data: EmpresaUpdatePayload) => Promise<{ success: boolean; message: string }>;
}

const EmpresaEditModal: React.FC<Props> = ({ empresa, open, onClose, onSave }) => {
  const [formData, setFormData] = useState<EmpresaUpdatePayload>({
    nombre: empresa.nombre,
    telefono: empresa.telefono,
    mision: empresa.mision,
    vision: empresa.vision,
    logo: empresa.logo || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await onSave(formData);
    if (result.success) {
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[#f5ede8] w-full max-w-2xl rounded-md shadow-lg border border-gray-400 max-h-[90vh] overflow-y-auto">
        {/* CABECERA */}
        <div className="bg-[#e5ddda] px-6 py-3 rounded-t-md text-left">
          <h2 className="font-semibold text-lg text-gray-800">EDITAR DATOS DE LA EMPRESA</h2>
        </div>

        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nombres</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contacto</label>
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/*<div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="ejemplo@empresa.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>*/}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Misión</label>
            <textarea
              name="mision"
              value={formData.mision}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Visión</label>
            <textarea
              name="vision"
              value={formData.vision}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logo (Slogan)</label>
            <input
              type="text"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              placeholder="Ej: LOGOEMPRESARIAL"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* BOTONES */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm transition"
            >
              Guardar cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmpresaEditModal;