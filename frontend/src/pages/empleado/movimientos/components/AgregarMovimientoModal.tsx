// src/pages/empleado/movimientos/components/AgregarMovimientoModal.tsx
import React, { useState, useEffect } from "react";
import {
  FiX,
  FiPlus,
  FiTrendingUp,
  FiTrendingDown,
  FiAlertTriangle,
} from "react-icons/fi";
import movimientosService, {
  ProductoMovimiento,
} from "../services/empleado.movimientos.service";

interface Props {
  open: boolean;
  onClose: () => void;
  onRegistrarMovimiento: (movimientoData: any) => Promise<boolean>;
}

const AgregarMovimientoModal: React.FC<Props> = ({
  open,
  onClose,
  onRegistrarMovimiento,
}) => {
  const [formData, setFormData] = useState({
    tipo: "entrada" as "entrada" | "salida",
    idProducto: 0,
    cantidad: 1,
    observacion: "",
  });

  const [productos, setProductos] = useState<ProductoMovimiento[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] =
    useState<ProductoMovimiento | null>(null);
  const [loading, setLoading] = useState(false);
  const [cargandoProductos, setCargandoProductos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos al abrir el modal
  useEffect(() => {
    if (open) {
      cargarProductos();
      setFormData({
        tipo: "entrada",
        idProducto: 0,
        cantidad: 1,
        observacion: "",
      });
      setProductoSeleccionado(null);
      setError(null);
    }
  }, [open]);

  const cargarProductos = async () => {
    try {
      setCargandoProductos(true);
      setError(null);
      const productosData = await movimientosService.getProductos();
      setProductos(productosData);
    } catch (err: any) {
      console.error("Error cargando productos:", err);
      setError("No se pudieron cargar los productos");
    } finally {
      setCargandoProductos(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.idProducto === 0) {
      setError("Debe seleccionar un producto");
      return;
    }

    if (formData.cantidad <= 0) {
      setError("La cantidad debe ser mayor a 0");
      return;
    }

    // Validar stock si es salida
    if (formData.tipo === "salida" && productoSeleccionado) {
      if (formData.cantidad > productoSeleccionado.stock) {
        setError(
          `Stock insuficiente. Disponible: ${productoSeleccionado.stock} unidades`
        );
        return;
      }
    }

    setLoading(true);
    setError(null);

    const movimientoData = {
      tipo: formData.tipo,
      idProducto: formData.idProducto,
      cantidad: formData.cantidad,
      observacion: formData.observacion.trim() || "Sin observación",
    };

    const success = await onRegistrarMovimiento(movimientoData);
    if (success) {
      onClose();
      setFormData({
        tipo: "entrada",
        idProducto: 0,
        cantidad: 1,
        observacion: "",
      });
      setProductoSeleccionado(null);
    }

    setLoading(false);
  };

  const handleProductoChange = (idProducto: number) => {
    setFormData((prev) => ({ ...prev, idProducto }));
    const producto = productos.find((p) => p.idProducto === idProducto);
    setProductoSeleccionado(producto || null);
  };

  const handleTipoChange = (tipo: "entrada" | "salida") => {
    setFormData((prev) => ({ ...prev, tipo }));
    if (tipo === "salida" && productoSeleccionado) {
      if (formData.cantidad > productoSeleccionado.stock) {
        setFormData((prev) => ({
          ...prev,
          cantidad: productoSeleccionado.stock,
        }));
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-[#f5ede8] rounded-md w-full max-w-xl mx-auto max-h-[90vh] overflow-y-auto border border-gray-400 shadow-xl">
        {/* HEADER */}
        <div className="px-6 py-3 border-b border-gray-300 bg-[#e5ddda] rounded-t-md flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full border ${
                formData.tipo === "entrada"
                  ? "bg-green-100 border-green-300"
                  : "bg-red-100 border-red-300"
              }`}
            >
              {formData.tipo === "entrada" ? (
                <FiTrendingUp className="text-green-700" />
              ) : (
                <FiTrendingDown className="text-red-700" />
              )}
            </div>
            <div>
              <h2 className="text-base md:text-lg font-semibold text-gray-900">
                {formData.tipo === "entrada"
                  ? "Registrar entrada de inventario"
                  : "Registrar salida de inventario"}
              </h2>
              <p className="text-xs text-gray-700">
                Selecciona un producto y registra el movimiento.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-700 hover:text-gray-900 hover:bg-black/5 p-2 rounded-full"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4 text-sm">
          {/* Tipo de movimiento */}
          <div>
            <label className="block text-xs font-semibold text-gray-800 mb-1.5">
              Tipo de movimiento
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleTipoChange("entrada")}
                className={`flex-1 py-2 rounded-sm border flex items-center justify-center gap-2 text-sm transition ${
                  formData.tipo === "entrada"
                    ? "bg-green-700 text-white border-green-700"
                    : "bg-[#f9f3ef] text-gray-800 border-gray-400 hover:bg-green-50"
                }`}
              >
                <FiTrendingUp />
                Entrada
              </button>
              <button
                type="button"
                onClick={() => handleTipoChange("salida")}
                className={`flex-1 py-2 rounded-sm border flex items-center justify-center gap-2 text-sm transition ${
                  formData.tipo === "salida"
                    ? "bg-red-700 text-white border-red-700"
                    : "bg-[#f9f3ef] text-gray-800 border-gray-400 hover:bg-red-50"
                }`}
              >
                <FiTrendingDown />
                Salida
              </button>
            </div>
          </div>

          {/* Producto */}
          <div>
            <label className="block text-xs font-semibold text-gray-800 mb-1.5">
              Producto *
            </label>
            {cargandoProductos ? (
              <div className="text-center py-2 text-gray-700 text-sm">
                Cargando productos...
              </div>
            ) : productos.length === 0 ? (
              <div className="flex items-center gap-2 py-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
                <FiAlertTriangle className="ml-2" />
                <span>No hay productos disponibles.</span>
              </div>
            ) : (
              <select
                value={formData.idProducto}
                onChange={(e) =>
                  handleProductoChange(parseInt(e.target.value))
                }
                required
                className="w-full border border-gray-400 rounded-sm px-3 py-2 text-sm bg-[#f9f3ef] focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
              >
                <option value={0}>Seleccionar producto</option>
                {productos.map((producto) => (
                  <option
                    key={producto.idProducto}
                    value={producto.idProducto}
                  >
                    {producto.nombre} · Cód: {producto.codigoProducto} · Stock:{" "}
                    {producto.stock}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Info producto */}
          {productoSeleccionado && (
            <div
              className={`p-3 rounded-md border text-xs ${
                formData.tipo === "entrada"
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="font-medium text-gray-900 mb-1">
                {productoSeleccionado.nombre}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-600">Stock actual:</span>
                  <span className="ml-1 font-semibold">
                    {productoSeleccionado.stock}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Stock mínimo:</span>
                  <span className="ml-1 font-semibold">
                    {productoSeleccionado.stockMinimo}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Precio venta:</span>
                  <span className="ml-1 font-semibold">
                    Bs. {parseFloat(productoSeleccionado.precioVenta).toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Estado:</span>
                  <span
                    className={`ml-1 font-semibold ${
                      productoSeleccionado.estado === "activo"
                        ? "text-green-700"
                        : "text-red-700"
                    }`}
                  >
                    {productoSeleccionado.estado}
                  </span>
                </div>
              </div>
              {formData.tipo === "salida" &&
                productoSeleccionado.stock <=
                  productoSeleccionado.stockMinimo && (
                  <div className="mt-2 text-xs text-red-700 bg-red-100 p-2 rounded">
                    ⚠️ El stock está por debajo del mínimo
                  </div>
                )}
            </div>
          )}

          {/* Cantidad */}
          <div>
            <label className="block text-xs font-semibold text-gray-800 mb-1.5">
              Cantidad *{" "}
              {formData.tipo === "salida" && productoSeleccionado && (
                <span className="text-gray-600 font-normal">
                  (máx. {productoSeleccionado.stock})
                </span>
              )}
            </label>
            <input
              type="number"
              min={1}
              max={
                formData.tipo === "salida" && productoSeleccionado
                  ? productoSeleccionado.stock
                  : undefined
              }
              value={formData.cantidad}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  cantidad: Math.max(1, parseInt(e.target.value) || 1),
                }))
              }
              required
              className="w-full border border-gray-400 rounded-sm px-3 py-2 text-sm bg-[#f9f3ef] focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>

          {/* Observación */}
          <div>
            <label className="block text-xs font-semibold text-gray-800 mb-1.5">
              Observación
            </label>
            <textarea
              value={formData.observacion}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  observacion: e.target.value,
                }))
              }
              placeholder="Motivo del movimiento..."
              rows={3}
              className="w-full border border-gray-400 rounded-sm px-3 py-2 text-sm bg-[#f9f3ef] resize-none focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-md px-3 py-2 text-xs text-red-700">
              <FiAlertTriangle className="mt-[2px]" />
              <span>{error}</span>
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4 border-t border-gray-300">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 border border-gray-500 rounded-sm text-sm text-gray-900 bg-white hover:bg-gray-100"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || formData.idProducto === 0}
              className={`flex-1 py-2 rounded-sm text-sm text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                formData.tipo === "entrada"
                  ? "bg-green-700 hover:bg-green-800"
                  : "bg-red-700 hover:bg-red-800"
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Procesando...
                </>
              ) : (
                <>
                  <FiPlus />
                  {formData.tipo === "entrada"
                    ? "Registrar entrada"
                    : "Registrar salida"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AgregarMovimientoModal;
