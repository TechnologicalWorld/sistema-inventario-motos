import { useEffect, useState } from "react";
import empleadosService from "../empleados.service";
import type { EmpleadoResumen, DesempenioResponse } from "../empleados.service";

export function useEmpleadosList() {
  const [empleados, setEmpleados] = useState<EmpleadoResumen[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const loadEmpleados = async (page: number = 1, searchTerm?: string) => {
    try {
      setLoading(true);
      setError(null);

      const data = await empleadosService.getEmpleados();
      
      // Filtrar por búsqueda si existe
      const filtered = (searchTerm ?? search)
        ? data.filter(
            (e) =>
              e.nombre_completo.toLowerCase().includes((searchTerm ?? search).toLowerCase()) ||
              e.ci.includes(searchTerm ?? search) ||
              e.telefono.includes(searchTerm ?? search)
          )
        : data;

      // Calcular paginación
      const total = filtered.length;
      const lastPage = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));
      const validPage = Math.min(page, lastPage);

      // Obtener items de la página actual
      const inicio = (validPage - 1) * ITEMS_PER_PAGE;
      const pageItems = filtered.slice(inicio, inicio + ITEMS_PER_PAGE);

      setEmpleados(pageItems);
      setCurrentPage(validPage);
    } catch (err: any) {
      console.error("Error al cargar empleados:", err);
      setError(err.message || "No se pudieron cargar los empleados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmpleados(1, search);
  }, [search]);

  const loadDesempenio = async (idEmpleado: number): Promise<DesempenioResponse> => {
    try {
      const data = await empleadosService.getDesempenio(idEmpleado);
      return data;
    } catch (err: any) {
      console.error("Error al cargar desempeño:", err);
      throw new Error(err.message || "No se pudo cargar el desempeño.");
    }
  };

  // Calcular total de registros sin paginar para saber cuántas páginas hay
  const getAllEmpleados = async (): Promise<EmpleadoResumen[]> => {
    try {
      const data = await empleadosService.getEmpleados();
      const filtered = search
        ? data.filter(
            (e) =>
              e.nombre_completo.toLowerCase().includes(search.toLowerCase()) ||
              e.ci.includes(search) ||
              e.telefono.includes(search)
          )
        : data;
      return filtered;
    } catch {
      return [];
    }
  };

  const handlePageChange = async (page: number) => {
    await loadEmpleados(page, search);
  };

  // Retornar todos los empleados sin paginar para la navegación de detalle
  const [allEmpleados, setAllEmpleados] = useState<EmpleadoResumen[]>([]);

  useEffect(() => {
    const loadAll = async () => {
      const all = await getAllEmpleados();
      setAllEmpleados(all);
    };
    loadAll();
  }, [search]);

  // Calcular total y lastPage
  const total = allEmpleados.length;
  const lastPage = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

  return {
    empleados,
    allEmpleados, // Para navegación de detalle
    loading,
    error,
    search,
    setSearch,
    currentPage,
    lastPage,
    total,
    onPageChange: handlePageChange,
    refetch: () => loadEmpleados(currentPage, search),
    loadDesempenio,
  };
}
