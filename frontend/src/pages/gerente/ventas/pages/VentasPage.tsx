import { useMemo, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useVentasList } from "../hooks/useVentasList";
import { VentasFiltersBar } from "../components/VentasFiltersBar";
import { VentasTable } from "../components/VentasTable";
import { VentaDetalleModal } from "../components/VentaDetalleModal";
import { Venta } from "../ventas.service";

export default function VentasPage() {
  const {
    ventas,
    page,
    lastPage,
    loading,
    errorMsg,
    uiFilters,
    updateUiFilters,
    applyFilters,
    goToPage,
    resetFilters,
  } = useVentasList();

  const [ventaDetalle, setVentaDetalle] = useState<Venta | null>(null);

  const empleadosOptions = useMemo(() => {
    const map = new Map<number, string>();

    ventas.forEach((v) => {
      const emp = v.empleado?.persona;
      if (!emp) return;
      const nombre = `${emp.nombres} ${emp.paterno}`;
      map.set(v.empleado.idEmpleado, nombre);
    });

    return Array.from(map.entries()).map(([id, nombre]) => ({
      id,
      nombre,
    }));
  }, [ventas]);

  // filtro client-side por search + método de pago
  const filterFn = (venta: Venta) => {
    const texto = uiFilters.search.trim().toLowerCase();

    if (texto) {
      const emp = venta.empleado.persona;
      const cli = venta.cliente.persona;

      const cadena =
        `v-${venta.idVenta}` +
        ` ${cli.nombres} ${cli.paterno} ${cli.materno} ${cli.ci}` +
        ` ${emp.nombres} ${emp.paterno} ${emp.materno}` +
        ` ${venta.metodoPago}` +
        ` ${venta.descripcion || ""}`;

      if (!cadena.toLowerCase().includes(texto)) {
        return false;
      }
    }

    if (uiFilters.metodoPago) {
      if (venta.metodoPago !== uiFilters.metodoPago) return false;
    }

    return true;
  };

  const handleBuscarClick = () => {
  };

  const handleVerDetalle = (venta: Venta) => {
    setVentaDetalle(venta);
  };

  const handleCloseDetalle = () => {
    setVentaDetalle(null);
  };

  return (
    <div className="p-6">
      {/* Título */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          Listado de ventas
        </h1>
        <div className="mt-2 h-[1px] bg-gray-300 w-full" />
      </div>

      {/* Filtros */}
      <VentasFiltersBar
        uiFilters={uiFilters}
        onChangeFilters={updateUiFilters}
        onBuscar={handleBuscarClick}
        onAplicarFiltros={applyFilters}
        empleadosOptions={empleadosOptions}
      />

      {errorMsg && (
        <div className="mb-3 text-sm text-red-600">
          {errorMsg}
        </div>
      )}

      {/* Tabla */}
      <VentasTable
        ventas={ventas}
        loading={loading}
        filteredSearch={filterFn}
        onVerDetalle={handleVerDetalle}
      />

      {/* Paginación */}
      <div className="mt-5 flex items-center justify-center gap-4">
        <button
          disabled={page <= 1}
          onClick={() => goToPage(page - 1)}
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
          onClick={() => goToPage(page + 1)}
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

      {/* Modal Detalle */}
      <VentaDetalleModal
        venta={ventaDetalle}
        open={!!ventaDetalle}
        onClose={handleCloseDetalle}
      />
    </div>
  );
}
