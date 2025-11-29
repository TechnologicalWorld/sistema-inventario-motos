import React from "react";
import { VentaHistorial } from "../clientes.service";

interface Props {
  venta: VentaHistorial | null;
  open: boolean;
  onClose: () => void;
}

function formatFecha(fechaIso: string) {
  const d = new Date(fechaIso);
  if (Number.isNaN(d.getTime())) return fechaIso;
  const dia = d.getDate().toString().padStart(2, "0");
  const mes = (d.getMonth() + 1).toString().padStart(2, "0");
  const anio = d.getFullYear();
  const horas = d.getHours().toString().padStart(2, "0");
  const mins = d.getMinutes().toString().padStart(2, "0");
  return { fecha: `${dia}/${mes}/${anio}`, hora: `${horas}:${mins}` };
}

const VentaDetalleModal: React.FC<Props> = ({ venta, open, onClose }) => {
  if (!open || !venta) return null;

  const { fecha, hora } = formatFecha(venta.fecha);
  const totalItems = venta.detalle_ventas.reduce(
    (acc, item) => acc + item.cantidad,
    0
  );
  const montoTotal = Number(venta.montoTotal || 0);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[#f5ede8] w-full max-w-3xl rounded-md shadow-lg border border-gray-400 max-h-[90vh] overflow-y-auto">
        {/* CABECERA */}
        <div className="bg-[#e5ddda] px-6 py-3 rounded-t-md text-left">
          <h2 className="font-semibold text-lg text-gray-800">
            DETALLE DE VENTA / V-{venta.idVenta.toString().padStart(4, "0")}
          </h2>
        </div>

        {/* INFO GENERAL */}
        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm bg-[#f0e7e2] border-b border-gray-300">
          <div>
            <div className="flex justify-between mb-1">
              <span className="font-semibold">Fecha:</span>
              <span>{fecha}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="font-semibold">Hora:</span>
              <span>{hora}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="font-semibold">Cliente:</span>
              <span>{venta.descripcion}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="font-semibold">Vendedor:</span>
              <span>
                {venta.empleado.persona.nombres}{" "}
                {venta.empleado.persona.paterno}
              </span>
            </div>
            <div className="flex justify-between mb-1">
              <span className="font-semibold">Método de pago:</span>
              <span className="capitalize">{venta.metodoPago}</span>
            </div>
          </div>
        </div>

        {/* TABLA ITEMS */}
        <div className="px-6 pt-4 pb-2">
          <h3 className="font-semibold text-sm mb-2">
            Tabla de items
          </h3>
          <div className="border border-gray-300 bg-[#f3ebe7] rounded-md overflow-hidden">
            <table className="w-full text-xs md:text-sm">
              <thead className="bg-gray-300">
                <tr>
                  <th className="px-2 py-2 text-left font-semibold">
                    Item
                  </th>
                  <th className="px-2 py-2 text-left font-semibold">
                    Producto (Id Producto)
                  </th>
                  <th className="px-2 py-2 text-left font-semibold">
                    Precio Unitario
                  </th>
                  <th className="px-2 py-2 text-left font-semibold">
                    Cantidad
                  </th>
                  <th className="px-2 py-2 text-left font-semibold">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {venta.detalle_ventas.map((item, idx) => (
                  <tr
                    key={item.idDetalleVenta}
                    className={
                      idx % 2 === 0
                        ? "bg-[#f8f2ee]"
                        : "bg-[#efe4dd]"
                    }
                  >
                    <td className="px-2 py-1 text-center">
                      {idx + 1}
                    </td>
                    <td className="px-2 py-1">
                      {item.producto?.nombre ?? item.descripcion}{" "}
                      {item.producto &&
                        `(${item.producto.codigoProducto})`}
                    </td>
                    <td className="px-2 py-1">
                      Bs. {Number(item.precioUnitario).toFixed(2)}
                    </td>
                    <td className="px-2 py-1 text-center">
                      {item.cantidad}
                    </td>
                    <td className="px-2 py-1">
                      Bs. {Number(item.subTotal).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RESUMEN */}
        <div className="px-6 pb-4 flex justify-end">
          <div className="bg-[#f0e7e2] border border-gray-300 rounded-md px-4 py-3 text-sm w-full md:w-64">
            <h4 className="font-semibold mb-2">Resumen de Venta</h4>
            <div className="flex justify-between mb-1">
              <span>Total ítems:</span>
              <span>{totalItems}</span>
            </div>
            <div className="flex justify-between">
              <span>Monto total:</span>
              <span>Bs. {montoTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-3 flex justify-center">
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
