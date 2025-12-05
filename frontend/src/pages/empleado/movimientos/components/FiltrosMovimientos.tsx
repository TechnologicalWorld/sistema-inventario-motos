// src/pages/empleado/movimientos/components/FiltrosMovimientos.tsx
import React, { useState } from "react";
import { FiFilter, FiX } from "react-icons/fi";

interface Props {
  filtros: {
    fecha_desde?: string;
    fecha_hasta?: string;
    tipo?: "entrada" | "salida" | "todos";
    search?: string;
  };
  onAplicarFiltros: (filtros: any) => void;
  onLimpiarFiltros: () => void;
}

const FiltrosMovimientos: React.FC<Props> = ({
  filtros,
  onAplicarFiltros,
  onLimpiarFiltros,
}) => {
  const [localFiltros, setLocalFiltros] = useState({
    fecha_desde: filtros.fecha_desde || "",
    fecha_hasta: filtros.fecha_hasta || "",
    tipo: filtros.tipo || "todos",
    search: filtros.search || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setLocalFiltros((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleAplicar = () => {
    onAplicarFiltros(localFiltros);
  };

  const handleLimpiar = () => {
    setLocalFiltros({
      fecha_desde: "",
      fecha_hasta: "",
      tipo: "todos",
      search: "",
    });
    onLimpiarFiltros();
  };

  const tieneFiltros =
    localFiltros.fecha_desde ||
    localFiltros.fecha_hasta ||
    localFiltros.tipo !== "todos" ||
    localFiltros.search;

  return (
    <div className="bg-[#f5ede8] border border-gray-400 rounded-md p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-white border border-gray-400">
            <FiFilter className="text-gray-900" />
          </div>
          <div>
            <h3 className="text-sm md:text-base font-semibold text-gray-900">
              Filtros de movimientos
            </h3>
            <p className="text-xs text-gray-600">
              Ajusta el rango de fechas, tipo y búsqueda por producto.
            </p>
          </div>
        </div>

        {tieneFiltros && (
          <button
            onClick={handleLimpiar}
            className="flex items-center gap-1 text-xs text-red-700 hover:text-red-900"
          >
            <FiX size={14} />
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
        {/* Fecha Desde */}
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
            Fecha desde
          </label>
          <input
            type="date"
            name="fecha_desde"
            value={localFiltros.fecha_desde}
            onChange={handleChange}
            className="w-full border border-gray-400 rounded-sm px-3 py-2 bg-[#f9f3ef] focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
          />
        </div>

        {/* Fecha Hasta */}
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
            Fecha hasta
          </label>
          <input
            type="date"
            name="fecha_hasta"
            value={localFiltros.fecha_hasta}
            onChange={handleChange}
            className="w-full border border-gray-400 rounded-sm px-3 py-2 bg-[#f9f3ef] focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
          />
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
            Tipo
          </label>
          <select
            name="tipo"
            value={localFiltros.tipo}
            onChange={handleChange}
            className="w-full border border-gray-400 rounded-sm px-3 py-2 bg-[#f9f3ef] focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
          >
            <option value="todos">Todos los tipos</option>
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
          </select>
        </div>

        {/* Búsqueda */}
        <div>
          <label className="block text-xs font-semibold text-gray-800 mb-1.5">
            Buscar producto
          </label>
          <input
            type="text"
            name="search"
            value={localFiltros.search}
            onChange={handleChange}
            placeholder="Nombre o código..."
            className="w-full border border-gray-400 rounded-sm px-3 py-2 bg-[#f9f3ef] focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
          />
        </div>
      </div>

      {/* Botón aplicar */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleAplicar}
          className="px-4 py-2 bg-black text-white rounded-sm text-sm flex items-center gap-2 hover:bg-gray-900"
        >
          <FiFilter size={14} />
          Aplicar filtros
        </button>
      </div>

      {/* Resumen filtros activos */}
      {tieneFiltros && (
        <div className="mt-3 pt-2 border-t border-gray-300">
          <p className="text-xs text-gray-700">
            Filtros activos:{" "}
            {localFiltros.fecha_desde && `Desde: ${localFiltros.fecha_desde} · `}
            {localFiltros.fecha_hasta && `Hasta: ${localFiltros.fecha_hasta} · `}
            {localFiltros.tipo !== "todos" && `Tipo: ${localFiltros.tipo} · `}
            {localFiltros.search && `Búsqueda: "${localFiltros.search}"`}
          </p>
        </div>
      )}
    </div>
  );
};

export default FiltrosMovimientos;
