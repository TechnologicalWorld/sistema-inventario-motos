import React from "react";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiUserPlus
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
  onVerDetalle: (cliente: ClienteConResumen) => void; // CAMBIADO: de historial a detalle
  onAgregarCliente: () => void; // NUEVO
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
  onVerDetalle,
  onAgregarCliente // NUEVO
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
            Gestión de Clientes - Empleado
          </h1>
        </div>
        
        {/* NUEVO: Botón agregar cliente */}
        <button
          onClick={onAgregarCliente}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          <FiUserPlus />
          Agregar Cliente
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-5">
        <div className="flex flex-wrap items-center gap-3 justify-start">
          <div className="flex items-stretch">
            <div className="flex items-center bg-white border border-gray-400 rounded-l-full px-3 py-1.5 min-w-[260px]">
              <span className="text-gray-500 mr-2">
                <FiSearch />
              </span>
              <input
                type="text"
                placeholder="Buscar por CI, nombre o apellido..."
                className="flex-1 text-sm outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleBuscarClick()}
              />
            </div>
            <button
              onClick={handleBuscarClick}
              className="px-5 py-1.5 rounded-r-full bg-black text-white text-sm hover:bg-gray-900 transition -ml-px"
            >
              Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Tabla - CAMBIADO: Columnas simplificadas para empleado */}
      <div className="bg-[#f3ebe7] border border-gray-300 rounded-md overflow-hidden">
        <table className="w-full text-xs md:text-sm">
          <thead className="bg-gray-300">
            <tr className="text-left">
              <th className="px-4 py-2 font-semibold">CI / NIT</th>
              <th className="px-4 py-2 font-semibold">Nombre Completo</th>
              <th className="px-4 py-2 font-semibold">Teléfono</th>
              <th className="px-4 py-2 font-semibold">Fecha Registro</th>
              <th className="px-4 py-2 font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-600">
                  Cargando clientes...
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

            {!loading && !error && clientes.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-600">
                  No hay clientes registrados.
                </td>
              </tr>
            )}

            {!loading &&
              !error &&
              clientes.map((c, idx) => {
                const persona = c.persona;
                const ciNit = `${persona.ci} / ${c.nit ?? "—"}`;
                const nombreCompleto = `${persona.nombres} ${persona.paterno} ${persona.materno}`;
                const fechaRegistro = new Date(c.created_at).toLocaleDateString();

                return (
                  <tr
                    key={c.idCliente}
                    className={idx % 2 === 0 ? "bg-[#f8f2ee]" : "bg-[#efe4dd]"}
                  >
                    <td className="px-4 py-2">{ciNit}</td>
                    <td className="px-4 py-2">{nombreCompleto}</td>
                    <td className="px-4 py-2">{persona.telefono}</td>
                    <td className="px-4 py-2">{fechaRegistro}</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onVerDetalle(c)}
                          className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs hover:bg-blue-700"
                          title="Ver detalle"
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

      {/* Paginación (igual) */}
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