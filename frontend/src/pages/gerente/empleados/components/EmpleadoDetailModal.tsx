import React from "react";
import { Empleado } from "../empleados.service";

interface Props {
  open: boolean;
  empleado: Empleado | null;
  onClose: () => void;
}

function formatFecha(fechaIso: string | undefined | null) {
  if (!fechaIso) return "—";

  const soloFecha = fechaIso.slice(0, 10); 
  const [anio, mes, dia] = soloFecha.split("-");

  if (!anio || !mes || !dia) return "—";
  return `${dia}/${mes}/${anio}`;
}

function getNombreCompleto(e: Empleado) {
  const p = e.persona;
  return `${p.nombres} ${p.paterno} ${p.materno}`.trim();
}

const EmpleadoDetailModal: React.FC<Props> = ({ open, empleado, onClose }) => {
  if (!open || !empleado) return null;

  const historial = [...(empleado.departamentos || [])].sort((a, b) => {
    const fa = a.pivot?.fecha ?? "";
    const fb = b.pivot?.fecha ?? "";
    return fa > fb ? -1 : fa < fb ? 1 : 0;
  });

  const deptActual = historial[0]?.nombre ?? "—";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[#f5ede8] w-[95%] max-w-2xl rounded-md shadow-lg border border-gray-400 max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="bg-[#e5ddda] px-6 py-3 rounded-t-md">
          <h2 className="font-semibold text-lg text-gray-800 text-center">
            DETALLE DE EMPLEADO / {getNombreCompleto(empleado).toUpperCase()}
          </h2>
        </div>

        {/* BODY */}
        <div className="px-6 py-4 text-sm space-y-4">
          {/* Info principal */}
          <div className="border border-gray-300 bg-[#f0e7e2] rounded-md p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <div>
                <span className="font-semibold">Nombre completo: </span>
                <span>{getNombreCompleto(empleado)}</span>
              </div>
              <div>
                <span className="font-semibold">CI: </span>
                <span>{empleado.persona.ci}</span>
              </div>
              <div>
                <span className="font-semibold">Email: </span>
                <span>{empleado.email}</span>
              </div>
              <div>
                <span className="font-semibold">Teléfono: </span>
                <span>{empleado.persona.telefono}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div>
                <span className="font-semibold">Fecha contratación: </span>
                <span>{formatFecha(empleado.fecha_contratacion)}</span>
              </div>
              <div>
                <span className="font-semibold">Departamento actual: </span>
                <span>{deptActual}</span>
              </div>
              <div>
                <span className="font-semibold">Estado: </span>
                <span>Activo</span>
              </div>
            </div>
          </div>

          {/* Historial de departamentos */}
          <div>
            <h3 className="font-semibold mb-2 text-gray-800">Historial</h3>
            <div className="border border-gray-300 rounded-md overflow-hidden bg-[#f3ebe7]">
              <table className="w-full text-xs md:text-sm">
                <thead className="bg-gray-300">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">
                      Fecha de asignación
                    </th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Departamento
                    </th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Observación
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {historial.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="py-4 text-center text-gray-600"
                      >
                        No hay historial de departamentos.
                      </td>
                    </tr>
                  )}

                  {historial.map((d, idx) => (
                    <tr
                      key={`${d.idDepartamento}-${idx}`}
                      className={
                        idx % 2 === 0 ? "bg-[#f8f2ee]" : "bg-[#efe4dd]"
                      }
                    >
                      <td className="px-4 py-2">
                        {formatFecha(d.pivot?.fecha ?? "")}
                      </td>
                      <td className="px-4 py-2">{d.nombre}</td>
                      <td className="px-4 py-2">
                        {d.pivot?.observacion ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-3 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-sm bg-gray-600 text-white text-sm hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmpleadoDetailModal;
