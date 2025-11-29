import { FiSearch } from "react-icons/fi";
import { Venta } from "../ventas.service";
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
    <div className="space-y-3 mb-5">
      {/* Buscador */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[260px]">
          <div className="flex items-center bg-white border border-gray-400 rounded-full overflow-hidden flex-1">
            <span className="px-3 text-gray-500">
              <FiSearch />
            </span>
            <input
              type="text"
              placeholder="Buscar ventas..."
              className="flex-1 px-2 py-2 text-sm outline-none"
              value={uiFilters.search}
              onChange={(e) =>
                onChangeFilters({ search: e.target.value })
              }
            />
          </div>
          <button
            onClick={onBuscar}
            className="px-5 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-900 transition"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Filtros (Desde, Hasta, Empleado, Método de pago, Aplicar) */}
      <div className="flex flex-wrap gap-3 items-center">
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

        {/* Método de pago (filtro de UI, client-side) */}
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
      </div>
    </div>
  );
};
