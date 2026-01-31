import React from "react";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiPackage,
  FiAlertTriangle,
} from "react-icons/fi";
import { Producto } from "../service/empleado.inventario.service";

interface Props {
  productos: Producto[];
  loading: boolean;
  error: string | null;
  page: number;
  lastPage: number;
  search: string;
  setSearch: (value: string) => void;
  filtroStockBajo: boolean;
  setFiltroStockBajo: (value: boolean) => void;
  onSearch: () => void;
  onChangePage: (page: number) => void;
  onVerDetalle: (producto: Producto) => void;
}

const ProductosTable: React.FC<Props> = ({
  productos,
  loading,
  error,
  page,
  lastPage,
  search,
  setSearch,
  filtroStockBajo,
  setFiltroStockBajo,
  onSearch,
  onChangePage,
  onVerDetalle,
}) => {
  const handleBuscarClick = () => onSearch();

  const toggleFiltroStockBajo = () => {
    setFiltroStockBajo(!filtroStockBajo);
  };

  return (
    <div className="w-full space-y-4">
      {/* Barra de búsqueda y filtros (igual patrón que GERENTE) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Buscador a la izquierda */}
        <div className="flex items-stretch">
          <div className="flex items-center bg-white border border-gray-400 rounded-l-full px-3 py-1.5 min-w-[260px]">
            <span className="text-gray-500 mr-2">
              <FiSearch />
            </span>
            <input
              type="text"
              placeholder="Buscar productos..."
              className="flex-1 text-sm outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBuscarClick()}
            />
          </div>
          <button
            onClick={handleBuscarClick}
            className="px-5 py-1.5 rounded-r-full bg-black text-white text-sm hover:bg-gray-900 transition -ml-px"
          >
            Buscar
          </button>
        </div>

        {/* Filtros a la derecha */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleFiltroStockBajo}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-colors ${filtroStockBajo
                ? "bg-red-100 text-red-700 border-red-300"
                : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50"
              }`}
          >
            <FiAlertTriangle />
            Stock bajo
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-[#f3ebe7] border border-gray-300 rounded-md">
        <table className="w-full text-xs md:text-sm">
          <thead className="bg-gray-300">
            <tr className="text-left">
              <th className="px-4 py-2 font-semibold">Código</th>
              <th className="px-4 py-2 font-semibold">Producto</th>
              <th className="px-4 py-2 font-semibold">Categoría</th>
              <th className="px-4 py-2 font-semibold">Precio venta</th>
              <th className="px-4 py-2 font-semibold">Stock</th>
              <th className="px-4 py-2 font-semibold">Estado</th>
              <th className="px-4 py-2 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />
                    Cargando productos...
                  </div>
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-red-600">
                  <div className="flex items-center justify-center gap-2">
                    <FiAlertTriangle />
                    {error}
                  </div>
                </td>
              </tr>
            )}

            {!loading && !error && productos.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-600">
                  <div className="flex items-center justify-center gap-2">
                    <FiPackage />
                    No se encontraron productos.
                  </div>
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              productos.map((producto, idx) => {
                const tieneStockBajo = producto.stock <= producto.stockMinimo;

                if (filtroStockBajo) {
                  if (tieneStockBajo) {
                    return (
                      <tr
                        key={producto.idProducto}
                        className={
                          idx % 2 === 0 ? "bg-[#f8f2ee]" : "bg-[#efe4dd]"
                        }
                      >
                        <td className="px-4 py-2 font-mono text-gray-700">
                          {producto.codigoProducto}
                        </td>
                        <td className="px-4 py-2">
                          <div>
                            <div className="font-medium text-gray-800">
                              {producto.nombre}
                            </div>
                            {producto.descripcion && (
                              <div className="text-xs text-gray-600 truncate max-w-[220px]">
                                {producto.descripcion}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          {producto.categoria?.nombre || "—"}
                        </td>
                        <td className="px-4 py-2 font-semibold text-green-700">
                          Bs. {Number(producto.precioVenta).toFixed(2)}
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`font-semibold ${tieneStockBajo
                                  ? "text-red-600"
                                  : "text-gray-900"
                                }`}
                            >
                              {producto.stock}
                            </span>
                            {tieneStockBajo && (
                              <FiAlertTriangle className="text-red-500 text-xs" />
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded-full text-[11px] font-semibold ${producto.estado === "activo"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                              }`}
                          >
                            {producto.estado === "activo"
                              ? "Activo"
                              : "Inactivo"}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <div className="flex items-center justify-center">
                            <button
                              onClick={() => onVerDetalle(producto)}
                              className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs hover:bg-indigo-700 transition-colors"
                              title="Ver detalle"
                            >
                              <FiEye />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }
                }
                else {return (
                  <tr
                    key={producto.idProducto}
                    className={idx % 2 === 0 ? "bg-[#f8f2ee]" : "bg-[#efe4dd]"}
                  >
                    <td className="px-4 py-2 font-mono text-gray-700">
                      {producto.codigoProducto}
                    </td>
                    <td className="px-4 py-2">
                      <div>
                        <div className="font-medium text-gray-800">
                          {producto.nombre}
                        </div>
                        {producto.descripcion && (
                          <div className="text-xs text-gray-600 truncate max-w-[220px]">
                            {producto.descripcion}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      {producto.categoria?.nombre || "—"}
                    </td>
                    <td className="px-4 py-2 font-semibold text-green-700">
                      Bs. {Number(producto.precioVenta).toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-semibold ${tieneStockBajo ? "text-red-600" : "text-gray-900"
                            }`}
                        >
                          {producto.stock}
                        </span>
                        {tieneStockBajo && (
                          <FiAlertTriangle className="text-red-500 text-xs" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`px-2 py-1 rounded-full text-[11px] font-semibold ${producto.estado === "activo"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                          }`}
                      >
                        {producto.estado === "activo" ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => onVerDetalle(producto)}
                          className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs hover:bg-indigo-700 transition-colors"
                          title="Ver detalle"
                        >
                          <FiEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                );}
              })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          disabled={page <= 1}
          onClick={() => onChangePage(page - 1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm ${page <= 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white text-gray-800 hover:bg-gray-100"
            }`}
        >
          <FiChevronLeft />
          <span>Anterior</span>
        </button>

        <span className="text-sm text-gray-700">
          Página {page} de {lastPage}
        </span>

        <button
          disabled={page >= lastPage}
          onClick={() => onChangePage(page + 1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm ${page >= lastPage
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white text-gray-800 hover:bg-gray-100"
            }`}
        >
          <span>Siguiente</span>
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default ProductosTable;
