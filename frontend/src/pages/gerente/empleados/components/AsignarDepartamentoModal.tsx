import React, { useEffect, useState } from "react";
import {
  DepartamentoOption,
  Empleado,
} from "../empleados.service";

interface Props {
  open: boolean;
  empleado: Empleado | null;
  departamentosOptions: DepartamentoOption[];
  onClose: () => void;
  onConfirm: (idEmpleado: number, departamentoId: number, observacion: string) => Promise<void>;
}

const AsignarDepartamentoModal: React.FC<Props> = ({
  open,
  empleado,
  departamentosOptions,
  onClose,
  onConfirm,
}) => {
  const [departamentoId, setDepartamentoId] = useState<number | "">("");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [observacion, setObservacion] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;

    setDepartamentoId("");
    setObservacion("");
    const hoy = new Date();
    const dia = hoy.getDate().toString().padStart(2, "0");
    const mes = (hoy.getMonth() + 1).toString().padStart(2, "0");
    const anio = hoy.getFullYear();
    setFechaInicio(`${anio}-${mes}-${dia}`);
  }, [open]);

  if (!open || !empleado) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (departamentoId === "") {
      alert("Selecciona un departamento.");
      return;
    }

    try {
      setSaving(true);
      const obsFinal =
        observacion.trim().length > 0
          ? `${observacion} (Fecha inicio: ${fechaInicio})`
          : `Fecha inicio: ${fechaInicio}`;

      await onConfirm(empleado.idEmpleado, Number(departamentoId), obsFinal);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error al asignar departamento.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[#f5ede8] w-[95%] max-w-xl rounded-md shadow-lg border border-gray-400">
        {/* HEADER */}
        <div className="bg-[#e5ddda] px-6 py-3 rounded-t-md">
          <h2 className="font-semibold text-lg text-center text-gray-800">
            ASIGNAR OTRO DEPARTAMENTO
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 text-sm space-y-3">
          <div>
            <span className="font-semibold">Empleado: </span>
            <span>
              {empleado.persona.nombres} {empleado.persona.paterno}
            </span>
          </div>
          <div>
            <span className="font-semibold">Departamento actual: </span>
            <span>
              {empleado.departamentos[0]?.nombre ?? "Sin asignar"}
            </span>
          </div>

          {/* Nuevo depto */}
          <div>
            <label className="font-semibold block mb-1">
              Nuevo departamento:
            </label>
            <select
              value={departamentoId === "" ? "" : String(departamentoId)}
              onChange={(e) =>
                setDepartamentoId(
                  e.target.value === "" ? "" : Number(e.target.value)
                )
              }
              className="w-full border border-gray-400 rounded-sm px-3 py-1.5 bg-white"
              required
            >
              <option value="">Seleccionar nuevo departamento</option>
              {departamentosOptions.map((d) => (
                <option key={d.idDepartamento} value={d.idDepartamento}>
                  {d.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Fecha inicio */}
          <div>
            <label className="font-semibold block mb-1">
              Fecha de inicio:
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full border border-gray-400 rounded-sm px-3 py-1.5 bg-white"
            />
          </div>

          {/* Observación */}
          <div>
            <label className="font-semibold block mb-1">Observación:</label>
            <textarea
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              className="w-full border border-gray-400 rounded-sm px-3 py-1.5 bg-white min-h-[80px]"
              placeholder="Ingrese observación..."
            />
          </div>

          {/* Botones */}
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
              Confirmar asignación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AsignarDepartamentoModal;
