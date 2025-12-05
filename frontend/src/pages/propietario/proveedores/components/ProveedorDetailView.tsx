import React, { useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiEye } from "react-icons/fi";
import type { Proveedor } from "../proveedores.service";
import { useProveedorCompras } from "../hooks/useProveedorCompras";
import CompraDetalleModal from "../../compras/components/CompraDetalleModal";

interface Props {
  proveedor: Proveedor;
  onVolver: () => void;
  onAnteriorProveedor?: () => void;
  onSiguienteProveedor?: () => void;
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

const PAGE_SIZE = 5;

const ProveedorDetailView: React.FC<Props> = ({
  proveedor,
  onVolver,
  onAnteriorProveedor,
  onSiguienteProveedor,
}) => {
  const { data, resumen, loading, error } = useProveedorCompras(
    proveedor.idEmpresaP
  );

  const [page, setPage] = useState(1);

  const [compraIdSeleccionada, setCompraIdSeleccionada] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const compras = data?.compras ?? [];

  const comprasPaginadas = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return compras.slice(start, start + PAGE_SIZE);
  }, [compras, page]);

  const totalPages = Math.max(1, Math.ceil(compras.length / PAGE_SIZE));

  const handleVerDetalleCompra = (idCompra: number) => {
    setCompraIdSeleccionada(idCompra);
    setModalOpen(true);
  };

  const handleCerrarModal = () => {
    setModalOpen(false);
    setCompraIdSeleccionada(null);
  };

  return (
    <div className="w-full">
      {/* Título */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Detalle de Proveedor - {proveedor.nombre}
        </h1>
      </div>

      {/* Resumen superior */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-sm">
        {/* Info proveedor */}
        <div className="bg-[#f0e7e2] border border-gray-300 rounded-md p-3">
          <div className="font-semibold mb-1">Nombre</div>
          <div>{proveedor.nombre}</div>

          <div className="mt-2 flex justify-between">
            <span className="font-semibold">Contacto:</span>
            <span>{proveedor.contacto}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Teléfono:</span>
            <span>{proveedor.telefono}</span>
          </div>
          <div className="mt-2">
            <div className="font-semibold mb-1">Dirección:</div>
            <div>{proveedor.direccion}</div>
          </div>
        </div>

        {/* Totales */}
        <div className="bg-[#f0e7e2] border border-gray-300 rounded-md p-3">
          <div className="font-semibold mb-1">Total comprado (Bs.)</div>
          <div className="text-lg font-semibold">
            Bs. {resumen ? resumen.totalComprado.toFixed(2) : "0.00"}
          </div>
          <div className="mt-2 flex justify-between">
            <span className="font-semibold">Ticket promedio</span>
            <span>
              Bs. {resumen ? resumen.ticketPromedio.toFixed(2) : "0.00"}
            </span>
          </div>
        </div>

        {/* Nº compras / última */}
        <div className="bg-[#f0e7e2] border border-gray-300 rounded-md p-3 grid grid-cols-2 gap-2">
          <div>
            <div className="font-semibold mb-1">Nº compras</div>
            <div className="text-lg font-semibold">
              {resumen?.numeroCompras ?? 0}
            </div>
          </div>
          <div>
            <div className="font-semibold mb-1">Última compra</div>
            <div>{resumen ? formatFecha(resumen.ultimaCompra) : "-"}</div>
          </div>
        </div>
      </div>

      {/* Historial de compras */}
      <h2 className="text-base md:text-lg font-semibold mb-2">
        Historial de compras
      </h2>

      <div className="bg-[#f3ebe7] border border-gray-300 rounded-md overflow-hidden mb-4">
        <table className="w-full text-xs md:text-sm">
          <thead className="bg-gray-300">
            <tr>
              <th className="px-4 py-2 text-left font-semibold">id Compra</th>
              <th className="px-4 py-2 text-left font-semibold">Fecha</th>
              <th className="px-4 py-2 text-left font-semibold">Total pago</th>
              <th className="px-4 py-2 text-left font-semibold">Observación</th>
              <th className="px-4 py-2 text-center font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-600">
                  Cargando historial de compras...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-red-600">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && compras.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-600">
                  El proveedor no tiene compras registradas.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              comprasPaginadas.map((c, idx) => (
                <tr
                  key={c.idCompra}
                  className={idx % 2 === 0 ? "bg-[#f8f2ee]" : "bg-[#efe4dd]"}
                >
                  <td className="px-4 py-2">
                    {`C-${c.idCompra.toString().padStart(4, "0")}`}
                  </td>
                  <td className="px-4 py-2">{formatFecha(c.fecha)}</td>
                  <td className="px-4 py-2">
                    Bs. {Number(c.totalPago).toFixed(2)}
                  </td>
                  <td className="px-4 py-2">{c.observacion ?? "—"}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center">
                      <button
                        onClick={() => handleVerDetalleCompra(c.idCompra)}
                        className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs hover:bg-indigo-700"
                        title="Ver detalle de compra"
                      >
                        <FiEye />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* Paginación interna de compras */}
        {compras.length > 0 && (
          <div className="flex items-center justify-center gap-4 px-4 py-3">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-1.5 rounded-md bg-[#c0163b] text-white text-sm hover:bg-[#a41333] disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-700">
              Página {page} de {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-1.5 rounded-md bg-[#c0163b] text-white text-sm hover:bg-[#a41333] disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>

      {/* Navegación inferior */}
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
            onClick={onAnteriorProveedor}
            disabled={!onAnteriorProveedor}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#c0163b] text-white text-sm hover:bg-[#a41333] disabled:opacity-50"
          >
            <FiChevronLeft />
            Anterior
          </button>
          <button
            onClick={onSiguienteProveedor}
            disabled={!onSiguienteProveedor}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#c0163b] text-white text-sm hover:bg-[#a41333] disabled:opacity-50"
          >
            Siguiente
            <FiChevronRight />
          </button>
        </div>
      </div>

      {/* Modal detalle de compra */}
      <CompraDetalleModal
        open={modalOpen}
        compraId={compraIdSeleccionada}
        onClose={handleCerrarModal}
      />
    </div>
  );
};

export default ProveedorDetailView;
