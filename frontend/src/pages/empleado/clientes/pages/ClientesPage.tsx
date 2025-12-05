import React, { useState } from "react";
import { useClientesList, ClienteConResumen } from "../hooks/useClientesList";
import ClientesTable from "../components/ClientesTable";
import ClienteDetailView from "../components/ClienteDetailView";
import AgregarClienteModal from "../components/AgregarClienteModal"; // NUEVO

type ViewMode = "list" | "detail";

const ClientesPage: React.FC = () => {
  const {
    clientes,
    loading,
    error,
    page,
    lastPage,
    search,
    setSearch,
    loadClientes,
    setPage,
    crearCliente, // NUEVO
  } = useClientesList();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteConResumen | null>(null);
  const [modalAgregarOpen, setModalAgregarOpen] = useState(false); // NUEVO

  const handleSearch = () => {
    loadClientes(1, search);
  };

  const handleChangePage = (newPage: number) => {
    if (newPage < 1 || newPage > lastPage) return;
    setPage(newPage);
    loadClientes(newPage, search);
  };

  // CAMBIADO: De historial a detalle simple
  const handleVerDetalle = (cliente: ClienteConResumen) => {
    setClienteSeleccionado(cliente);
    setViewMode("detail");
  };

  const handleVolver = () => {
    setViewMode("list");
    setClienteSeleccionado(null);
  };

  // NUEVO: Manejar agregar cliente
  const handleAgregarCliente = () => {
    setModalAgregarOpen(true);
  };

  const handleCrearCliente = async (clienteData: any) => {
    return await crearCliente(clienteData);
  };

  return (
    <div className="p-6">
      {viewMode === "list" && (
        <>
          <ClientesTable
            clientes={clientes}
            loading={loading}
            error={error}
            page={page}
            lastPage={lastPage}
            search={search}
            setSearch={setSearch}
            onSearch={handleSearch}
            onChangePage={handleChangePage}
            onVerDetalle={handleVerDetalle} // CAMBIADO
            onAgregarCliente={handleAgregarCliente} // NUEVO
          />
          
          {/* NUEVO: Modal para agregar cliente */}
          <AgregarClienteModal
            open={modalAgregarOpen}
            onClose={() => setModalAgregarOpen(false)}
            onCrearCliente={handleCrearCliente}
          />
        </>
      )}

      {viewMode === "detail" && clienteSeleccionado && (
        <ClienteDetailView
          cliente={clienteSeleccionado}
          onVolver={handleVolver}
        />
      )}
    </div>
  );
};

export default ClientesPage;