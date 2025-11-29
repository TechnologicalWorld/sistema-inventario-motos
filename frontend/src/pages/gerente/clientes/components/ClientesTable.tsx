import React from "react";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
} from "react-icons/fi";
import { ClienteConResumen } from "../hooks/useClientesList";

interface Props {
  clientes: ClienteConResumen[];
  loading: boolean;
  error: string | null;
  page: number;
  lastPage: number;
  search: string;
  setSearch: (value: string) => void;
  onSearch: () => void;
  onChangePage: (page: number) => void;
  onVerHistorial: (cliente: ClienteConResumen) => void;
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

const ClientesTable: React.FC<Props> = ({
  clientes,
  loading,
  error,
  page,
  lastPage,
  search,
  setSearch,
  onSearch,
  onChangePage,
  onVerHistorial,
}) => {
  const handleBuscarClick = () => {
    onSearch();
  };

  return (
    <div className="w-full">
      {/* Header título */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            Gestión de Clientes
          </h1>
          <div className="mt-2 h-[1px] bg-gray-300 w-full" />
        </div>
      </div>

      {/* Barra de búsqueda y filtros */}
      <div className="flex flex-wrap items-center justify-between mb-5 gap-4">
        {/* Buscar */}
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <div className="flex items-center bg-white border border-gray-400 rounded-full overflow-hidden flex-1">
            <span className="px-3 text-gray-500">
              <FiSearch />
            </span>
            <input
              type="text"
              placeholder="Buscar Clientes..."
              className="flex-1 px-2 py-2 text-sm outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={handleBuscarClick}
            className="px-5 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-900 transition"
          >
            Buscar
          </button>
        </div>
        
      </div>

      {/* Tabla */}
      <div className="bg-[#f3ebe7] border border-gray-300 rounded-md overflow-hidden">
        <table className="w-full text-xs md:text-sm">
          <thead className="bg-gray-300">
            <tr className="text-left">
              <th className="px-4 py-2 font-semibold">CI / NIT</th>
              <th className="px-4 py-2 font-semibold">Nombre</th>
              <th className="px-4 py-2 font-semibold">Teléfono</th>
              <th className="px-4 py-2 font-semibold">
                Última compra
              </th>
              <th className="px-4 py-2 font-semibold">
                Nº compras
              </th>
              <th className="px-4 py-2 font-semibold">
                Total gastado
              </th>
              <th className="px-4 py-2 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-6 text-gray-600"
                >
                  Cargando clientes...
                </td>
              </tr>
            )}

            {!loading && error && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-6 text-red-600"
                >
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && clientes.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-6 text-gray-600"
                >
                  No hay clientes registrados.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              clientes.map((c, idx) => {
                const persona = c.persona;
                const resumen = c.resumen;
                const ciNit = `${persona.ci} / ${
                  c.nit ?? "—"
                }`;
                const nombreCompleto = `${persona.nombres} ${persona.paterno}`;
                const ultimaCompra = formatFecha(
                  resumen?.ultimaCompra ?? null
                );
                const numCompras =
                  resumen?.numeroCompras ?? 0;
                const totalGastado =
                  resumen?.totalGastado ?? 0;

                return (
                  <tr
                    key={c.idCliente}
                    className={
                      idx % 2 === 0
                        ? "bg-[#f8f2ee]"
                        : "bg-[#efe4dd]"
                    }
                  >
                    <td className="px-4 py-2">{ciNit}</td>
                    <td className="px-4 py-2">
                      {nombreCompleto}
                    </td>
                    <td className="px-4 py-2">
                      {persona.telefono}
                    </td>
                    <td className="px-4 py-2">
                      {ultimaCompra}
                    </td>
                    <td className="px-4 py-2 text-center">
                      {numCompras}
                    </td>
                    <td className="px-4 py-2">
                      Bs. {totalGastado.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => onVerHistorial(c)}
                          className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs hover:bg-indigo-700"
                          title="Ver historial"
                        >
                          <FiEye />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          disabled={page <= 1}
          onClick={() => onChangePage(page - 1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm ${
            page <= 1
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white text-gray-800 hover:bg-gray-100"
          }`}
        >
          <FiChevronLeft />
          <span>Anterior</span>
        </button>

        <span className="text-sm text-gray-700">
          Página {page} de {lastPage}
        </span>

        <button
          disabled={page >= lastPage}
          onClick={() => onChangePage(page + 1)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm ${
            page >= lastPage
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : "bg-white text-gray-800 hover:bg-gray-100"
          }`}
        >
          <span>Siguiente</span>
          <FiChevronRight />
        </button>
      </div>
    </div>
  );
};

export default ClientesTable;
