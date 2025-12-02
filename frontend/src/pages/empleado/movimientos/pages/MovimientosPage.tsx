import React, { useState } from "react";
import { useMovimientosList } from "../hooks/useMovimientosList";
import { Movimiento } from "../services/empleado.movimientos.service";

import MovimientosTable from "../components/MovimientosTable";
import MovimientoDetalleModal from "../components/MovimientoDetalleModal";
import AgregarMovimientoModal from "../components/AgregarMovimientoModal";

const MovimientosPage: React.FC = () => {
  console.log("🚀 MovimientosPage - Iniciando render");

  // Estados para modales
  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState<Movimiento | null>(null);
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [modalAgregarOpen, setModalAgregarOpen] = useState(false);

  // Usar el hook
  let hookResult;
  try {
    hookResult = useMovimientosList();
    console.log("✅ Hook de movimientos cargado correctamente");
  } catch (error) {
    console.error("❌ Error al cargar hook:", error);
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error de carga</h2>
          <p className="text-red-700">No se pudo cargar el módulo de movimientos.</p>
          <p className="text-red-600 text-sm mt-2">
            Error: {error instanceof Error ? error.message : "Desconocido"}
          </p>
        </div>
      </div>
    );
  }

  // Desestructurar después de verificar que no hay error
  const {
    movimientos,
    loading,
    error,
    page,
    lastPage,
    total,
    loadMovimientos,
    setPage,
    crearMovimiento,
  } = hookResult;

  // Handlers
  const handleCambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina < 1 || nuevaPagina > lastPage) return;
    setPage(nuevaPagina);
    loadMovimientos(nuevaPagina);
  };

  const handleVerDetalle = (movimiento: Movimiento) => {
    console.log("👁️ Ver detalle movimiento:", movimiento.idMovimiento);
    setMovimientoSeleccionado(movimiento);
    setModalDetalleOpen(true);
  };

  const handleRegistrarMovimiento = async (movimientoData: any): Promise<boolean> => {
    console.log("➕ Registrando movimiento:", movimientoData);
    return await crearMovimiento(movimientoData);
  };

  // Render
  console.log("🎨 Renderizando MovimientosPage:", {
    movimientosCount: movimientos?.length || 0,
    loading,
    error,
    page,
    lastPage,
    total
  });

  return (
    <div className="p-6">
      {/* Mostrar error si existe */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => loadMovimientos(1)}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {/* Mostrar loading */}
      {loading && movimientos.length === 0 ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando movimientos...</p>
        </div>
      ) : (
        <>
          {/* Tabla principal */}
          <MovimientosTable
            movimientos={movimientos || []}
            loading={loading}
            error={error}
            page={page}
            lastPage={lastPage}
            total={total}
            onCambiarPagina={handleCambiarPagina}
            onVerDetalle={handleVerDetalle}
            onAgregarMovimiento={() => {
              console.log("📝 Abriendo modal agregar movimiento");
              setModalAgregarOpen(true);
            }}
          />

          {/* Modales */}
          <MovimientoDetalleModal
            movimiento={movimientoSeleccionado}
            open={modalDetalleOpen}
            onClose={() => {
              console.log("❌ Cerrando modal detalle");
              setModalDetalleOpen(false);
              setMovimientoSeleccionado(null);
            }}
          />

          <AgregarMovimientoModal
            open={modalAgregarOpen}
            onClose={() => {
              console.log("❌ Cerrando modal agregar");
              setModalAgregarOpen(false);
            }}
            onRegistrarMovimiento={handleRegistrarMovimiento}
          />
        </>
      )}
    </div>
  );
};

export default MovimientosPage;