import React, { useEffect, useState } from "react";
import { DepartamentoFormPayload, Departamento } from "../departamentos.service";

interface Props {
  open: boolean;
  mode: "create" | "edit";
  departamento?: Departamento | null;
  onClose: () => void;
  onSubmit: (payload: DepartamentoFormPayload) => Promise<void>;
}

const DepartamentoFormModal: React.FC<Props> = ({
  open,
  mode,
  departamento,
  onClose,
  onSubmit,
}) => {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && departamento) {
      setNombre(departamento.nombre);
      setDescripcion(departamento.descripcion ?? "");
    } else {
      setNombre("");
      setDescripcion("");
    }
  }, [open, mode, departamento]);

  if (!open) return null;

  const title =
    mode === "create" ? "NUEVO DEPARTAMENTO" : "EDITAR DEPARTAMENTO";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await onSubmit({
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(
        err?.message ||
          "Ocurrió un error al guardar el departamento (ver consola)."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[#f5ede8] w-[95%] max-w-xl rounded-md shadow-lg border border-gray-400">
        <div className="bg-[#e5ddda] px-6 py-3 rounded-t-md">
          <h2 className="font-semibold text-lg text-center text-gray-800">
            {title}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 text-sm space-y-3">
          <div>
            <label className="font-semibold block mb-1">Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full border border-gray-400 rounded-sm px-3 py-1.5 bg-white"
              required
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Descripción:</label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full border border-gray-400 rounded-sm px-3 py-1.5 bg-white min-h-[80px]"
            />
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-sm bg-gray-500 text-white text-sm hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-sm bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-60"
            >
              {mode === "create"
                ? "Guardar nuevo departamento"
                : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DepartamentoFormModal;
