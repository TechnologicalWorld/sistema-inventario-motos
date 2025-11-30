import React from "react";
import { FiEye, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { CompraListItem } from "../compras.service";

interface Props {
  items: CompraListItem[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onVerDetalle: (idCompra: number) => void;
}

function formatFecha(fechaIso: string) {
  if (!fechaIso) return "-";
  const d = new Date(fechaIso);
  if (Number.isNaN(d.getTime())) return "-";
  const dia = d.getDate().toString().padStart(2, "0");
  const mes = (d.getMonth() + 1).toString().padStart(2, "0");
  const anio = d.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

function formatIdCompra(id: number) {
  return `C-${id.toString().padStart(4, "0")}`;
}

function formatBs(value: string | number) {
  const num = Number(value || 0);
  return `Bs. ${num.toFixed(2)}`;
}

const ComprasTable: React.FC<Props> = ({
  items,
  loading,
  error,
  page,
  totalPages,
  onPageChange,
  onVerDetalle,
}) => {
  return (
    <div className="bg-[#f3ebe7] border border-gray-300 rounded-md overflow-hidden">
      <table className="w-full text-xs md:text-sm">
        <thead className="bg-gray-300">
          <tr>
            <th className="px-4 py-2 text-left font-semibold">id Compra</th>
            <th className="px-4 py-2 text-left font-semibold">Fecha</th>
            <th className="px-4 py-2 text-left font-semibold">Proveedor</th>
            <th className="px-4 py-2 text-left font-semibold">
              Total pago (Bs.)
            </th>
            <th className="px-4 py-2 text-left font-semibold">Gerente</th>
            <th className="px-4 py-2 text-left font-semibold">Observación</th>
            <th className="px-4 py-2 text-left font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={7} className="py-6 text-center text-gray-600">
                Cargando compras...
              </td>
            </tr>
          )}

          {!loading && error && (
            <tr>
              <td colSpan={7} className="py-6 text-center text-red-600">
                {error}
              </td>
            </tr>
          )}

          {!loading && !error && items.length === 0 && (
            <tr>
              <td colSpan={7} className="py-6 text-center text-gray-600">
                No hay compras registradas.
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            items.map((c, idx) => (
              <tr
                key={c.idCompra}
                className={idx % 2 === 0 ? "bg-[#f8f2ee]" : "bg-[#efe4dd]"}
              >
                <td className="px-4 py-2">{formatIdCompra(c.idCompra)}</td>
                <td className="px-4 py-2">{formatFecha(c.fecha)}</td>
                <td className="px-4 py-2">
                  {c.empresa_proveedora?.nombre ?? "-"}
                </td>
                <td className="px-4 py-2">
                  {formatBs(c.totalPago ?? 0)}
                </td>
                <td className="px-4 py-2">
                  {c.gerente?.persona
                    ? `${c.gerente.persona.nombres} ${c.gerente.persona.paterno}`
                    : "-"}
                </td>
                <td className="px-4 py-2 truncate max-w-[220px]">
                  {c.observacion || "-"}
                </td>
                <td className="px-4 py-2">
                  <div className="flex justify-center">
                    <button
                      onClick={() => onVerDetalle(c.idCompra)}
                      className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs hover:bg-indigo-700"
                      title="Ver detalle de compra"
                    >
                      <FiEye />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <button
          disabled={page <= 1}
          onClick={() => page > 1 && onPageChange(page - 1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm border ${
            page <= 1
              ? "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
              : "border-gray-400 text-gray-700 bg-white hover:bg-gray-100"
          }`}
        >
          <FiChevronLeft />
          Anterior
        </button>

        <span className="text-sm text-gray-700">
          Página {page} de {totalPages || 1}
        </span>

        <button
          disabled={page >= totalPages}
          onClick={() => page < totalPages && onPageChange(page + 1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm border ${
            page >= totalPages
              ? "border-gray-300 text-gray-400 bg-gray-100 cursor-not-allowed"
              : "border-gray-400 text-gray-700 bg-white hover:bg-gray-100"
          }`}
        >
          Siguiente
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default ComprasTable;
