import React, { useState, useEffect } from "react";
import { useInventarioList } from "../hooks/useInventarioList";
import { Producto } from "../service/empleado.inventario.service";
import ProductosTable from "../components/ProductosTable";
import ProductoDetalleModal from "../components/ProductoDetalleModal";

const InventarioPage: React.FC = () => {
  const {
    productos,
    loading,
    error,
    page,
    lastPage,
    search,
    setSearch,
    filtroStockBajo,
    setFiltroStockBajo,
    loadProductos,
    setPage,
  } = useInventarioList();

  const [productoSeleccionado, setProductoSeleccionado] =
    useState<Producto | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleSearch = () => {
    loadProductos(1, search, filtroStockBajo);
  };

  const handleChangePage = (newPage: number) => {
    if (newPage < 1 || newPage > lastPage) return;
    setPage(newPage);
    loadProductos(newPage, search, filtroStockBajo);
  };

  const handleVerDetalle = (producto: Producto) => {
    setProductoSeleccionado(producto);
    setModalOpen(true);
  };

  // recargar cuando cambia filtro de stock bajo
  useEffect(() => {
    loadProductos(1, search, filtroStockBajo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtroStockBajo]);

  return (
    <div className="w-full space-y-4">
      {/* Título estilo gerente */}
      <div className="mb-2">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Inventario de productos
        </h1>
        <p className="text-sm text-gray-600">
          Consulta rápida del stock disponible para el empleado.
        </p>
      </div>

      <ProductosTable
        productos={productos}
        loading={loading}
        error={error}
        page={page}
        lastPage={lastPage}
        search={search}
        setSearch={setSearch}
        filtroStockBajo={filtroStockBajo}
        setFiltroStockBajo={setFiltroStockBajo}
        onSearch={handleSearch}
        onChangePage={handleChangePage}
        onVerDetalle={handleVerDetalle}
      />

      <ProductoDetalleModal
        producto={productoSeleccionado}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default InventarioPage;
