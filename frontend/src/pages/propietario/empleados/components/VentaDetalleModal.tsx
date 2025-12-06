import React from "react";
import { FiX } from "react-icons/fi";
import type { Venta } from "../empleados.service";

interface Props {
  open: boolean;
  venta: Venta | null;
  onClose: () => void;
}

const VentaDetalleModal: React.FC<Props> = ({ open, venta, onClose }) => {
  if (!open || !venta) return null;

  function formatFecha(fechaIso: string | undefined | null) {
    if (!fechaIso) return "—";
    const soloFecha = fechaIso.slice(0, 10);
    const [anio, mes, dia] = soloFecha.split("-");
    return `${dia}/${mes}/${anio}`;
  }

  const detalles = venta.detalleVentas || venta.detalle_ventas || [];

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      {/* ✅ Fondo beige principal */}
      <div className="bg-[#f5ede8] w-[95%] max-w-3xl rounded-md shadow-lg border border-gray-400 max-h-[90vh] overflow-y-auto">
        {/* ✅ Header más oscuro */}
        <div className="bg-[#e5ddda] px-6 py-3 rounded-t-md">
          <h2 className="font-semibold text-lg text-gray-800 text-center">
            DETALLE DE VENTA / V-{venta.idVenta.toString().padStart(4, "0")}
          </h2>
        </div>

        {/* ✅ Cuerpo con espaciado y fondos según la imagen */}
        <div className="px-6 py-4 text-sm space-y-4">
          {/* Información general de la venta */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border border-gray-300 bg-[#f0e7e2] rounded-md p-3">
            <div className="space-y-1">
              <div>
                <span className="font-semibold">Fecha:</span>
                <span className="ml-2">{formatFecha(venta.fecha)}</span>
              </div>
              <div>
                <span className="font-semibold">Método de Pago:</span>
                <span className="ml-2">{venta.metodoPago}</span>
              </div>
              <div>
                <span className="font-semibold">Descripción:</span>
                <span className="ml-2">{venta.descripcion || "—"}</span>
              </div>
            </div>
          </div>

          {/* Tabla de detalles */}
          <div>
            <h3 className="font-semibold mb-2 text-gray-800">
              Detalle de Venta
            </h3>
            <div className="border border-gray-300 rounded-md overflow-hidden bg-[#f3ebe7]">
              <table className="w-full text-xs md:text-sm">
                <thead className="bg-gray-300">
                  <tr>
                    <th className="px-4 py-2 text-left font-semibold">
                      Producto
                    </th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Precio Unitario
                    </th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Cantidad
                    </th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {detalles.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-4 text-center text-gray-600"
                      >
                        La venta no tiene ítems registrados.
                      </td>
                    </tr>
                  )}

                  {detalles.map((det, idx) => (
                    <tr
                      key={det.idDetalleVenta}
                      className={
                        idx % 2 === 0 ? "bg-[#f8f2ee]" : "bg-[#efe4dd]"
                      }
                    >
                      <td className="px-4 py-2">{det.descripcion || "—"}</td>
                      <td className="px-4 py-2">
                        Bs. {Number(det.precioUnitario).toFixed(2)}
                      </td>
                      <td className="px-4 py-2">{det.cantidad}</td>
                      <td className="px-4 py-2">
                        Bs. {Number(det.subTotal).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resumen de venta */}
          <div className="flex justify-end">
            <div className="border border-gray-300 bg-[#f0e7e2] rounded-md px-4 py-3 text-sm w-full md:w-72">
              <h4 className="font-semibold mb-2 text-gray-800">
                Resumen de Venta
              </h4>
              <div className="flex justify-between">
                <span>Total ítems:</span>
                <span>{detalles.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total unidades:</span>
                <span>
                  {detalles.reduce((sum, d) => sum + d.cantidad, 0)}
                </span>
              </div>
              <div className="flex justify-between font-semibold mt-2">
                <span>Total pago:</span>
                <span>
                  Bs. {Number(venta.montoTotal).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Footer con botones según la imagen */}
        <div className="px-6 py-3 flex justify-center gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-sm bg-gray-600 text-white text-sm hover:bg-gray-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VentaDetalleModal;