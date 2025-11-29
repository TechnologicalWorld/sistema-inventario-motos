import React from "react";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { Departamento } from "../departamentos.service";

interface Props {
  departamentos: Departamento[];
  loading: boolean;
  error: string | null;
  onVerDetalle: (d: Departamento) => void;
  onEditar: (d: Departamento) => void;
  onEliminar: (d: Departamento) => void;
}

function formatCodigoDepartamento(id: number) {
  return `D-${id.toString().padStart(3, "0")}`;
}

const DepartamentosTable: React.FC<Props> = ({
  departamentos,
  loading,
  error,
  onVerDetalle,
  onEditar,
  onEliminar,
}) => {
  return (
    <div className="bg-[#f3ebe7] border border-gray-300 rounded-md overflow-hidden">
      <table className="w-full text-xs md:text-sm">
        <thead className="bg-gray-300">
          <tr>
            <th className="px-4 py-2 text-left font-semibold">ID</th>
            <th className="px-4 py-2 text-left font-semibold">Nombre</th>
            <th className="px-4 py-2 text-left font-semibold">Nº empleados</th>
            <th className="px-4 py-2 text-left font-semibold">Descripción</th>
            <th className="px-4 py-2 text-center font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-gray-600">
                Cargando departamentos...
              </td>
            </tr>
          )}

          {!loading && error && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-red-600">
                {error}
              </td>
            </tr>
          )}

          {!loading && !error && departamentos.length === 0 && (
            <tr>
              <td colSpan={5} className="py-6 text-center text-gray-600">
                No hay departamentos registrados.
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            departamentos.map((d, idx) => (
              <tr
                key={d.idDepartamento}
                className={idx % 2 === 0 ? "bg-[#f8f2ee]" : "bg-[#efe4dd]"}
              >
                <td className="px-4 py-2">
                  {formatCodigoDepartamento(d.idDepartamento)}
                </td>
                <td className="px-4 py-2">{d.nombre}</td>
                <td className="px-4 py-2">{d.empleados_count}</td>
                <td className="px-4 py-2">
                  {d.descripcion ?? <span className="text-gray-500">—</span>}
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onVerDetalle(d)}
                      className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs hover:bg-indigo-700"
                      title="Ver empleados"
                    >
                      <FiEye />
                    </button>
                    <button
                      onClick={() => onEditar(d)}
                      className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs hover:bg-gray-800"
                      title="Editar departamento"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => onEliminar(d)}
                      className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-xs hover:bg-red-700"
                      title="Eliminar departamento"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default DepartamentosTable;
