import React from "react";
import { FiEye, FiEdit2, FiTrash } from "react-icons/fi";
import { Proveedor } from "../proveedores.service";

interface Props {
  proveedores: Proveedor[];
  loading: boolean;
  error: string | null;
  pagination: { currentPage: number; lastPage: number; total: number };
  onPageChange: (page: number) => void;
  onVerDetalle: (p: Proveedor) => void;
  onEditar: (p: Proveedor) => void;
  onEliminar: (p: Proveedor) => void;
}

const ProveedoresTable: React.FC<Props> = ({
  proveedores,
  loading,
  error,
  pagination,
  onPageChange,
  onVerDetalle,
  onEditar,
  onEliminar,
}) => {
  return (
    <div className="bg-[#f3ebe7] border border-gray-300 rounded-md overflow-hidden">
      <table className="w-full text-xs md:text-sm">
        <thead className="bg-gray-300">
          <tr>
            <th className="px-4 py-2 text-left font-semibold">id Proveedor</th>
            <th className="px-4 py-2 text-left font-semibold">Nombre</th>
            <th className="px-4 py-2 text-left font-semibold">Contacto</th>
            <th className="px-4 py-2 text-left font-semibold">Teléfono</th>
            <th className="px-4 py-2 text-left font-semibold">Dirección</th>
            <th className="px-4 py-2 text-left font-semibold">Nº compras</th>
            <th className="px-4 py-2 text-left font-semibold">
              Total Comprado
            </th>
            <th className="px-4 py-2 text-center font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td
                colSpan={8}
                className="text-center py-6 text-gray-600"
              >
                Cargando proveedores...
              </td>
            </tr>
          )}

          {!loading && error && (
            <tr>
              <td
                colSpan={8}
                className="text-center py-6 text-red-600"
              >
                {error}
              </td>
            </tr>
          )}

          {!loading && !error && proveedores.length === 0 && (
            <tr>
              <td
                colSpan={8}
                className="text-center py-6 text-gray-600"
              >
                No hay proveedores registrados.
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            proveedores.map((p, idx) => (
              <tr
                key={p.idEmpresaP}
                className={idx % 2 === 0 ? "bg-[#f8f2ee]" : "bg-[#efe4dd]"}
              >
                <td className="px-4 py-2">
                  V-{p.idEmpresaP.toString().padStart(3, "0")}
                </td>
                <td className="px-4 py-2">{p.nombre}</td>
                <td className="px-4 py-2">{p.contacto}</td>
                <td className="px-4 py-2">{p.telefono}</td>
                <td className="px-4 py-2">{p.direccion}</td>
                <td className="px-4 py-2 text-center">
                  {p.compras_count ?? 0}
                </td>
                <td className="px-4 py-2">
                  {p.total_comprado
                    ? `Bs. ${Number(p.total_comprado).toFixed(2)}`
                    : "—"}
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onVerDetalle(p)}
                      className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs hover:bg-indigo-700"
                      title="Ver detalle"
                    >
                      <FiEye />
                    </button>
                    <button
                      onClick={() => onEditar(p)}
                      className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-xs hover:bg-gray-800"
                      title="Editar"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      onClick={() => onEliminar(p)}
                      className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-xs hover:bg-red-700"
                      title="Eliminar"
                    >
                      <FiTrash />
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

export default ProveedoresTable;
