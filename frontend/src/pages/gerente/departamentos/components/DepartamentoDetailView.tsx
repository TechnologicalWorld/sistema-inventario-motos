import React, { useState } from "react";
import { useDepartamentoDetalle } from "../hooks/useDepartamentoDetalle";
import {
  DepartamentoWithEmpleados,
  EmpleadoDepto,
} from "../departamentos.service";
import { FiEye } from "react-icons/fi";

interface Props {
  departamentoId: number | null;
  onClose: () => void;
}

function formatFecha(fechaIso: string | undefined | null) {
  if (!fechaIso) return "—";
  const d = new Date(fechaIso);
  if (Number.isNaN(d.getTime())) return "—";
  const dia = d.getDate().toString().padStart(2, "0");
  const mes = (d.getMonth() + 1).toString().padStart(2, "0");
  const anio = d.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

function getNombreCompleto(e: EmpleadoDepto) {
  const p = e.persona;
  return `${p.nombres} ${p.paterno} ${p.materno}`.trim();
}

const DepartamentoDetailView: React.FC<Props> = ({ departamentoId, onClose }) => {
  const { departamento, loading, error } =
    useDepartamentoDetalle(departamentoId);
  const [empleadoDetalle, setEmpleadoDetalle] = useState<EmpleadoDepto | null>(
    null
  );

  if (!departamentoId) return null;

  const handleClose = () => {
    setEmpleadoDetalle(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        className="bg-[#f5ede8] w-[95%] max-w-5xl rounded-md shadow-lg border border-gray-400 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} 
      >
        {/* HEADER */}
        <div className="bg-[#e5ddda] px-6 py-3 rounded-t-md flex items-center justify-between">
          <h2 className="font-semibold text-lg text-gray-800">
            {departamento ? `Detalle de Departamento - ${departamento.nombre}` : "Detalle de Departamento"}
          </h2>
          <button
            onClick={handleClose}
            className="px-4 py-1.5 rounded-full bg-gray-600 text-white text-sm hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 py-4 text-sm space-y-4">
          {loading && (
            <p className="text-sm text-gray-600">Cargando detalle...</p>
          )}

          {!loading && error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          {!loading && departamento && (
            <>
              {/* Info del departamento */}
              <div className="border border-gray-300 bg-[#f0e7e2] rounded-md p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-semibold">Descripción: </span>
                    {departamento.descripcion ?? "—"}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Nº de empleados: </span>
                    {departamento.empleados.length}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Estado: </span>Activo
                  </p>
                </div>
              </div>

              {/* Tabla de empleados */}
              <div>
                <h3 className="font-semibold mb-2 text-gray-800">
                  Empleados del Departamento
                </h3>
                <div className="border border-gray-300 rounded-md overflow-hidden bg-[#f3ebe7]">
                  <table className="w-full text-xs md:text-sm">
                    <thead className="bg-gray-300">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold">CI</th>
                        <th className="px-4 py-2 text-left font-semibold">
                          Nombre
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          Email
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          Teléfono
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          Fecha de ingreso
                        </th>
                        <th className="px-4 py-2 text-center font-semibold">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {departamento.empleados.length === 0 && (
                        <tr>
                          <td
                            colSpan={6}
                            className="py-4 text-center text-gray-600"
                          >
                            No hay empleados en este departamento.
                          </td>
                        </tr>
                      )}

                      {departamento.empleados.map((e, idx) => (
                        <tr
                          key={e.idEmpleado}
                          className={
                            idx % 2 === 0 ? "bg-[#f8f2ee]" : "bg-[#efe4dd]"
                          }
                        >
                          <td className="px-4 py-2">{e.persona.ci}</td>
                          <td className="px-4 py-2">{getNombreCompleto(e)}</td>
                          <td className="px-4 py-2">{e.email}</td>
                          <td className="px-4 py-2">{e.persona.telefono}</td>
                          <td className="px-4 py-2">
                            {formatFecha(
                              e.pivot?.fecha ?? e.fecha_contratacion
                            )}
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => setEmpleadoDetalle(e)}
                                className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs hover:bg-indigo-700"
                                title="Ver detalle"
                              >
                                <FiEye />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

      </div>

      {/* Modal interno para detalle de empleado */}
      {empleadoDetalle && departamento && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-60">
          <div className="bg-[#f5ede8] w-[95%] max-w-2xl rounded-md shadow-lg border border-gray-400">
            <div className="bg-[#e5ddda] px-6 py-3 rounded-t-md">
              <h2 className="font-semibold text-lg text-gray-800 text-center">
                DETALLE DE EMPLEADO / {getNombreCompleto(empleadoDetalle)}
              </h2>
            </div>

            <div className="px-6 py-4 text-sm space-y-3">
              <div className="border border-gray-300 bg-[#f0e7e2] rounded-md p-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <div>
                    <span className="font-semibold">Nombre completo: </span>
                    <span>{getNombreCompleto(empleadoDetalle)}</span>
                  </div>
                  <div>
                    <span className="font-semibold">CI: </span>
                    <span>{empleadoDetalle.persona.ci}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Email: </span>
                    <span>{empleadoDetalle.email}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Teléfono: </span>
                    <span>{empleadoDetalle.persona.telefono}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div>
                    <span className="font-semibold">Fecha contratación: </span>
                    <span>
                      {formatFecha(empleadoDetalle.fecha_contratacion)}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Departamento actual: </span>
                    <span>{departamento.nombre}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Estado: </span>
                    <span>Activo</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-gray-800">
                  Historial (simple)
                </h3>
                <div className="border border-gray-300 rounded-md overflow-hidden bg-[#f3ebe7]">
                  <table className="w-full text-xs md:text-sm">
                    <thead className="bg-gray-300">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold">
                          Fecha inicio
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
                      <tr className="bg-[#f8f2ee]">
                        <td className="px-4 py-2">
                          {formatFecha(empleadoDetalle.pivot?.fecha ?? "")}
                        </td>
                        <td className="px-4 py-2">{departamento.nombre}</td>
                        <td className="px-4 py-2">
                          {empleadoDetalle.pivot?.observacion ?? "—"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 flex justify-center">
              <button
                onClick={() => setEmpleadoDetalle(null)}
                className="px-6 py-2 rounded-sm bg-gray-600 text-white text-sm hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartamentoDetailView;