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
    search: filtros.search || ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setLocalFiltros(prev => ({
      ...prev,
      [e.target.name]: e.target.value
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
      search: ""
    });
    onLimpiarFiltros();
  };

  const tieneFiltros = 
    localFiltros.fecha_desde || 
    localFiltros.fecha_hasta || 
    localFiltros.tipo !== "todos" ||
    localFiltros.search;

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiFilter className="text-blue-600" />
          <h3 className="text-lg font-semibold">Filtros de Movimientos</h3>
        </div>
        
        {tieneFiltros && (
          <button
            onClick={handleLimpiar}
            className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800"
          >
            <FiX size={16} />
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Fecha Desde */}
        <div>
          <label className="block text-sm font-medium mb-1">Fecha Desde</label>
          <input
            type="date"
            name="fecha_desde"
            value={localFiltros.fecha_desde}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>

        {/* Fecha Hasta */}
        <div>
          <label className="block text-sm font-medium mb-1">Fecha Hasta</label>
          <input
            type="date"
            name="fecha_hasta"
            value={localFiltros.fecha_hasta}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>

        {/* Tipo de Movimiento */}
        <div>
          <label className="block text-sm font-medium mb-1">Tipo</label>
          <select
            name="tipo"
            value={localFiltros.tipo}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            <option value="todos">Todos los tipos</option>
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
          </select>
        </div>

        {/* Búsqueda */}
        <div>
          <label className="block text-sm font-medium mb-1">Buscar Producto</label>
          <input
            type="text"
            name="search"
            value={localFiltros.search}
            onChange={handleChange}
            placeholder="Nombre o código..."
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
      </div>

      {/* Botón Aplicar */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleAplicar}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
        >
          <FiFilter />
          Aplicar Filtros
        </button>
      </div>

      {/* Indicador de filtros activos */}
      {tieneFiltros && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Filtros activos:{" "}
            {localFiltros.fecha_desde && `Desde: ${localFiltros.fecha_desde} `}
            {localFiltros.fecha_hasta && `Hasta: ${localFiltros.fecha_hasta} `}
            {localFiltros.tipo !== "todos" && `Tipo: ${localFiltros.tipo} `}
            {localFiltros.search && `Búsqueda: "${localFiltros.search}"`}
          </p>
        </div>
      )}
    </div>
  );
};

export default FiltrosMovimientos;