import React, { useEffect, useState } from "react";
import { Proveedor, ProveedorPayload } from "../proveedores.service";

interface Props {
  mode: "create" | "edit";
  open: boolean;
  proveedor?: Proveedor | null;
  saving: boolean;
  errorMsg?: string | null;
  onClose: () => void;
  onSubmit: (payload: ProveedorPayload) => void;
}

const emptyForm: ProveedorPayload = {
  nombre: "",
  telefono: "",
  contacto: "",
  direccion: "",
};

const ProveedorFormModal: React.FC<Props> = ({
  mode,
  open,
  proveedor,
  saving,
  errorMsg,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<ProveedorPayload>(emptyForm);

  useEffect(() => {
    if (mode === "edit" && proveedor) {
      setForm({
        nombre: proveedor.nombre,
        telefono: proveedor.telefono,
        contacto: proveedor.contacto,
        direccion: proveedor.direccion,
      });
    } else {
      setForm(emptyForm);
    }
  }, [mode, proveedor]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-[#f5ede8] w-[95%] max-w-xl rounded-md shadow-lg border border-gray-400 max-h-[90vh] overflow-y-auto"
      >
        {/* CABECERA */}
        <div className="bg-[#e5ddda] px-6 py-3 rounded-t-md text-center">
          <h2 className="font-semibold text-lg text-gray-800">
            {mode === "create" ? "NUEVO PROVEEDOR" : "EDITAR PROVEEDOR"}
          </h2>
        </div>

        {/* CUERPO */}
        <div className="px-6 py-4 space-y-3">
          {errorMsg && (
            <div className="mb-2 text-sm text-red-600">{errorMsg}</div>
          )}

          {/* Nombre */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm">Nombre:</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              className="border border-gray-400 rounded-sm px-3 py-1.5 text-sm bg-white"
              required
            />
          </div>

          {/* Teléfono */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm">Teléfono:</label>
            <input
              name="telefono"
              value={form.telefono}
              onChange={handleChange}
              className="border border-gray-400 rounded-sm px-3 py-1.5 text-sm bg-white"
              required
            />
          </div>

          {/* Contacto */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm">Contacto:</label>
            <input
              name="contacto"
              value={form.contacto}
              onChange={handleChange}
              className="border border-gray-400 rounded-sm px-3 py-1.5 text-sm bg-white"
              required
            />
          </div>

          {/* Dirección */}
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-sm">Dirección:</label>
            <textarea
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              className="border border-gray-400 rounded-sm px-3 py-1.5 text-sm bg-white resize-none h-20"
              required
            />
          </div>
        </div>

        {/* boton */}
        <div className="px-6 py-3 flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-start">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-sm bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-60"
          >
            {mode === "create"
              ? "Guardar nuevo proveedor"
              : "Guardar cambios"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-sm bg-gray-600 text-white text-sm hover:bg-gray-700"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProveedorFormModal;
