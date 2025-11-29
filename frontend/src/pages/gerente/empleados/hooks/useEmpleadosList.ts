import { useEffect, useMemo, useState } from "react";
import empleadosService, {
  Empleado,
  EmpleadosFilters,
  EmpleadoCreatePayload,
  EmpleadoUpdatePayload,
  PaginationMeta,
} from "../empleados.service";

export function useEmpleadosList() {
  const [empleadosRaw, setEmpleadosRaw] = useState<Empleado[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    currentPage: 1,
    lastPage: 1,
    total: 0,
  });

  const [search, setSearch] = useState("");
  const [departamentoFilter, setDepartamentoFilter] = useState<number | "">("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadEmpleados = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const filters: EmpleadosFilters = {
        search: search || undefined,
        departamentoId:
          departamentoFilter === "" ? undefined : departamentoFilter,
      };

      const { data, meta } = await empleadosService.getEmpleados({
        page,
        filters,
      });

      setEmpleadosRaw(data);
      setPagination(meta);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Error al obtener los empleados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmpleados(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const empleados = useMemo(() => {
    if (!departamentoFilter) return empleadosRaw;

    return empleadosRaw.filter((e) =>
      e.departamentos?.some(
        (d) => d.idDepartamento === Number(departamentoFilter)
      )
    );
  }, [empleadosRaw, departamentoFilter]);

  const crearEmpleado = async (payload: EmpleadoCreatePayload) => {
    await empleadosService.createEmpleado(payload);
    await loadEmpleados(pagination.currentPage);
  };

  const actualizarEmpleado = async (
    idEmpleado: number,
    payload: EmpleadoUpdatePayload
  ) => {
    await empleadosService.updateEmpleado(idEmpleado, payload);
    await loadEmpleados(pagination.currentPage);
  };

  const eliminarEmpleado = async (idEmpleado: number) => {
    await empleadosService.deleteEmpleado(idEmpleado);

    if (empleados.length === 1 && pagination.currentPage > 1) {
      await loadEmpleados(pagination.currentPage - 1);
    } else {
      await loadEmpleados(pagination.currentPage);
    }
  };

  const asignarDepartamentos = async (
    idEmpleado: number,
    departamentos: number[],
    observacion?: string
  ) => {
    await empleadosService.asignarDepartamentos(idEmpleado, {
      departamentos,
      observacion,
    });
    await loadEmpleados(pagination.currentPage);
  };

  return {
    empleados,
    rawEmpleados: empleadosRaw,
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
  };
}
