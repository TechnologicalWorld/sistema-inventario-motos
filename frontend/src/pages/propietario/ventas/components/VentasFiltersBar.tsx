import { FiSearch } from "react-icons/fi";
import { UISelectedFilters } from "../hooks/useVentasList";

interface Props {
  uiFilters: UISelectedFilters;
  onChangeFilters: (patch: Partial<UISelectedFilters>) => void;
  onBuscar: () => void;
  onAplicarFiltros: () => void;
  empleadosOptions: { id: number; nombre: string }[];
}

export const VentasFiltersBar: React.FC<Props> = ({
  uiFilters,
  onChangeFilters,
  onBuscar,
  onAplicarFiltros,
  empleadosOptions,
}) => {
  return (
    <div className="mb-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* IZQUIERDA: Buscador */}
        <div className="flex items-stretch">
          <div className="flex items-center bg-white border border-gray-400 rounded-l-full px-3 py-1.5 min-w-[260px]">
            <span className="text-gray-500 mr-2">
              <FiSearch />
            </span>
            <input
              type="text"
              placeholder="Buscar ventas..."
              className="flex-1 text-sm outline-none"
              value={uiFilters.search}
              onChange={(e) => onChangeFilters({ search: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && onBuscar()}
            />
          </div>
          <button
            onClick={onBuscar}
            className="px-5 py-1.5 rounded-r-full bg-black text-white text-sm hover:bg-gray-900 transition -ml-px"
          >
            Buscar
          </button>
        </div>

        {/* DERECHA: Filtros */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Desde */}
          <input
            type="date"
            value={uiFilters.fechaDesde}
            onChange={(e) =>
              onChangeFilters({ fechaDesde: e.target.value })
            }
            className="px-4 py-2 text-sm border border-gray-400 rounded-full bg-white"
          />

          {/* Hasta */}
          <input
            type="date"
            value={uiFilters.fechaHasta}
            onChange={(e) =>
              onChangeFilters({ fechaHasta: e.target.value })
            }
            className="px-4 py-2 text-sm border border-gray-400 rounded-full bg-white"
          />

          {/* Empleado */}
          <select
            className="px-4 py-2 text-sm border border-gray-400 rounded-full bg-white min-w-[180px]"
            value={uiFilters.empleadoId}
            onChange={(e) =>
              onChangeFilters({ empleadoId: e.target.value })
            }
          >
            <option value="">Empleado</option>
            {empleadosOptions.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.nombre}
              </option>
            ))}
          </select>

          {/* Método de pago */}
          <select
            className="px-4 py-2 text-sm border border-gray-400 rounded-full bg-white min-w-[160px]"
            value={uiFilters.metodoPago}
            onChange={(e) =>
              onChangeFilters({ metodoPago: e.target.value })
            }
          >
            <option value="">Método de pago</option>
            <option value="efectivo">Efectivo</option>
            <option value="tarjeta">Tarjeta</option>
            <option value="transferencia">Transferencia</option>
          </select>

          <button
            onClick={onAplicarFiltros}
            className="px-5 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-900 transition"
          >
            Aplicar filtros
          </button>

          <button
            onClick={() =>
              onChangeFilters({
                search: "",
                fechaDesde: "",
                fechaHasta: "",
                empleadoId: "",
                metodoPago: "",
              })
            }
            className="px-5 py-2 rounded-full bg-gray-500 text-white text-sm hover:bg-gray-600 transition"
          >
            Limpiar filtros
          </button>

        </div>
      </div>
    </div>
  );
};
