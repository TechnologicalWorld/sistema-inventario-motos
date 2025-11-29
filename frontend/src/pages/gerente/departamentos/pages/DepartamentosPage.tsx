import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useDepartamentosList } from "../hooks/useDepartamentosList";
import DepartamentosTable from "../components/DepartamentosTable";
import DepartamentoFormModal from "../components/DepartamentoFormModal";
import DepartamentoDetailView from "../components/DepartamentoDetailView";
import {
  Departamento,
  DepartamentoFormPayload,
} from "../departamentos.service";

const DepartamentosPage: React.FC = () => {
  const {
    departamentos,
    loading,
    error,
    search,
    setSearch,
    reload,
    createDepartamento,
    updateDepartamento,
    deleteDepartamento,
  } = useDepartamentosList();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedDept, setSelectedDept] = useState<Departamento | null>(null);

  const [detalleDeptId, setDetalleDeptId] = useState<number | null>(null);

  const handleGuardarDepto = async (payload: DepartamentoFormPayload) => {
    if (formMode === "create") {
      await createDepartamento(payload);
    } else if (formMode === "edit" && selectedDept) {
      await updateDepartamento(selectedDept.idDepartamento, payload);
    }
  };

  const handleEliminar = (d: Departamento) => {
    if (
      !window.confirm(
        `¿Seguro que deseas eliminar el departamento "${d.nombre}"?`
      )
    ) {
      return;
    }

    deleteDepartamento(d.idDepartamento).catch((err: any) => {
      console.error(err);
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        "No se pudo eliminar el departamento.";
      alert(msg);
    });
  };

  const handleBuscar = () => {
    reload();          
    };
  return (
    <div className="w-full space-y-4">
      {/* Título */}
    <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
      Control y administración de departamentos
    </h1>

    {/* Barra de búsqueda y botón agregar */}
    <div className="flex flex-wrap items-center gap-3 justify-between">
      {/* Buscador + botón Buscar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center bg-white border border-gray-300 rounded-full px-3 py-1.5 min-w-[220px] max-w-xs">
          <FiSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Buscar Departamento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleBuscar()}
            className="flex-1 text-sm outline-none"
          />
        </div>
        <button
          onClick={handleBuscar}
          className="px-4 py-1.5 rounded-full bg-black text-white text-sm hover:bg-gray-800"
        >
          Buscar
        </button>
      </div>

      {/* Botón Agregar */}
      <button
        onClick={() => {
          setFormMode("create");
          setSelectedDept(null);
          setFormOpen(true);
        }}
        className="px-4 py-2 rounded-full bg-[#1d6fe9] text-white text-sm hover:bg-[#1556b4]"
      >
        Agregar Departamento
      </button>
    </div>

      {/* Tabla de departamentos */}
      <DepartamentosTable
        departamentos={departamentos}
        loading={loading}
        error={error}
        onVerDetalle={(d) => setDetalleDeptId(d.idDepartamento)}
        onEditar={(d) => {
          setFormMode("edit");
          setSelectedDept(d);
          setFormOpen(true);
        }}
        onEliminar={handleEliminar}
      />

      {/* Detalle del departamento seleccionado */}
      <DepartamentoDetailView
        departamentoId={detalleDeptId}
        onClose={() => setDetalleDeptId(null)}
      />

      {/* Modal crear / editar */}
      <DepartamentoFormModal
        open={formOpen}
        mode={formMode}
        departamento={selectedDept}
        onClose={() => setFormOpen(false)}
        onSubmit={handleGuardarDepto}
      />
    </div>
  );
};

export default DepartamentosPage;
