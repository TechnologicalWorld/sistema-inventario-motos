// src/pages/empleado/movimientos/components/MovimientoDetalleModal.tsx
import React from "react";
import {
  FiX,
  FiTrendingUp,
  FiTrendingDown,
  FiPackage,
} from "react-icons/fi";
import { Movimiento } from "../services/empleado.movimientos.service";

interface Props {
  movimiento: Movimiento | null;
  open: boolean;
  onClose: () => void;
}

function formatFecha(fechaIso: string) {
  const d = new Date(fechaIso);
  if (Number.isNaN(d.getTime())) return {
    fecha: "-",
    hora: "-",
    completa: "-"
  };

  const dia = d.getDate().toString().padStart(2, "0");
  const mes = (d.getMonth() + 1).toString().padStart(2, "0");
  const anio = d.getFullYear();
  const horas = d.getHours().toString().padStart(2, "0");
  const mins = d.getMinutes().toString().padStart(2, "0");
  const segs = d.getSeconds().toString().padStart(2, "0");

  return {
    fecha: `${dia}/${mes}/${anio}`,
    hora: `${horas}:${mins}:${segs}`,
    completa: `${dia}/${mes}/${anio} ${horas}:${mins}:${segs}`,
  };
}

const MovimientoDetalleModal: React.FC<Props> = ({
  movimiento,
  open,
  onClose,
}) => {
  if (!open || !movimiento) return null;

  const { fecha, hora } = formatFecha(movimiento.fechaMovimiento);
  const fechaRegistro = formatFecha(movimiento.created_at);
  const esEntrada = movimiento.tipo === "entrada";

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-[#f5ede8] w-full max-w-3xl rounded-md shadow-xl border border-gray-400 max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="px-6 py-3 rounded-t-md flex justify-between items-center bg-[#e5ddda] border-b border-gray-300">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-full border ${
                esEntrada
                  ? "bg-green-100 border-green-300"
                  : "bg-red-100 border-red-300"
              }`}
            >
              {esEntrada ? (
                <FiTrendingUp className="text-green-700" size={18} />
              ) : (
                <FiTrendingDown className="text-red-700" size={18} />
              )}
            </div>
            <div>
              <h2 className="text-base md:text-lg font-semibold text-gray-900">
                Movimiento M-{movimiento.idMovimiento.toString().padStart(4, "0")}
              </h2>
              <p
                className={`text-xs md:text-sm ${
                  esEntrada ? "text-green-800" : "text-red-800"
                }`}
              >
                {esEntrada
                  ? "Entrada de inventario"
                  : "Salida de inventario"}
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

        {/* CONTENIDO */}
        <div className="p-6 space-y-6 text-sm">
          {/* Info general + observación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div className="bg-[#f0e7e2] rounded-md border border-gray-300 p-3">
                <h3 className="text-xs font-semibold text-gray-700 mb-2">
                  Información del movimiento
                </h3>
                <div className="space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha:</span>
                    <span className="font-medium text-gray-900">
                      {fecha}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hora:</span>
                    <span className="font-medium text-gray-900">
                      {hora}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo:</span>
                    <span
                      className={`font-semibold ${
                        esEntrada ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {esEntrada ? "Entrada (+)" : "Salida (-)"}{" "}
                      {movimiento.cantidad} unidades
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha registro:</span>
                    <span className="font-medium text-gray-900">
                      {fechaRegistro.fecha}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-[#f0e7e2] rounded-md border border-gray-300 p-3">
                <h3 className="text-xs font-semibold text-gray-700 mb-2">
                  Observación
                </h3>
                <div className="bg-[#f9f3ef] border border-gray-300 rounded-sm px-3 py-2">
                  <p className="text-gray-800 leading-snug">
                    {movimiento.observacion || "Sin observación"}
                  </p>
                </div>
              </div>
            </div>

            {/* Info producto */}
            <div className="bg-[#f0e7e2] rounded-md border border-gray-300 p-3">
              <h3 className="text-xs font-semibold text-gray-700 mb-2">
                Información del producto
              </h3>
              <div className="bg-[#f3ebe7] rounded-md border border-gray-300 p-3">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-white rounded-full border border-gray-300">
                    <FiPackage className="text-gray-900" size={16} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {movimiento.producto.nombre}
                    </h4>
                    <p className="text-xs text-gray-700">
                      {movimiento.producto.codigoProducto}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs md:text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock anterior:</span>
                    <span className="font-medium text-gray-900">
                      {
                        movimiento.producto.stock -
                        (esEntrada ? -movimiento.cantidad : movimiento.cantidad)
                      }{" "}
                      unidades
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Movimiento:</span>
                    <span
                      className={`font-bold ${
                        esEntrada ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {esEntrada ? "+" : "-"}
                      {movimiento.cantidad} unidades
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 mt-2 border-t border-gray-300">
                    <span className="text-gray-700 font-medium">
                      Stock actual:
                    </span>
                    <span
                      className={`font-bold ${
                        movimiento.producto.stock <=
                        movimiento.producto.stockMinimo
                          ? "text-red-800"
                          : movimiento.producto.stock <=
                            movimiento.producto.stockMinimo * 2
                          ? "text-yellow-800"
                          : "text-green-800"
                      }`}
                    >
                      {movimiento.producto.stock} unidades
                    </span>
                  </div>

                  {movimiento.producto.stock <=
                    movimiento.producto.stockMinimo && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                      ⚠️ Stock por debajo del mínimo (
                      {movimiento.producto.stockMinimo} unidades)
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detalles adicionales */}
          <div className="border-t border-gray-300 pt-4">
            <h3 className="text-xs font-semibold text-gray-700 mb-3">
              Detalles adicionales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="bg-[#f0e7e2] p-3 rounded-md border border-gray-300">
                <div className="text-xs text-gray-600 mb-1">
                  Precio de venta
                </div>
                <div className="font-semibold text-gray-900">
                  Bs.{" "}
                  {parseFloat(
                    movimiento.producto.precioVenta.toString()
                  ).toFixed(2)}
                </div>
              </div>

              <div className="bg-[#f0e7e2] p-3 rounded-md border border-gray-300">
                <div className="text-xs text-gray-600 mb-1">
                  Precio de compra
                </div>
                <div className="font-semibold text-gray-900">
                  Bs.{" "}
                  {parseFloat(
                    movimiento.producto.precioCompra.toString()
                  ).toFixed(2)}
                </div>
              </div>

              <div className="bg-[#f0e7e2] p-3 rounded-md border border-gray-300">
                <div className="text-xs text-gray-600 mb-1">Estado</div>
                <div
                  className={`font-semibold ${
                    movimiento.producto.estado === "activo"
                      ? "text-green-800"
                      : "text-red-800"
                  }`}
                >
                  {movimiento.producto.estado === "activo"
                    ? "Activo ✓"
                    : "Inactivo ✗"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-3 border-t border-gray-300 flex justify-end rounded-b-md bg-[#e5ddda]">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-white rounded-sm text-sm hover:bg-black"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovimientoDetalleModal;
