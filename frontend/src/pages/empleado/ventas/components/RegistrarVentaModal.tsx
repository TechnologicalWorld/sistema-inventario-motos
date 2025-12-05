// src/pages/empleado/ventas/components/RegistrarVentaModal.tsx
import React, { useState, useEffect } from "react";
import {
  FiX,
  FiPlus,
  FiTrash2,
  FiShoppingCart,
  FiAlertTriangle,
} from "react-icons/fi";
import ventasService, {
  ProductoVenta,
} from "../services/empleado.ventas.service";

interface Props {
  open: boolean;
  onClose: () => void;
  onRegistrarVenta: (ventaData: any) => Promise<boolean>;
}

interface ClienteOption {
  idCliente: number;
  label: string;
  nit?: string;
}

interface DetalleVentaForm {
  idProducto: number;
  cantidad: number;
  producto?: ProductoVenta;
}

const RegistrarVentaModal: React.FC<Props> = ({
  open,
  onClose,
  onRegistrarVenta,
}) => {
  const [formData, setFormData] = useState({
    idCliente: "",
    metodoPago: "efectivo" as "efectivo" | "tarjeta" | "transferencia",
    descripcion: "",
  });

  const [detalles, setDetalles] = useState<DetalleVentaForm[]>([
    { idProducto: 0, cantidad: 1, producto: undefined },
  ]);

  const [productos, setProductos] = useState<ProductoVenta[]>([]);
  const [clientes, setClientes] = useState<ClienteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [cargandoDatos, setCargandoDatos] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cuando se abre/cierra el modal
  useEffect(() => {
    if (open) {
      resetForm();
      cargarDatosIniciales();
    }
  }, [open]);

  const resetForm = () => {
    setFormData({
      idCliente: "",
      metodoPago: "efectivo",
      descripcion: "",
    });
    setDetalles([{ idProducto: 0, cantidad: 1 }]);
    setError(null);
  };

  const cargarDatosIniciales = async () => {
    try {
      setCargandoDatos(true);
      setError(null);

      const [productosData, clientesData] = await Promise.all([
        ventasService.getProductos(),
        ventasService.getClientes(),
      ]);

      const productosProcesados = productosData.map((producto) => ({
        ...producto,
        precioVenta: ventasService.parseToNumber(producto.precioVenta),
        stock: Number(producto.stock) || 0,
      }));

      setProductos(productosProcesados);

      const clientesOptions = clientesData.map((cliente) => ({
        idCliente: cliente.idCliente,
        label: `${cliente.persona?.nombres || ""} ${
          cliente.persona?.paterno || ""
        } ${cliente.persona?.materno || ""}`.trim(),
        nit: cliente.nit || "Sin NIT",
      }));

      setClientes(clientesOptions);
    } catch (error: any) {
      console.error("❌ Error cargando datos:", error);
      setError(`Error al cargar datos: ${error.message}`);
    } finally {
      setCargandoDatos(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (detalles.length === 0 || detalles.every((d) => d.idProducto === 0)) {
      setError("Debe agregar al menos un producto a la venta");
      return;
    }

    if (!formData.idCliente) {
      setError("Debe seleccionar un cliente");
      return;
    }

    // Validar stock
    for (const detalle of detalles) {
      if (detalle.idProducto === 0) {
        setError("Hay productos sin seleccionar");
        return;
      }

      const producto = productos.find((p) => p.idProducto === detalle.idProducto);
      if (!producto) {
        setError(`Producto con ID ${detalle.idProducto} no encontrado`);
        return;
      }

      if (producto.stock < detalle.cantidad) {
        setError(
          `Stock insuficiente para ${producto.nombre}. Stock disponible: ${producto.stock}`
        );
        return;
      }

      if (detalle.cantidad <= 0) {
        setError("La cantidad debe ser mayor a 0");
        return;
      }
    }

    setLoading(true);
    setError(null);

    const ventaData = {
      idCliente: parseInt(formData.idCliente),
      metodoPago: formData.metodoPago,
      descripcion: formData.descripcion || "",
      detalles: detalles
        .filter((detalle) => detalle.idProducto > 0 && detalle.cantidad > 0)
        .map((detalle) => ({
          idProducto: detalle.idProducto,
          cantidad: detalle.cantidad,
        })),
    };

    try {
      const success = await onRegistrarVenta(ventaData);
      if (success) {
        onClose();
        resetForm();
      }
    } catch (err: any) {
      setError(err.message || "Error al registrar la venta");
    } finally {
      setLoading(false);
    }
  };

  const agregarDetalle = () => {
    setDetalles((prev) => [...prev, { idProducto: 0, cantidad: 1 }]);
  };

  const eliminarDetalle = (index: number) => {
    if (detalles.length > 1) {
      setDetalles((prev) => prev.filter((_, i) => i !== index));
    } else {
      setDetalles([{ idProducto: 0, cantidad: 1 }]);
    }
  };

  const actualizarDetalle = (index: number, campo: string, valor: any) => {
    setDetalles((prev) =>
      prev.map((detalle, i) => {
        if (i === index) {
          const actualizado: DetalleVentaForm = { ...detalle, [campo]: valor };

          if (campo === "idProducto") {
            const productoId = parseInt(valor);
            const productoSeleccionado = productos.find(
              (p) => p.idProducto === productoId
            );
            actualizado.producto = productoSeleccionado || undefined;
            if (productoSeleccionado) actualizado.cantidad = 1;
          }

          return actualizado;
        }
        return detalle;
      })
    );
  };

  const calcularTotal = () => {
    return detalles.reduce((total, detalle) => {
      if (detalle.producto) {
        return total + detalle.producto.precioVenta * detalle.cantidad;
      }
      return total;
    }, 0);
  };

  const obtenerProductoSeleccionado = (detalle: DetalleVentaForm) => {
    if (!detalle.producto && detalle.idProducto > 0) {
      const producto = productos.find((p) => p.idProducto === detalle.idProducto);
      return producto;
    }
    return detalle.producto;
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[#f5ede8] rounded-md w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto border border-gray-400 shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#e5ddda] rounded-t-md border-b border-gray-300 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/70 rounded-md border border-gray-300">
              <FiShoppingCart className="text-gray-900" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-semibold text-gray-900">
                Registrar nueva venta
              </h2>
              <p className="text-xs text-gray-700">
                Selecciona cliente y productos para registrar la venta.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-gray-700 hover:text-gray-900 hover:bg-black/5 p-2 rounded-full"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* ERRORES */}
        {error && (
          <div className="mx-6 mt-4 mb-0 flex items-start gap-2 bg-red-50 border border-red-200 rounded-md px-3 py-2 text-xs text-red-700">
            <FiAlertTriangle className="mt-[2px]" />
            <span>{error}</span>
          </div>
        )}

        {/* BODY */}
        {cargandoDatos ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800 mx-auto"></div>
            <p className="mt-3 text-sm text-gray-700">
              Cargando productos y clientes...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-4 space-y-6 text-sm">
            {/* INFO GENERAL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  Cliente *
                </label>
                <select
                  name="idCliente"
                  value={formData.idCliente}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      idCliente: e.target.value,
                    }))
                  }
                  required
                  className="w-full border border-gray-400 rounded-sm px-3 py-2 text-sm bg-[#f9f3ef] focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                >
                  <option value="">Seleccionar cliente</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.idCliente} value={cliente.idCliente}>
                      {cliente.label}{" "}
                      {cliente.nit ? `- NIT: ${cliente.nit}` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                  Método de pago *
                </label>
                <select
                  name="metodoPago"
                  value={formData.metodoPago}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      metodoPago: e.target.value as any,
                    }))
                  }
                  required
                  className="w-full border border-gray-400 rounded-sm px-3 py-2 text-sm bg-[#f9f3ef] focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                Descripción (opcional)
              </label>
              <input
                type="text"
                name="descripcion"
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    descripcion: e.target.value,
                  }))
                }
                placeholder="Descripción de la venta..."
                className="w-full border border-gray-400 rounded-sm px-3 py-2 text-sm bg-[#f9f3ef] focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
              />
            </div>

            {/* DETALLES */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-gray-800">
                  Productos de la venta *
                </h3>
                <button
                  type="button"
                  onClick={agregarDetalle}
                  className="flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-black text-white hover:bg-gray-900"
                >
                  <FiPlus size={12} />
                  Agregar producto
                </button>
              </div>

              {detalles.length === 0 ? (
                <div className="text-center py-4 text-gray-500 border border-dashed border-gray-400 rounded-md bg-[#f9f3ef]">
                  No hay productos agregados
                </div>
              ) : (
                <div className="space-y-3">
                  {detalles.map((detalle, index) => {
                    const producto = obtenerProductoSeleccionado(detalle);
                    const subtotal = producto
                      ? producto.precioVenta * detalle.cantidad
                      : 0;

                    return (
                      <div
                        key={index}
                        className="flex flex-wrap items-center gap-3 p-3 border border-gray-400 rounded-md bg-[#f3ebe7]"
                      >
                        <div className="flex-1 min-w-[220px]">
                          <label className="block text-[11px] text-gray-700 mb-1">
                            Producto *
                          </label>
                          <select
                            value={detalle.idProducto}
                            onChange={(e) =>
                              actualizarDetalle(
                                index,
                                "idProducto",
                                parseInt(e.target.value)
                              )
                            }
                            className="w-full border border-gray-400 rounded-sm px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                            required
                          >
                            <option value={0}>Seleccionar producto</option>
                            {productos.map((p) => (
                              <option
                                key={p.idProducto}
                                value={p.idProducto}
                                disabled={p.stock <= 0}
                              >
                                {p.nombre} - Bs.{" "}
                                {ventasService
                                  .parseToNumber(p.precioVenta)
                                  .toFixed(2)}{" "}
                                {p.stock > 0
                                  ? `(Stock: ${p.stock})`
                                  : "(Sin stock)"}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="w-24">
                          <label className="block text-[11px] text-gray-700 mb-1">
                            Cantidad *
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={producto?.stock || 99}
                            value={detalle.cantidad}
                            onChange={(e) =>
                              actualizarDetalle(
                                index,
                                "cantidad",
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-full border border-gray-400 rounded-sm px-2 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-gray-800"
                            required
                            disabled={!detalle.idProducto}
                          />
                          {producto && (
                            <div className="text-[11px] text-gray-600 mt-1">
                              Stock: {producto.stock}
                            </div>
                          )}
                        </div>

                        <div className="w-32">
                          <label className="block text-[11px] text-gray-700 mb-1">
                            Subtotal
                          </label>
                          <div className="text-sm font-semibold text-gray-800 px-2 py-2 bg-white border border-gray-400 rounded-sm">
                            Bs. {subtotal.toFixed(2)}
                          </div>
                        </div>

                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => eliminarDetalle(index)}
                            className="p-2 text-red-700 hover:text-red-900 hover:bg-red-50 rounded-full"
                            title="Eliminar producto"
                          >
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* RESUMEN */}
            {detalles.some((d) => d.idProducto > 0) && (
              <div className="bg-[#f0e7e2] border border-gray-400 rounded-md px-4 py-3">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  Resumen de venta
                </h4>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 text-sm">Total a pagar:</span>
                  <span className="text-xl font-semibold text-gray-900">
                    Bs. {calcularTotal().toFixed(2)}
                  </span>
                </div>
                <div className="text-[11px] text-gray-600 mt-1">
                  {detalles.filter((d) => d.idProducto > 0).length} producto(s)
                </div>
              </div>
            )}

            {/* BOTONES */}
            <div className="flex gap-3 pt-4 border-t border-gray-300">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 border border-gray-500 rounded-sm text-sm text-gray-800 bg-white hover:bg-gray-100"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || detalles.every((d) => d.idProducto === 0)}
                className="flex-1 py-2 bg-black text-white rounded-sm text-sm hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                    Registrando...
                  </span>
                ) : (
                  "Registrar venta"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default RegistrarVentaModal;
