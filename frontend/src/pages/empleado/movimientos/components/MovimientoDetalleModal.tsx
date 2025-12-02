import React from "react";
import { FiX, FiTrendingUp, FiTrendingDown, FiPackage } from "react-icons/fi";
import { Movimiento } from "../services/empleado.movimientos.service";

interface Props {
  movimiento: Movimiento | null;
  open: boolean;
  onClose: () => void;
}

function formatFecha(fechaIso: string) {
  const d = new Date(fechaIso);
  if (Number.isNaN(d.getTime())) return "-";
  
  const dia = d.getDate().toString().padStart(2, "0");
  const mes = (d.getMonth() + 1).toString().padStart(2, "0");
  const anio = d.getFullYear();
  const horas = d.getHours().toString().padStart(2, "0");
  const mins = d.getMinutes().toString().padStart(2, "0");
  const segs = d.getSeconds().toString().padStart(2, "0");
  
  return {
    fecha: `${dia}/${mes}/${anio}`,
    hora: `${horas}:${mins}:${segs}`,
    completa: `${dia}/${mes}/${anio} ${horas}:${mins}:${segs}`
  };
}

const MovimientoDetalleModal: React.FC<Props> = ({ movimiento, open, onClose }) => {
  if (!open || !movimiento) return null;

  const { fecha, hora, completa } = formatFecha(movimiento.fechaMovimiento);
  const fechaRegistro = formatFecha(movimiento.created_at);
  const esEntrada = movimiento.tipo === "entrada";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-2xl rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`px-6 py-4 rounded-t-lg flex justify-between items-center ${
          esEntrada ? "bg-green-50 border-b border-green-200" : "bg-red-50 border-b border-red-200"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${esEntrada ? "bg-green-100" : "bg-red-100"}`}>
              {esEntrada ? (
                <FiTrendingUp className={`${esEntrada ? "text-green-600" : "text-red-600"}`} size={20} />
              ) : (
                <FiTrendingDown className={`${esEntrada ? "text-green-600" : "text-red-600"}`} size={20} />
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                Movimiento M-{movimiento.idMovimiento.toString().padStart(4, "0")}
              </h2>
              <p className={`text-sm ${esEntrada ? "text-green-700" : "text-red-700"}`}>
                {esEntrada ? "Entrada de inventario" : "Salida de inventario"}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 hover:bg-gray-100 rounded-full"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Información General */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Información del Movimiento</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha del movimiento:</span>
                    <span className="font-medium">{fecha}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hora:</span>
                    <span className="font-medium">{hora}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tipo:</span>
                    <span className={`font-medium ${esEntrada ? "text-green-700" : "text-red-700"}`}>
                      {esEntrada ? "Entrada (+) " : "Salida (-) "}
                      {movimiento.cantidad} unidades
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fecha de registro:</span>
                    <span className="font-medium">{fechaRegistro.fecha}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Observación</h3>
                <div className="bg-gray-50 p-3 rounded border border-gray-200">
                  <p className="text-gray-700">
                    {movimiento.observacion || "Sin observación"}
                  </p>
                </div>
              </div>
            </div>

            {/* Información del Producto */}
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Información del Producto</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <FiPackage className="text-blue-600" size={18} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{movimiento.producto.nombre}</h4>
                    <p className="text-sm text-gray-600">{movimiento.producto.codigoProducto}</p>
                  </div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Stock anterior:</span>
                    <span className="font-medium">
                      {movimiento.producto.stock - (esEntrada ? -movimiento.cantidad : movimiento.cantidad)} unidades
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Movimiento:</span>
                    <span className={`font-bold ${esEntrada ? "text-green-700" : "text-red-700"}`}>
                      {esEntrada ? "+" : "-"}{movimiento.cantidad} unidades
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-300">
                    <span className="text-gray-600 font-medium">Stock actual:</span>
                    <span className={`font-bold ${
                      movimiento.producto.stock <= movimiento.producto.stockMinimo
                        ? "text-red-700"
                        : movimiento.producto.stock <= movimiento.producto.stockMinimo * 2
                        ? "text-yellow-700"
                        : "text-green-700"
                    }`}>
                      {movimiento.producto.stock} unidades
                    </span>
                  </div>
                  {movimiento.producto.stock <= movimiento.producto.stockMinimo && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700">
                      ⚠️ Stock por debajo del mínimo ({movimiento.producto.stockMinimo} unidades)
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Detalles adicionales */}
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-sm font-medium text-gray-500 mb-3">Detalles Adicionales</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <div className="text-gray-500 mb-1">Precio de Venta</div>
                <div className="font-semibold text-gray-800">
                  Bs. {parseFloat(movimiento.producto.precioVenta.toString()).toFixed(2)}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <div className="text-gray-500 mb-1">Precio de Compra</div>
                <div className="font-semibold text-gray-800">
                  Bs. {parseFloat(movimiento.producto.precioCompra.toString()).toFixed(2)}
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <div className="text-gray-500 mb-1">Estado</div>
                <div className={`font-semibold ${
                  movimiento.producto.estado === "activo" ? "text-green-700" : "text-red-700"
                }`}>
                  {movimiento.producto.estado === "activo" ? "Activo ✓" : "Inactivo ✗"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovimientoDetalleModal;