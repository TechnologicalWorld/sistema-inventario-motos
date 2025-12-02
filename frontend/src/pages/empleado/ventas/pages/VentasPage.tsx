import React, { useState } from "react";
import { useVentasList } from "../hooks/useVentasList";
import { Venta } from "../services/empleado.ventas.service";
import VentasTable from "../components/VentasTable";
import VentaDetalleModal from "../components/VentaDetalleModal";
import RegistrarVentaModal from "../components/RegistrarVentaModal";

const VentasPage: React.FC = () => {
  console.log("🚀 VentasPage - Iniciando render");
  
  // Estado para modales
  const [ventaSeleccionada, setVentaSeleccionada] = useState<Venta | null>(null);
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [modalRegistrarOpen, setModalRegistrarOpen] = useState(false);

  // Usar el hook - CON TRY/CATCH
  let hookResult;
  try {
    hookResult = useVentasList();
    console.log("✅ Hook cargado correctamente");
  } catch (error) {
    console.error("❌ Error al cargar hook:", error);
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error de carga</h2>
          <p className="text-red-700">No se pudo cargar el módulo de ventas.</p>
          <p className="text-red-600 text-sm mt-2">
            Error: {error instanceof Error ? error.message : "Desconocido"}
          </p>
        </div>
      </div>
    );
  }

  // Desestructurar después de verificar que no hay error
  const {
    ventas,
    loading,
    error,
    page,
    lastPage,
    search,
    setSearch,
    loadVentas,
    setPage,
    crearVenta,
  } = hookResult;

  // HANDLERS
  const handleSearch = () => {
    console.log("🔍 Buscando:", search);
    loadVentas(1, search);
  };

  const handleChangePage = (newPage: number) => {
    if (newPage < 1 || newPage > lastPage) return;
    setPage(newPage);
    loadVentas(newPage, search);
  };

  const handleVerDetalle = (venta: Venta) => {
    console.log("👁️ Ver detalle venta:", venta.idVenta);
    setVentaSeleccionada(venta);
    setModalDetalleOpen(true);
  };

  const handleRegistrarVenta = async (ventaData: any): Promise<boolean> => {
    console.log("➕ Registrando venta:", ventaData);
    return await crearVenta(ventaData);
  };

  // RENDER
  console.log("🎨 Renderizando VentasPage:", {
    ventasCount: ventas?.length || 0,
    loading,
    error,
    page,
    lastPage
  });

  return (
    <div className="p-6">
      {/* Mostrar error si existe */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => loadVentas(1, search)}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Mostrar loading */}
      {loading && ventas.length === 0 ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando ventas...</p>
        </div>
      ) : (
        <>
          {/* Tabla principal */}
          <VentasTable
            ventas={ventas || []}
            loading={loading}
            error={error}
            page={page}
            lastPage={lastPage}
            search={search}
            setSearch={setSearch}
            onSearch={handleSearch}
            onChangePage={handleChangePage}
            onVerDetalle={handleVerDetalle}
            onRegistrarVenta={() => {
              console.log("📝 Abriendo modal registrar venta");
              setModalRegistrarOpen(true);
            }}
          />

          {/* Modales */}
          <VentaDetalleModal
            venta={ventaSeleccionada}
            open={modalDetalleOpen}
            onClose={() => {
              console.log("❌ Cerrando modal detalle");
              setModalDetalleOpen(false);
              setVentaSeleccionada(null);
            }}
          />

          <RegistrarVentaModal
            open={modalRegistrarOpen}
            onClose={() => {
              console.log("❌ Cerrando modal registrar");
              setModalRegistrarOpen(false);
            }}
            onRegistrarVenta={handleRegistrarVenta}
          />
        </>
      )}
    </div>
  );
};

export default VentasPage;