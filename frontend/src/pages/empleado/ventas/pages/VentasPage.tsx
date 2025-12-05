// src/pages/empleado/ventas/pages/VentasPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVentasList } from "../hooks/useVentasList";
import { Venta } from "../services/empleado.ventas.service";
import VentasTable from "../components/VentasTable";
import VentaDetalleModal from "../components/VentaDetalleModal";
import RegistrarVentaModal from "../components/RegistrarVentaModal";
import { FiUsers, FiShoppingCart } from "react-icons/fi";

const VentasPage: React.FC = () => {
  // Estado modales
  const [ventaSeleccionada, setVentaSeleccionada] = useState<Venta | null>(null);
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [modalRegistrarOpen, setModalRegistrarOpen] = useState(false);

  const navigate = useNavigate();

  let hookResult;
  try {
    hookResult = useVentasList();
  } catch (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-xl font-bold text-red-800 mb-2">
            Error de carga
          </h2>
          <p className="text-red-700">
            No se pudo cargar el módulo de ventas.
          </p>
          <p className="text-red-600 text-sm mt-2">
            Error: {error instanceof Error ? error.message : "Desconocido"}
          </p>
        </div>
      </div>
    );
  }

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

  const handleSearch = () => {
    loadVentas(1, search);
  };

  const handleChangePage = (newPage: number) => {
    if (newPage < 1 || newPage > lastPage) return;
    setPage(newPage);
    loadVentas(newPage, search);
  };

  const handleVerDetalle = (venta: Venta) => {
    setVentaSeleccionada(venta);
    setModalDetalleOpen(true);
  };

  const handleRegistrarVenta = async (ventaData: any): Promise<boolean> => {
    const ok = await crearVenta(ventaData);
    if (ok) {
      // refrescar list
      loadVentas(page, search);
    }
    return ok;
  };

  const irAClientes = () => {
    navigate("/empleado/clientes");
  };

  return (
    <div className="w-full space-y-4">
      {/* HEADER PÁGINA */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
            Gestión de ventas
          </h1>
          <p className="text-sm text-gray-600">
            Revisa el historial de ventas y registra nuevas operaciones.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={irAClientes}
            className="flex items-center gap-2 px-4 py-2 rounded-sm text-sm bg-white border border-gray-500 text-gray-900 hover:bg-gray-100"
          >
            <FiUsers />
            Agregar cliente
          </button>
          <button
            onClick={() => setModalRegistrarOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-sm text-sm bg-black text-white hover:bg-gray-900"
          >
            <FiShoppingCart />
            Registrar venta
          </button>
        </div>
      </div>

      {/* ERROR GENERAL */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 flex justify-between items-center">
          <span>{error}</span>
          <button
            onClick={() => loadVentas(1, search)}
            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* TABLA / CONTENIDO */}
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
      />

      {/* MODALES */}
      <VentaDetalleModal
        venta={ventaSeleccionada}
        open={modalDetalleOpen}
        onClose={() => {
          setModalDetalleOpen(false);
          setVentaSeleccionada(null);
        }}
      />

      <RegistrarVentaModal
        open={modalRegistrarOpen}
        onClose={() => setModalRegistrarOpen(false)}
        onRegistrarVenta={handleRegistrarVenta}
      />
    </div>
  );
};

export default VentasPage;
