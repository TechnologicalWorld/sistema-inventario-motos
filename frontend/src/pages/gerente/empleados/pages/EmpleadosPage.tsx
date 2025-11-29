import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useEmpleadosList } from "../hooks/useEmpleadosList";
import { useDepartamentosOptions } from "../hooks/useDepartamentosOptions";
import EmpleadosTable from "../components/EmpleadosTable";
import EmpleadoFormModal from "../components/EmpleadoFormModal";
import EmpleadoDetailModal from "../components/EmpleadoDetailModal";
import AsignarDepartamentoModal from "../components/AsignarDepartamentoModal";
import { Empleado } from "../empleados.service";

const EmpleadosPage: React.FC = () => {
  const {
    empleados,
    pagination,
    search,
    setSearch,
    departamentoFilter,
    setDepartamentoFilter,
    loading,
    error,
    loadEmpleados,
    crearEmpleado,
    actualizarEmpleado,
    eliminarEmpleado,
    asignarDepartamentos,
  } = useEmpleadosList();

  const { options: departamentosOptions } = useDepartamentosOptions();

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [empleadoSeleccionado, setEmpleadoSeleccionado] =
    useState<Empleado | null>(null);

  const [detalleOpen, setDetalleOpen] = useState(false);
  const [asignarOpen, setAsignarOpen] = useState(false);

  const handleBuscar = () => {
    loadEmpleados(1);
  };

  const handleEliminar = (e: Empleado) => {
    if (
      window.confirm(
        `¿Seguro que deseas eliminar al empleado ${e.persona.nombres} ${e.persona.paterno}?`
      )
    ) {
      eliminarEmpleado(e.idEmpleado).catch((err) => {
        console.error(err);
        alert(
          err?.message ||
            "No se pudo eliminar el empleado (puede tener ventas o movimientos asociados)."
        );
      });
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Título */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Control y administración de empleados
        </h1>

        <button
          onClick={() => {
            setFormMode("create");
            setEmpleadoSeleccionado(null);
            setFormOpen(true);
          }}
          className="px-4 py-2 rounded-full bg-blue-600 text-white text-sm hover:bg-blue-700"
        >
          Agregar Empleado
        </button>
      </div>

      {/* Barra de filtros */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 mb-3">
        {/* Buscar */}
        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Buscar Empleado..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-full border border-gray-400 bg-white text-sm"
            />
          </div>
          <button
            onClick={handleBuscar}
            className="px-4 py-1.5 rounded-full bg-black text-white text-sm hover:bg-gray-800"
          >
            Buscar
          </button>
        </div>

        {/* Filtro por departamento */}
        <div className="w-full md:w-60">
          <select
            value={departamentoFilter === "" ? "" : String(departamentoFilter)}
            onChange={(e) =>
              setDepartamentoFilter(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            className="w-full px-3 py-1.5 rounded-full border border-gray-400 bg-white text-sm"
          >
            <option value="">Departamento</option>
            {departamentosOptions.map((d) => (
              <option key={d.idDepartamento} value={d.idDepartamento}>
                {d.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tabla */}
      <EmpleadosTable
        empleados={empleados}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={(page) => loadEmpleados(page)}
        onVerDetalle={(e) => {
          setEmpleadoSeleccionado(e);
          setDetalleOpen(true);
        }}
        onEditar={(e) => {
          setEmpleadoSeleccionado(e);
          setFormMode("edit");
          setFormOpen(true);
        }}
        onEliminar={handleEliminar}
        onAsignarDepto={(e) => {
          setEmpleadoSeleccionado(e);
          setAsignarOpen(true);
        }}
      />

      {/* Modal alta/edición */}
      <EmpleadoFormModal
        open={formOpen}
        mode={formMode}
        empleado={empleadoSeleccionado}
        departamentosOptions={departamentosOptions}
        onClose={() => setFormOpen(false)}
        onCreate={crearEmpleado}
        onUpdate={actualizarEmpleado}
      />

      {/* Modal detalle */}
      <EmpleadoDetailModal
        open={detalleOpen}
        empleado={empleadoSeleccionado}
        onClose={() => setDetalleOpen(false)}
      />

      {/* Modal asignar departamento */}
      <AsignarDepartamentoModal
        open={asignarOpen}
        empleado={empleadoSeleccionado}
        departamentosOptions={departamentosOptions}
        onClose={() => setAsignarOpen(false)}
        onConfirm={async (idEmpleado, departamentoId, observacion) => {
          await asignarDepartamentos(idEmpleado, [departamentoId], observacion);
        }}
      />
    </div>
  );
};

export default EmpleadosPage;
