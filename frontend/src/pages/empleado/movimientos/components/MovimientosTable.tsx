// src/pages/empleado/movimientos/components/MovimientosTable.tsx
import React from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiPlus,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";
import { Movimiento } from "../services/empleado.movimientos.service";

interface Props {
  movimientos: Movimiento[];
  loading: boolean;
  error: string | null;
  page: number;
  lastPage: number;
  total: number;
  onCambiarPagina: (page: number) => void;
  onVerDetalle: (movimiento: Movimiento) => void;
  onAgregarMovimiento: () => void;
}

function formatFecha(fechaIso: string) {
  const d = new Date(fechaIso);
  if (Number.isNaN(d.getTime())) return "-";
  const dia = d.getDate().toString().padStart(2, "0");
  const mes = (d.getMonth() + 1).toString().padStart(2, "0");
  const anio = d.getFullYear();
  const horas = d.getHours().toString().padStart(2, "0");
  const mins = d.getMinutes().toString().padStart(2, "0");
  return `${dia}/${mes}/${anio} ${horas}:${mins}`;
}

const MovimientosTable: React.FC<Props> = ({
  movimientos,
  loading,
  error,
  page,
  lastPage,
  total,
  onCambiarPagina,
  onVerDetalle,
  onAgregarMovimiento,
}) => {
  const movimientosArray = Array.isArray(movimientos) ? movimientos : [];

  return (
    <div className="w-full space-y-4">
      {/* Header título + botón */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            Movimientos de inventario
          </h1>
          <p className="text-sm text-gray-600">
            Total: {total} movimientos registrados
          </p>
        </div>

        <button
          onClick={onAgregarMovimiento}
          className="flex items-center gap-2 px-4 py-2 rounded-sm text-sm bg-black text-white hover:bg-gray-900"
        >
          <FiPlus />
          Agregar movimiento
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-[#f3ebe7] border border-gray-300 rounded-md overflow-hidden">
        <table className="w-full text-xs md:text-sm">
          <thead className="bg-gray-300">
            <tr className="text-left">
              <th className="px-4 py-2 font-semibold">ID</th>
              <th className="px-4 py-2 font-semibold">Fecha y hora</th>
              <th className="px-4 py-2 font-semibold">Producto</th>
              <th className="px-4 py-2 font-semibold">Código</th>
              <th className="px-4 py-2 font-semibold">Tipo</th>
              <th className="px-4 py-2 font-semibold">Cantidad</th>
              <th className="px-4 py-2 font-semibold">Stock actual</th>
              <th className="px-4 py-2 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && movimientosArray.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-700">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
                    <p>Cargando movimientos...</p>
                  </div>
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={8} className="text-center py-8 text-red-700">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && movimientosArray.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-600">
                  No se encontraron movimientos.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              movimientosArray.map((movimiento, idx) => (
                <tr
                  key={movimiento.idMovimiento}
                  className={
                    idx % 2 === 0 ? "bg-[#f8f2ee]" : "bg-[#efe4dd]"
                  }
                >
                  <td className="px-4 py-2">
                    <span className="font-mono text-gray-800">
                      M-{movimiento.idMovimiento.toString().padStart(4, "0")}
                    </span>
                  </td>

                  <td className="px-4 py-2">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">
                        {formatFecha(movimiento.fechaMovimiento)}
                      </span>
                      <span className="text-[11px] text-gray-600">
                        Reg.:{" "}
                        {new Date(
                          movimiento.created_at
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </td>

                  <td className="px-4 py-2">
                    <div>
                      <span className="font-medium text-gray-900">
                        {movimiento.producto.nombre}
                      </span>
                      {movimiento.producto.descripcion && (
                        <p className="text-[11px] text-gray-700 truncate max-w-xs">
                          {movimiento.producto.descripcion}
                        </p>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-2">
                    <span className="font-mono text-gray-800">
                      {movimiento.producto.codigoProducto}
                    </span>
                  </td>

                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      {movimiento.tipo === "entrada" ? (
                        <>
                          <div className="w-2 h-2 rounded-full bg-green-600" />
                          <span className="text-green-800 font-medium flex items-center gap-1">
                            <FiTrendingUp size={12} />
                            Entrada
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 rounded-full bg-red-600" />
                          <span className="text-red-800 font-medium flex items-center gap-1">
                            <FiTrendingDown size={12} />
                            Salida
                          </span>
                        </>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-2">
                    <span
                      className={`font-bold ${
                        movimiento.tipo === "entrada"
                          ? "text-green-800"
                          : "text-red-800"
                      }`}
                    >
                      {movimiento.tipo === "entrada" ? "+" : "-"}
                      {movimiento.cantidad}
                    </span>
                  </td>

                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-[11px] font-medium ${
                        movimiento.producto.stock <=
                        movimiento.producto.stockMinimo
                          ? "bg-red-100 text-red-800"
                          : movimiento.producto.stock <=
                            movimiento.producto.stockMinimo * 2
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {movimiento.producto.stock} unidades
                    </span>
                  </td>

                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => onVerDetalle(movimiento)}
                        className="w-8 h-8 rounded-full bg-indigo-700 text-white flex items-center justify-center text-xs hover:bg-indigo-800"
                        title="Ver detalle del movimiento"
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

      {/* Paginación */}
      {!loading && movimientosArray.length > 0 && (
        <div className="mt-5 flex items-center justify-center gap-4">
          {/* Botón Anterior */}
          <button
            disabled={page <= 1}
            onClick={() => onCambiarPagina(page - 1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm ${
              page <= 1
                ? "bg-[#E5E7EB] text-gray-400 border-gray-300 cursor-not-allowed"
                : "bg-[#E9EDF5] text-[#334155] border-[#CBD5E1] hover:bg-[#dde4f2]"
            }`}
          >
            <FiChevronLeft className="text-sm" />
            <span>Anterior</span>
          </button>

          {/* Texto central */}
          <span className="text-sm text-gray-700">
            Página {page} de {lastPage}
          </span>

          {/* Botón Siguiente */}
          <button
            disabled={page >= lastPage}
            onClick={() => onCambiarPagina(page + 1)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm ${
              page >= lastPage
                ? "bg-[#E5E7EB] text-gray-400 border-gray-300 cursor-not-allowed"
                : "bg-[#E9EDF5] text-[#334155] border-[#CBD5E1] hover:bg-[#dde4f2]"
            }`}
          >
            <span>Siguiente</span>
            <FiChevronRight className="text-sm" />
          </button>
        </div>
      )}

    </div>
  );
};

export default MovimientosTable;
