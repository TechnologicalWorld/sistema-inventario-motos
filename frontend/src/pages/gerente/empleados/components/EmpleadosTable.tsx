import React from "react";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Empleado } from "../empleados.service";

interface Props {
  empleados: Empleado[];
  loading: boolean;
  error: string | null;
  pagination: { currentPage: number; lastPage: number; total: number };
  onPageChange: (page: number) => void;
  onVerDetalle: (empleado: Empleado) => void;
  onEditar: (empleado: Empleado) => void;
  onEliminar: (empleado: Empleado) => void;
  onAsignarDepto: (empleado: Empleado) => void;
}

function getNombreCompleto(e: Empleado) {
  const p = e.persona;
  return `${p.nombres} ${p.paterno} ${p.materno}`.trim();
}

function getDepartamentoActual(e: Empleado): string {
  if (!e.departamentos || e.departamentos.length === 0) return "—";
  const ordenados = [...e.departamentos].sort((a, b) => {
    const fa = a.pivot?.fecha ?? "";
    const fb = b.pivot?.fecha ?? "";
    return fa < fb ? 1 : fa > fb ? -1 : 0;
  });
  return ordenados[0].nombre;
}

function formatFecha(fechaIso: string | undefined | null) {
  if (!fechaIso) return "—";

  const soloFecha = fechaIso.slice(0, 10); 
  const [anio, mes, dia] = soloFecha.split("-");

  if (!anio || !mes || !dia) return "—";
  return `${dia}/${mes}/${anio}`;
}

const EmpleadosTable: React.FC<Props> = ({
  empleados,
  loading,
  error,
  pagination,
  onPageChange,
  onVerDetalle,
  onEditar,
  onEliminar,
  onAsignarDepto,
}) => {
  return (
    <div className="bg-[#f3ebe7] border border-gray-300 rounded-md overflow-hidden">
      <table className="w-full text-xs md:text-sm">
        <thead className="bg-gray-300">
          <tr>
            <th className="px-4 py-2 text-left font-semibold">CI</th>
            <th className="px-4 py-2 text-left font-semibold">Nombre</th>
            <th className="px-4 py-2 text-left font-semibold">Email</th>
            <th className="px-4 py-2 text-left font-semibold">Teléfono</th>
            <th className="px-4 py-2 text-left font-semibold">
              Departamento actual
            </th>
            <th className="px-4 py-2 text-left font-semibold">
              Fecha contratación
            </th>
            <th className="px-4 py-2 text-center font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={7} className="text-center py-6 text-gray-600">
                Cargando empleados...
              </td>
            </tr>
          )}

          {!loading && error && (
            <tr>
              <td colSpan={7} className="text-center py-6 text-red-600">
                {error}
              </td>
            </tr>
          )}

          {!loading && !error && empleados.length === 0 && (
            <tr>
              <td colSpan={7} className="text-center py-6 text-gray-600">
                No hay empleados registrados.
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            empleados.map((e, idx) => (
              <tr
                key={e.idEmpleado}
                className={idx % 2 === 0 ? "bg-[#f8f2ee]" : "bg-[#efe4dd]"}
              >
                <td className="px-4 py-2">{e.persona.ci}</td>
                <td className="px-4 py-2">{getNombreCompleto(e)}</td>
                <td className="px-4 py-2">{e.email}</td>
                <td className="px-4 py-2">{e.persona.telefono}</td>
                <td className="px-4 py-2">{getDepartamentoActual(e)}</td>
                <td className="px-4 py-2">
                  {formatFecha(e.fecha_contratacion)}
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-center gap-2">
                    {/* Ver detalle */}
                    <button
                      onClick={() => onVerDetalle(e)}
                      className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs hover:bg-indigo-700"
                      title="Ver detalle"
                    >
                      <FiEye />
                    </button>

                    {/* Editar */}
                    <button
                      onClick={() => onEditar(e)}
                      className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs hover:bg-gray-800"
                      title="Editar"
                    >
                      <FiEdit2 />
                    </button>

                    {/* Asignar departamento */}
                    <button
                      onClick={() => onAsignarDepto(e)}
                      className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-xs hover:bg-green-700"
                      title="Asignar departamento"
                    >
                      {/* iconito simple: una D (dept) */}
                      D
                    </button>

                    {/* Eliminar */}
                    <button
                      onClick={() => onEliminar(e)}
                      className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-xs hover:bg-red-700"
                      title="Eliminar"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="flex items-center justify-center gap-4 px-4 py-3">
        <button
          disabled={pagination.currentPage <= 1}
          onClick={() => onPageChange(pagination.currentPage - 1)}
          className="px-4 py-1.5 rounded-md bg-[#c0163b] text-white text-sm hover:bg-[#a41333] disabled:opacity-50"
        >
          Anterior
        </button>
        <span className="text-sm text-gray-700">
          Página {pagination.currentPage} de {pagination.lastPage}
        </span>
        <button
          disabled={pagination.currentPage >= pagination.lastPage}
          onClick={() => onPageChange(pagination.currentPage + 1)}
          className="px-4 py-1.5 rounded-md bg-[#c0163b] text-white text-sm hover:bg-[#a41333] disabled:opacity-50"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default EmpleadosTable;
