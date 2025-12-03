import React from "react";
import {
  FiX,
  FiPackage,
  FiDollarSign,
  FiTrendingUp,
  FiAlertTriangle,
} from "react-icons/fi";
import { Producto } from "../service/empleado.inventario.service";

interface Props {
  producto: Producto | null;
  open: boolean;
  onClose: () => void;
}

const ProductoDetalleModal: React.FC<Props> = ({
  producto,
  open,
  onClose,
}) => {
  if (!open || !producto) return null;

  const tieneStockBajo = producto.stock <= producto.stockMinimo;
  const margenGanancia =
    ((Number(producto.precioVenta) - Number(producto.precioCompra)) /
      Number(producto.precioCompra || 1)) *
    100;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[#f5ede8] w-[95%] max-w-2xl rounded-md shadow-lg border border-gray-400 max-height-[90vh] max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="bg-[#e5ddda] px-6 py-3 rounded-t-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/70 rounded-md border border-gray-300">
              <FiPackage className="text-gray-800 text-xl" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {producto.nombre}
              </h2>
              <p className="text-xs text-gray-700">
                Código:{" "}
                <span className="font-mono">{producto.codigoProducto}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-black/5 transition-colors"
          >
            <FiX className="text-gray-600" size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="px-6 py-4 space-y-6 text-sm">
          {/* Información Básica */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-800">
              Información del producto
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Estado:</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                      producto.estado === "activo"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {producto.estado === "activo" ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Categoría:</span>
                  <span className="text-gray-800">
                    {producto.categoria?.nombre || "Sin categoría"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">
                    Fecha registro:
                  </span>
                  <span className="text-gray-800">
                    {new Date(
                      producto.created_at as unknown as string
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">
                    Stock mínimo:
                  </span>
                  <span className="text-gray-800">
                    {producto.stockMinimo} unidades
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">
                    Última actualización:
                  </span>
                  <span className="text-gray-800">
                    {new Date(
                      producto.updated_at as unknown as string
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Stock */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-800">
              Inventario
            </h3>
            <div
              className={`p-4 rounded-md border ${
                tieneStockBajo
                  ? "bg-red-50 border-red-200"
                  : "bg-green-50 border-green-200"
              }`}
            >
              <div className="flex items-center gap-3">
                {tieneStockBajo ? (
                  <FiAlertTriangle className="text-red-600 text-xl" />
                ) : (
                  <FiPackage className="text-green-600 text-xl" />
                )}
                <div>
                  <p className="font-semibold text-gray-800">
                    Stock disponible
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      tieneStockBajo ? "text-red-600" : "text-green-700"
                    }`}
                  >
                    {producto.stock} unidades
                  </p>
                  {tieneStockBajo && (
                    <p className="text-xs text-red-700 mt-1">
                      ⚠ Stock por debajo del mínimo ({producto.stockMinimo}{" "}
                      unidades)
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Precios */}
          <div>
            <h3 className="text-sm font-semibold mb-3 text-gray-800">
              Precios
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 bg-[#f3ebe7] rounded-md border border-gray-300">
                <div className="flex items-center gap-2 mb-1.5">
                  <FiDollarSign className="text-gray-700" />
                  <span className="font-medium text-gray-800 text-xs">
                    Precio compra
                  </span>
                </div>
                <p className="text-xl font-semibold text-gray-900">
                  Bs. {Number(producto.precioCompra).toFixed(2)}
                </p>
              </div>

              <div className="p-3 bg-[#f3ebe7] rounded-md border border-gray-300">
                <div className="flex items-center gap-2 mb-1.5">
                  <FiDollarSign className="text-green-700" />
                  <span className="font-medium text-gray-800 text-xs">
                    Precio venta
                  </span>
                </div>
                <p className="text-xl font-semibold text-green-700">
                  Bs. {Number(producto.precioVenta).toFixed(2)}
                </p>
              </div>

              <div className="p-3 bg-[#f3ebe7] rounded-md border border-gray-300">
                <div className="flex items-center gap-2 mb-1.5">
                  <FiTrendingUp className="text-blue-700" />
                  <span className="font-medium text-gray-800 text-xs">
                    Margen de ganancia
                  </span>
                </div>
                <p
                  className={`text-xl font-semibold ${
                    margenGanancia >= 0 ? "text-blue-700" : "text-red-600"
                  }`}
                >
                  {margenGanancia.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>

          {/* Descripción */}
          {producto.descripcion && (
            <div>
              <h3 className="text-sm font-semibold mb-3 text-gray-800">
                Descripción
              </h3>
              <div className="p-3 bg-[#f3ebe7] rounded-md border border-gray-300">
                <p className="text-gray-800 text-sm leading-relaxed">
                  {producto.descripcion}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-6 py-3 border-t border-gray-300 bg-[#e5ddda] flex justify-end rounded-b-md">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-sm bg-gray-700 text-white text-sm hover:bg-gray-800"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductoDetalleModal;
