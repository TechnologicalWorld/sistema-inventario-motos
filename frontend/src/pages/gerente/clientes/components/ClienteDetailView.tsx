import React, { useEffect, useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiEye } from "react-icons/fi";
import { ClienteConResumen } from "../hooks/useClientesList";
import { useClienteHistorial } from "../hooks/useClienteHistorial";
import VentaDetalleModal from "./VentaDetalleModal";
import { VentaHistorial } from "../clientes.service";

interface Props {
  cliente: ClienteConResumen;
  onVolver: () => void;
}

function formatFecha(fechaIso: string | null | undefined) {
  if (!fechaIso) return "-";
  const d = new Date(fechaIso);
  if (Number.isNaN(d.getTime())) return "-";
  const dia = d.getDate().toString().padStart(2, "0");
  const mes = (d.getMonth() + 1).toString().padStart(2, "0");
  const anio = d.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

const ClienteDetailView: React.FC<Props> = ({ cliente, onVolver }) => {
  const { data, resumen, loading, error } = useClienteHistorial(
    cliente.idCliente
  );

  const [ventaSeleccionada, setVentaSeleccionada] =
    useState<VentaHistorial | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const ventas = data?.ventas ?? [];

  // ---------- paginación del historial ----------
  const [histPage, setHistPage] = useState(1);
  const HIST_PER_PAGE = 5;

  // cuando cambie el cliente, volvemos a la página 1
  useEffect(() => {
    setHistPage(1);
  }, [cliente.idCliente]);

  const totalHistPages = Math.max(
    1,
    Math.ceil(ventas.length / HIST_PER_PAGE)
  );

  const ventasPagina = useMemo(() => {
    const start = (histPage - 1) * HIST_PER_PAGE;
    return ventas.slice(start, start + HIST_PER_PAGE);
  }, [histPage, ventas]);
  // ----------------------------------------------

  const handleVerVenta = (v: VentaHistorial) => {
    setVentaSeleccionada(v);
    setModalOpen(true);
  };

  const persona = cliente.persona;
  const nombreCompleto = `${persona.nombres} ${persona.paterno}`;

  return (
    <div className="w-full">
      {/* Encabezado principal */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Detalle de Cliente - {nombreCompleto}
        </h1>
      </div>

      {/* Resumen superior */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-sm">
        <div className="bg-[#f0e7e2] border border-gray-300 rounded-md p-3">
          <div className="font-semibold mb-1">Nombre</div>
          <div>{nombreCompleto}</div>
          <div className="mt-2 flex justify-between">
            <span className="font-semibold">CI/NIT:</span>
            <span>
              {persona.ci} / {cliente.nit ?? "—"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Teléfono:</span>
            <span>{persona.telefono}</span>
          </div>
        </div>

        <div className="bg-[#f0e7e2] border border-gray-300 rounded-md p-3">
          <div className="font-semibold mb-1">Total gastado (Bs.)</div>
          <div className="text-lg font-semibold">
            Bs. {resumen?.totalGastado.toFixed(2) ?? "0.00"}
          </div>
          <div className="mt-2 flex justify-between">
            <span className="font-semibold">Ticket promedio</span>
            <span>
              Bs. {resumen ? resumen.ticketPromedio.toFixed(2) : "0.00"}
            </span>
          </div>
        </div>

        <div className="bg-[#f0e7e2] border border-gray-300 rounded-md p-3 grid grid-cols-2 gap-2">
          <div>
            <div className="font-semibold mb-1">Nº compras</div>
            <div className="text-lg font-semibold">
              {resumen?.numeroCompras ?? 0}
            </div>
          </div>
          <div>
            <div className="font-semibold mb-1">Última compra</div>
            <div>
              {resumen ? formatFecha(resumen.ultimaCompra) : "-"}
            </div>
          </div>
        </div>
      </div>

      {/* Título historial */}
      <h2 className="text-base md:text-lg font-semibold mb-2">
        Historial de compras
      </h2>

      {/* Tabla historial */}
      <div className="bg-[#f3ebe7] border border-gray-300 rounded-md overflow-hidden mb-4">
        <table className="w-full text-xs md:text-sm">
          <thead className="bg-gray-300">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">id Venta</th>
              <th className="px-4 py-2 text-left font-semibold">Fecha</th>
              <th className="px-4 py-2 text-left font-semibold">
                Empleado (Vendedor)
              </th>
              <th className="px-4 py-2 text-left font-semibold">
                Método de pago
              </th>
              <th className="px-4 py-2 text-left font-semibold">
                Monto Total
              </th>
              <th className="px-4 py-2 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-gray-600"
                >
                  Cargando historial de compras...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-red-600"
                >
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && ventas.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-6 text-gray-600"
                >
                  El cliente no tiene compras registradas.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              ventas.length > 0 &&
              ventasPagina.map((v, idx) => (
                <tr
                  key={v.idVenta}
                  className={
                    idx % 2 === 0 ? "bg-[#f8f2ee]" : "bg-[#efe4dd]"
                  }
                >
                  <td className="px-4 py-2">
                    V-{v.idVenta.toString().padStart(4, "0")}
                  </td>
                  <td className="px-4 py-2">{formatFecha(v.fecha)}</td>
                  <td className="px-4 py-2">
                    {v.empleado.persona.nombres}{" "}
                    {v.empleado.persona.paterno}
                  </td>
                  <td className="px-4 py-2 capitalize">
                    {v.metodoPago}
                  </td>
                  <td className="px-4 py-2">
                    Bs. {Number(v.montoTotal).toFixed(2)}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleVerVenta(v)}
                        className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs hover:bg-indigo-700"
                        title="Ver detalle de venta"
                      >
                        <FiEye />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Botones de navegación inferiores */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onVolver}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-700 text-white text-sm hover:bg-gray-800"
        >
          <FiChevronLeft />
          Volver
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setHistPage((p) => Math.max(1, p - 1))}
            disabled={histPage <= 1}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-md text-sm
              bg-[#c0163b] text-white hover:bg-[#a41333]
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            <FiChevronLeft />
            Anterior
          </button>
          <button
            onClick={() =>
              setHistPage((p) => Math.min(totalHistPages, p + 1))
            }
            disabled={histPage >= totalHistPages}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-md text-sm
              bg-[#c0163b] text-white hover:bg-[#a41333]
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            Siguiente
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* Modal detalle venta */}
      <VentaDetalleModal
        venta={ventaSeleccionada}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default ClienteDetailView;
