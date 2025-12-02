import React, { useState } from "react";
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

  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null);
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

  // Efecto para recargar cuando cambia el filtro de stock bajo
  React.useEffect(() => {
    loadProductos(1, search, filtroStockBajo);
  }, [filtroStockBajo]);

  return (
    <div className="p-6">
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