import React from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiPlus,
  FiTrendingUp,
  FiTrendingDown
} from "react-icons/fi";
import { Movimiento } from "../services/empleado.movimientos.service";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  return (
    <div className="w-full">
      {/* Header con estadísticas */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Movimientos de Inventario
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Total: {total} movimientos registrados
          </p>
        </div>
        
        <button
          onClick={onAgregarMovimiento}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <FiPlus />
          Agregar Movimiento
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 border-b">
            <tr className="text-left">
              <th className="px-4 py-3 font-semibold">ID</th>
              <th className="px-4 py-3 font-semibold">Fecha y Hora</th>
              <th className="px-4 py-3 font-semibold">Producto</th>
              <th className="px-4 py-3 font-semibold">Código</th>
              <th className="px-4 py-3 font-semibold">Tipo</th>
              <th className="px-4 py-3 font-semibold">Cantidad</th>
              <th className="px-4 py-3 font-semibold">Stock Actual</th>
              <th className="px-4 py-3 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && movimientos.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <p className="mt-2 text-gray-600">Cargando movimientos...</p>
                  </div>
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={8} className="text-center py-8 text-red-600">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && movimientos.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-500">
                  No se encontraron movimientos
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              movimientos.map((movimiento, idx) => (
                <tr
                  key={movimiento.idMovimiento}
                  className={`border-b hover:bg-gray-50 ${
                    idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-gray-700">
                      M-{movimiento.idMovimiento.toString().padStart(4, "0")}
                    </span>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {formatFecha(movimiento.fechaMovimiento)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(movimiento.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div>
                      <span className="font-medium">{movimiento.producto.nombre}</span>
                      <p className="text-xs text-gray-600 truncate max-w-xs">
                        {movimiento.producto.descripcion}
                      </p>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <span className="font-mono text-gray-700">
                      {movimiento.producto.codigoProducto}
                    </span>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {movimiento.tipo === "entrada" ? (
                        <>
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-green-700 font-medium flex items-center gap-1">
                            <FiTrendingUp size={12} />
                            Entrada
                          </span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 rounded-full bg-red-500"></div>
                          <span className="text-red-700 font-medium flex items-center gap-1">
                            <FiTrendingDown size={12} />
                            Salida
                          </span>
                        </>
                      )}
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <span className={`font-bold ${
                      movimiento.tipo === "entrada" ? "text-green-700" : "text-red-700"
                    }`}>
                      {movimiento.tipo === "entrada" ? "+" : "-"}{movimiento.cantidad}
                    </span>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        movimiento.producto.stock <= movimiento.producto.stockMinimo
                          ? "bg-red-100 text-red-800"
                          : movimiento.producto.stock <= movimiento.producto.stockMinimo * 2
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {movimiento.producto.stock} unidades
                      </span>
                    </div>
                  </td>
                  
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onVerDetalle(movimiento)}
                        className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs hover:bg-blue-700 transition-colors"
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
      {!loading && movimientos.length > 0 && (
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Mostrando página {page} de {lastPage} - Total {total} movimientos
          </div>
          
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => onCambiarPagina(page - 1)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md border text-sm transition-colors ${
                page <= 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400"
              }`}
            >
              <FiChevronLeft />
              <span>Anterior</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, lastPage) }, (_, i) => {
                let pageNum;
                if (lastPage <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= lastPage - 2) {
                  pageNum = lastPage - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => onCambiarPagina(pageNum)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
                      page === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {lastPage > 5 && page < lastPage - 2 && (
                <>
                  <span className="px-2 text-gray-400">...</span>
                  <button
                    onClick={() => onCambiarPagina(lastPage)}
                    className={`w-8 h-8 flex items-center justify-center rounded-md text-sm ${
                      page === lastPage
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {lastPage}
                  </button>
                </>
              )}
            </div>

            <button
              disabled={page >= lastPage}
              onClick={() => onCambiarPagina(page + 1)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md border text-sm transition-colors ${
                page >= lastPage
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300"
                  : "bg-white text-gray-700 hover:bg-gray-50 border-gray-300 hover:border-gray-400"
              }`}
            >
              <span>Siguiente</span>
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovimientosTable;