import React from "react";
import { useCompraDetalle } from "../hooks/useCompraDetalle";
import { DetalleCompra } from "../compras.service";

interface Props {
  compraId: number | null;
  open: boolean;
  onClose: () => void;
}

function formatFecha(fechaIso: string) {
  if (!fechaIso) return "-";
  const d = new Date(fechaIso);
  if (Number.isNaN(d.getTime())) return "-";
  const dia = d.getDate().toString().padStart(2, "0");
  const mes = (d.getMonth() + 1).toString().padStart(2, "0");
  const anio = d.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

function formatIdCompra(id: number) {
  return `C-${id.toString().padStart(4, "0")}`;
}

function formatBs(value: string | number) {
  const num = Number(value || 0);
  return `Bs. ${num.toFixed(2)}`;
}

const CompraDetalleModal: React.FC<Props> = ({ compraId, open, onClose }) => {
  const { data, loading, error } = useCompraDetalle(compraId, open);

  if (!open) return null;

  const detalles: DetalleCompra[] = data?.detalle_compras ?? [];

  const totalItems = detalles.length;
  const totalUnidades = detalles.reduce(
    (acc, d) => acc + (d.cantidad || 0),
    0
  );
  const totalPago = Number(data?.totalPago || 0);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[#f5ede8] w-[95%] max-w-3xl rounded-md shadow-lg border border-gray-400 max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="bg-[#e5ddda] px-6 py-3 rounded-t-md">
          <h2 className="font-semibold text-lg text-gray-800 text-center">
            {data
              ? `DETALLE DE COMPRA / ${formatIdCompra(data.idCompra)}`
              : "DETALLE DE COMPRA"}
          </h2>
        </div>

        {/* BODY */}
        <div className="px-6 py-4 text-sm space-y-4">
          {loading && (
            <div className="text-center text-gray-600">
              Cargando detalle de la compra...
            </div>
          )}
          {!loading && error && (
            <div className="text-center text-red-600">{error}</div>
          )}

          {!loading && !error && data && (
            <>
              {/* Info superior */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 border border-gray-300 bg-[#f0e7e2] rounded-md p-3">
                <div className="space-y-1">
                  <div>
                    <span className="font-semibold">Fecha: </span>
                    <span>{formatFecha(data.fecha)}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Proveedor: </span>
                    <span>{data.empresa_proveedora?.nombre ?? "-"}</span>
                  </div>
                  <div>
                    <span className="font-semibold">Gerente: </span>
                    <span>
                      {data.gerente?.persona
                        ? `${data.gerente.persona.nombres} ${data.gerente.persona.paterno}`
                        : "-"}
                    </span>
                  </div>
                  <div>
                    <span className="font-semibold">Observación: </span>
                    <span>{data.observacion || "-"}</span>
                  </div>
                </div>
              </div>

              {/* Tabla de items */}
              <div className="mt-4">
                <h3 className="font-semibold mb-2 text-gray-800">
                  Detalle de Compra
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
                            La compra no tiene ítems registrados.
                          </td>
                        </tr>
                      )}

                      {detalles.map((d, idx) => (
                        <tr
                          key={d.idDetalleCompra}
                          className={
                            idx % 2 === 0 ? "bg-[#f8f2ee]" : "bg-[#efe4dd]"
                          }
                        >
                          <td className="px-4 py-2">
                            {d.producto?.nombre ?? "-"}
                          </td>
                          <td className="px-4 py-2">
                            {formatBs(d.precioUnitario)}
                          </td>
                          <td className="px-4 py-2">{d.cantidad}</td>
                          <td className="px-4 py-2">
                            {formatBs(d.subTotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Resumen */}
              <div className="mt-4 flex justify-end">
                <div className="border border-gray-300 bg-[#f0e7e2] rounded-md px-4 py-3 text-sm w-full md:w-72">
                  <h4 className="font-semibold mb-2 text-gray-800">
                    Resumen de Compra
                  </h4>
                  <div className="flex justify-between">
                    <span>Total ítems:</span>
                    <span>{totalItems}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total unidades:</span>
                    <span>{totalUnidades}</span>
                  </div>
                  <div className="flex justify-between font-semibold mt-2">
                    <span>Total pago:</span>
                    <span>{formatBs(totalPago)}</span>
                  </div>
                </div>
              </div>
            </>
          )}
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

export default CompraDetalleModal;
