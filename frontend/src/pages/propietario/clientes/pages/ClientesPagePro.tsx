import React, { useState } from "react";
import { useClientesList, ClienteConResumen } from "../hooks/useClientesList";
import ClientesTable from "../components/ClientesTable";
import ClienteDetailView from "../components/ClienteDetailView";

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
  } = useClientesList();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [clienteSeleccionado, setClienteSeleccionado] =
    useState<ClienteConResumen | null>(null);

  const handleSearch = () => {
    loadClientes(1, search);
  };

  const handleChangePage = (newPage: number) => {
    if (newPage < 1 || newPage > lastPage) return;
    setPage(newPage);
    loadClientes(newPage, search);
  };

  const handleVerHistorial = (cliente: ClienteConResumen) => {
    setClienteSeleccionado(cliente);
    setViewMode("detail");
  };

  const handleVolver = () => {
    setViewMode("list");
    setClienteSeleccionado(null);
  };

  return (
    <div className="p-6">
      {viewMode === "list" && (
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
          onVerHistorial={handleVerHistorial}
        />
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
