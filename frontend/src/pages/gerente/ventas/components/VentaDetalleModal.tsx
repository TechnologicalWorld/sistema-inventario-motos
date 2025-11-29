import { Venta } from "../ventas.service";

interface Props {
  venta: Venta | null;
  open: boolean;
  onClose: () => void;
}

export const VentaDetalleModal: React.FC<Props> = ({
  venta,
  open,
  onClose,
}) => {
  if (!open || !venta) return null;

  const fechaObj = new Date(venta.fecha);
  const fechaStr = fechaObj.toLocaleDateString();
  const horaStr = fechaObj.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const clientePersona = venta.cliente.persona;
  const empleadoPersona = venta.empleado.persona;

  const clienteTexto = `${clientePersona.nombres} ${clientePersona.paterno} (C.I.: ${clientePersona.ci}, Tel. ${clientePersona.telefono})`;
  const vendedorTexto = `${empleadoPersona.nombres} ${empleadoPersona.paterno}`;

  const totalItems = venta.detalle_ventas.reduce(
    (acc, det) => acc + det.cantidad,
    0
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[#f5ede8] w-full max-w-3xl rounded-md shadow-lg border border-gray-400">
        {/* Header */}
        <div className="bg-[#e5ddda] px-6 py-3 rounded-t-md text-left">
          <h2 className="font-semibold text-lg text-gray-800">
            DETALLE DE VENTA / V-{venta.idVenta.toString().padStart(4, "0")}
          </h2>
        </div>

        {/* Info principal */}
        <div className="px-6 py-4 text-sm">
          <div className="grid sm:grid-cols-2 gap-y-1 gap-x-4 mb-4">
            <div className="flex gap-2">
              <span className="font-semibold">Fecha:</span>
              <span>{fechaStr}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Hora:</span>
              <span>{horaStr}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Cliente:</span>
              <span>{clienteTexto}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Vendedor:</span>
              <span>{vendedorTexto}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Método de pago:</span>
              <span className="capitalize">{venta.metodoPago}</span>
            </div>
          </div>

          {/* Detalle de la venta */}
          <h3 className="font-semibold mb-2">Detalle de venta</h3>
          <div className="border border-gray-400 bg-[#f3ebe7] rounded-md overflow-hidden mb-4">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-gray-300">
                <tr>
                  <th className="px-2 py-1 text-left">Item</th>
                  <th className="px-2 py-1 text-left">
                    Producto (id Producto)
                  </th>
                  <th className="px-2 py-1 text-right">
                    Precio Unitario
                  </th>
                  <th className="px-2 py-1 text-right">Cantidad</th>
                  <th className="px-2 py-1 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {venta.detalle_ventas.map((det, idx) => {
                  const nombreProd =
                    det.producto?.nombre ||
                    det.descripcion ||
                    `Producto ${det.idProducto}`;
                  return (
                    <tr
                      key={det.idDetalleVenta}
                      className={
                        idx % 2 === 0
                          ? "bg-[#f8f2ee]"
                          : "bg-[#efe4dd]"
                      }
                    >
                      <td className="px-2 py-1">{idx + 1}</td>
                      <td className="px-2 py-1">
                        {nombreProd} (P-{det.idProducto.toString().padStart(3, "0")})
                      </td>
                      <td className="px-2 py-1 text-right">
                        Bs. {Number(det.precioUnitario).toFixed(2)}
                      </td>
                      <td className="px-2 py-1 text-right">
                        {det.cantidad}
                      </td>
                      <td className="px-2 py-1 text-right">
                        Bs. {Number(det.subTotal).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Resumen lateral */}
          <div className="flex flex-col sm:flex-row sm:justify-end">
            <div className="border border-gray-400 bg-[#ece5e0] rounded-md px-4 py-3 text-sm w-full sm:w-72">
              <h4 className="font-semibold mb-2">Resumen de venta</h4>
              <div className="flex justify-between mb-1">
                <span>Total ítems:</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between">
                <span>Monto total:</span>
                <span className="font-semibold">
                  Bs. {Number(venta.montoTotal).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
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
