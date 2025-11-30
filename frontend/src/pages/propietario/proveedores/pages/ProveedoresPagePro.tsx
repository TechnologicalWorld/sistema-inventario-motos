import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useProveedoresList } from "../hooks/useProveedoresList";
import { Proveedor, ProveedorPayload } from "../proveedores.service";
import ProveedoresTable from "../components/ProveedoresTable";
import ProveedorFormModal from "../components/ProveedorFormModal";
import ProveedorDetailView from "../components/ProveedorDetailView";

const ProveedoresPage: React.FC = () => {
  const {
    proveedores,
    pagination,
    search,
    setSearch,
    loading,
    error,
    loadProveedores,
    crearProveedor,
    actualizarProveedor,
    eliminarProveedor,
  } = useProveedoresList();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [proveedorEdit, setProveedorEdit] = useState<Proveedor | null>(null);

  const selectedProveedor =
    selectedIndex !== null ? proveedores[selectedIndex] : null;

  const handleBuscar = () => {
    loadProveedores(1, search);
    setSelectedIndex(null);
  };

  const handlePageChange = (page: number) => {
    loadProveedores(page);
    setSelectedIndex(null);
  };

  const handleAbrirNuevo = () => {
    setModalMode("create");
    setProveedorEdit(null);
    setModalError(null);
    setModalOpen(true);
  };

  const handleEditarProveedor = (p: Proveedor) => {
    setModalMode("edit");
    setProveedorEdit(p);
    setModalError(null);
    setModalOpen(true);
  };

  const handleGuardarProveedor = async (payload: ProveedorPayload) => {
    try {
      setSaving(true);
      setModalError(null);
      if (modalMode === "create") {
        await crearProveedor(payload);
      } else if (modalMode === "edit" && proveedorEdit) {
        await actualizarProveedor(proveedorEdit.idEmpresaP, payload);
      }
      setModalOpen(false);
    } catch (err: any) {
      console.error(err);
      setModalError("Error al guardar el proveedor.");
    } finally {
      setSaving(false);
    }
  };

  const handleEliminarProveedor = async (p: Proveedor) => {
    const ok = window.confirm(
      `¿Eliminar al proveedor "${p.nombre}"?\nSi tiene compras asociadas, no se podrá eliminar.`
    );
    if (!ok) return;
    try {
      await eliminarProveedor(p.idEmpresaP);
      if (
        selectedIndex !== null &&
        proveedores[selectedIndex]?.idEmpresaP === p.idEmpresaP
      ) {
        setSelectedIndex(null);
      }
    } catch (err) {
      console.error(err);
      alert(
        "Error al eliminar el proveedor. Verifica si tiene compras asociadas."
      );
    }
  };

  const handleVerDetalle = (p: Proveedor) => {
    const idx = proveedores.findIndex(
      (x) => x.idEmpresaP === p.idEmpresaP
    );
    setSelectedIndex(idx >= 0 ? idx : null);
  };

  const handleVolverLista = () => {
    setSelectedIndex(null);
  };

  const handleAnteriorProveedor = () => {
    setSelectedIndex((prev) => {
      if (prev === null) return prev;
      if (prev <= 0) return prev;
      return prev - 1;
    });
  };

  const handleSiguienteProveedor = () => {
    setSelectedIndex((prev) => {
      if (prev === null) return prev;
      if (prev >= proveedores.length - 1) return prev;
      return prev + 1;
    });
  };

  // ------- RENDER -------
  if (selectedProveedor) {
    // Vista detalle
    return (
      <div className="px-4 md:px-6 py-4 space-y-4">
        <ProveedorDetailView
          proveedor={selectedProveedor}
          onVolver={handleVolverLista}
          onAnteriorProveedor={
            selectedIndex !== null && selectedIndex > 0
              ? handleAnteriorProveedor
              : undefined
          }
          onSiguienteProveedor={
            selectedIndex !== null &&
            selectedIndex < proveedores.length - 1
              ? handleSiguienteProveedor
              : undefined
          }
        />
      </div>
    );
  }

  // Vista lista
  return (
    <div className="px-4 md:px-6 py-4 space-y-4">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Gestión de Proveedores
        </h1>
      </div>

      {/* Barra de búsqueda y botón agregar */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        {/* Input + botón Buscar pegados */}
        <div className="flex items-stretch">
          <div className="flex items-center bg-white border border-gray-300 rounded-l-full px-3 py-1.5 min-w-[260px]">
            <FiSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Buscar Proveedor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
              className="flex-1 text-sm outline-none"
            />
          </div>
          <button
            onClick={handleBuscar}
            className="px-4 py-1.5 rounded-r-full bg-black text-white text-sm hover:bg-gray-800 -ml-px"
          >
            Buscar
          </button>
        </div>

        <button
          onClick={handleAbrirNuevo}
          className="px-4 py-2 rounded-full bg-[#1d6fe9] text-white text-sm hover:bg-[#1556b4]"
        >
          Agregar Proveedor
        </button>
      </div>

      {/* Tabla */}
      <ProveedoresTable
        proveedores={proveedores}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={handlePageChange}
        onVerDetalle={handleVerDetalle}
        onEditar={handleEditarProveedor}
        onEliminar={handleEliminarProveedor}
      />

      {/* Modal crear/editar */}
      <ProveedorFormModal
        mode={modalMode}
        open={modalOpen}
        proveedor={proveedorEdit}
        saving={saving}
        errorMsg={modalError}
        onClose={() => setModalOpen(false)}
        onSubmit={handleGuardarProveedor}
      />
    </div>
  );
};

export default ProveedoresPage;
