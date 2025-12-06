import React from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useEmpleadosList } from "../hooks/useEmpleadosList";
import EmpleadosTable from "../components/EmpleadosTable";
import type { EmpleadoResumen } from "../empleados.service";

const EmpleadosPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    empleados,
    loading,
    error,
    search,
    setSearch,
    currentPage,
    lastPage,
    onPageChange,
  } = useEmpleadosList();

  const handleBuscar = () => {
  };

  const handleVerDetalle = (empleado: EmpleadoResumen) => {
    navigate(`/propietario/empleados/${empleado.id}`);
  };

  return (
    <div className="w-full space-y-4">
      {/* Título */}
      <div className="mb-3">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Gestion Empleados
        </h1>
      </div>

      {/* Barra de búsqueda */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-stretch">
          <div className="flex items-center bg-white border border-gray-300 rounded-l-full px-3 py-1.5 min-w-[260px]">
            <FiSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Buscar Empleado..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
              className="flex-1 text-sm outline-none"
            />
          </div>
          <button
            onClick={handleBuscar}
            className="px-4 py-1.5 rounded-r-full bg-black text-white text-sm hover:bg-gray-800 -ml-px"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Tabla */}
      <EmpleadosTable
        empleados={empleados}
        loading={loading}
        error={error}
        pagination={{
          currentPage,
          lastPage,
          total: empleados.length,
        }}
        onPageChange={onPageChange}
        onVerDesempenio={handleVerDetalle}
      />
    </div>
  );
};

export default EmpleadosPage;
