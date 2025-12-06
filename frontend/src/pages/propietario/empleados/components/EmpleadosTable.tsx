import React from "react";
import { FiEye, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import type { EmpleadoResumen } from "../empleados.service";

interface Pagination {
  currentPage: number;
  lastPage: number;
  total: number;
}

interface Props {
  empleados: EmpleadoResumen[];
  loading: boolean;
  error: string | null;

  pagination?: Pagination;          
  onPageChange?: (page: number) => void;

  onVerDesempenio: (empleado: EmpleadoResumen) => void;
}

function formatFecha(fechaIso: string | undefined | null) {
  if (!fechaIso) return "—";
  const soloFecha = fechaIso.slice(0, 10);
  const [anio, mes, dia] = soloFecha.split("-");
  return `${dia}/${mes}/${anio}`;
}

const EmpleadosTable: React.FC<Props> = ({
  empleados,
  loading,
  error,
  pagination,
  onPageChange,
  onVerDesempenio,
}) => {
  const getDepartamentos = (deps: string[]) =>
    deps.length ? deps.join(", ") : "—";

  return (
    <div className="bg-[#f3ebe7] border border-gray-300 rounded-md overflow-hidden">
      <table className="w-full text-xs md:text-sm">
        <thead className="bg-gray-300">
          <tr>
            <th className="px-4 py-2 text-left font-semibold">CI</th>
            <th className="px-4 py-2 text-left font-semibold">Nombre</th>
            <th className="px-4 py-2 text-left font-semibold">Teléfono</th>
            <th className="px-4 py-2 text-left font-semibold">Departamento</th>
            <th className="px-4 py-2 text-left font-semibold">
              Fecha contratación
            </th>
            <th className="px-4 py-2 text-center font-semibold">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td colSpan={6} className="text-center py-6">Cargando...</td>
            </tr>
          )}

          {!loading && error && (
            <tr>
              <td colSpan={6} className="text-center py-6 text-red-600">
                {error}
              </td>
            </tr>
          )}

          {!loading && !error && empleados.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center py-6 text-gray-600">
                No hay empleados.
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            empleados.map((e, idx) => (
              <tr
                key={e.id}
                className={idx % 2 === 0 ? "bg-[#f8f2ee]" : "bg-[#efe4dd]"}
              >
                <td className="px-4 py-2">{e.ci}</td>
                <td className="px-4 py-2">{e.nombre_completo}</td>
                <td className="px-4 py-2">{e.telefono}</td>
                <td className="px-4 py-2">{getDepartamentos(e.departamentos)}</td>
                <td className="px-4 py-2">
                  {formatFecha(e.fecha_contratacion)}
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onVerDesempenio(e)}
                      className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700"
                      title="Ver desempeño"
                    >
                      <FiEye size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* ✅ PAGINACIÓN — mismo diseño que ProveedoresTable */}
      {pagination && onPageChange && (
        <div className="mt-5 flex items-center justify-center gap-4 px-4 py-3">
          <button
            disabled={pagination.currentPage <= 1}
            onClick={() => onPageChange(pagination.currentPage - 1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-sm ${
              pagination.currentPage <= 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-800 hover:bg-gray-100"
            }`}
          >
            <FiChevronLeft />
            <span>Anterior</span>
          </button>

          <span className="text-sm text-gray-700">
            Página {pagination.currentPage} de {pagination.lastPage}
          </span>

          <button
            disabled={pagination.currentPage >= pagination.lastPage}
            onClick={() => onPageChange(pagination.currentPage + 1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-sm ${
              pagination.currentPage >= pagination.lastPage
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white text-gray-800 hover:bg-gray-100"
            }`}
          >
            <span>Siguiente</span>
            <FiChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default EmpleadosTable;