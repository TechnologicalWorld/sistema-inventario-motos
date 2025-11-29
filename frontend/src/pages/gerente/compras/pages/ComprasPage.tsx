import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import ComprasTable from "../components/ComprasTable";
import CompraDetalleModal from "../components/CompraDetalleModal";
import NuevaCompraForm from "../components/NuevaCompraForm";
import { useComprasList } from "../hooks/useComprasList";
import {
  ComprasFilters,
  fetchProveedoresOptions,
  ProveedorOption,
} from "../compras.service";

type ViewMode = "list" | "create";

const ComprasPage: React.FC = () => {
  const {
    items,
    meta,
    page,
    setPage,
    filters,
    applyFilters,
    loading,
    error,
    reload,
  } = useComprasList();

  const [view, setView] = useState<ViewMode>("list");
  const [selectedCompraId, setSelectedCompraId] = useState<number | null>(
    null
  );
  const [detalleOpen, setDetalleOpen] = useState(false);

  // Filtros locales 
  const [searchText, setSearchText] = useState(filters.search ?? "");
  const [desde, setDesde] = useState(filters.fecha_inicio ?? "");
  const [hasta, setHasta] = useState(filters.fecha_fin ?? "");
  const [proveedorId, setProveedorId] = useState<string>(
    filters.proveedor ? String(filters.proveedor) : ""
  );

  const [proveedores, setProveedores] = useState<ProveedorOption[]>([]);

  useEffect(() => {
    const loadProveedores = async () => {
      const list = await fetchProveedoresOptions();
      setProveedores(list);
    };
    loadProveedores();
  }, []);

  const syncAndApplyFilters = () => {
    const f: ComprasFilters = {
      search: searchText || undefined,
      fecha_inicio: desde || undefined,
      fecha_fin: hasta || undefined,
      proveedor: proveedorId || undefined,
    };
    applyFilters(f);
  };

  const handleOpenDetalle = (idCompra: number) => {
    setSelectedCompraId(idCompra);
    setDetalleOpen(true);
  };

  const handleCompraSaved = () => {
    setView("list");
    reload();
  };

  return (
    <div className="w-full space-y-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Gestión de Compras
        </h1>

        {view === "list" && (
          <button
            onClick={() => setView("create")}
            className="px-4 py-2 rounded-full bg-blue-700 text-white text-sm hover:bg-blue-800"
          >
            Agregar Compra
          </button>
        )}
      </div>

      {view === "create" ? (
        <NuevaCompraForm
          proveedores={proveedores}
          onCancel={() => setView("list")}
          onSaved={handleCompraSaved}
        />
      ) : (
        <>
          {/* Filtros superiores */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            {/* Buscar */}
            <div className="flex-1 flex items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                  <FiSearch />
                </span>
                <input
                  type="text"
                  placeholder="Buscar Compras..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-full border border-gray-400 bg-white text-sm"
                />
              </div>
              <button
                type="button"
                onClick={syncAndApplyFilters}
                className="px-4 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-800"
              >
                Buscar
              </button>
            </div>

            {/* Fechas + proveedor + aplicar */}
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="date"
                value={desde}
                onChange={(e) => setDesde(e.target.value)}
                className="px-3 py-2 rounded-full border border-gray-400 bg-white text-sm min-w-[150px]"
                placeholder="Desde"
              />
              <input
                type="date"
                value={hasta}
                onChange={(e) => setHasta(e.target.value)}
                className="px-3 py-2 rounded-full border border-gray-400 bg-white text-sm min-w-[150px]"
                placeholder="Hasta"
              />

              <select
                value={proveedorId}
                onChange={(e) => setProveedorId(e.target.value)}
                className="px-3 py-2 rounded-full border border-gray-400 bg-white text-sm min-w-[150px]"
              >
                <option value="">Proveedor</option>
                {proveedores.map((p) => (
                  <option key={p.idEmpresaP} value={p.idEmpresaP}>
                    {p.nombre}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={syncAndApplyFilters}
                className="px-4 py-2 rounded-full bg-black text-white text-sm hover:bg-gray-800"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>

          {/* Tabla */}
          <ComprasTable
            items={items}
            loading={loading}
            error={error}
            page={page}
            totalPages={meta.lastPage}
            onPageChange={setPage}
            onVerDetalle={handleOpenDetalle}
          />

          {/* Modal detalle */}
          <CompraDetalleModal
            compraId={selectedCompraId}
            open={detalleOpen}
            onClose={() => setDetalleOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default ComprasPage;
