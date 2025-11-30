import { useEffect, useState } from "react";
import ventasService, {
  Venta,
  VentasPaginatedResponse,
  VentasFilters,
} from "../ventas.service";

export interface UISelectedFilters {
  search: string;
  empleadoId: string;         
  metodoPago: string;         
  fechaDesde: string;         
  fechaHasta: string;         
}

export function useVentasList() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [serverFilters, setServerFilters] = useState<VentasFilters>({});

  const [uiFilters, setUiFilters] = useState<UISelectedFilters>({
    search: "",
    empleadoId: "",
    metodoPago: "",
    fechaDesde: "",
    fechaHasta: "",
  });

  const fetchVentas = async (pageToLoad = 1, filters: VentasFilters = serverFilters) => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const response: VentasPaginatedResponse = await ventasService.getVentas({
        ...filters,
        page: pageToLoad,
      });

      setVentas(response.data);
      setPage(response.current_page);
      setLastPage(response.last_page);
      setTotal(response.total);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(
        error?.response?.data?.error || "Error al obtener las ventas."
      );
    } finally {
      setLoading(false);
    }
  };

  // cargar la primera vez
  useEffect(() => {
    fetchVentas(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateUiFilters = (patch: Partial<UISelectedFilters>) => {
    setUiFilters((prev) => ({ ...prev, ...patch }));
  };

  const applyFilters = () => {
    const filters: VentasFilters = {
      empleadoId: uiFilters.empleadoId ? Number(uiFilters.empleadoId) : undefined,
      fechaInicio: uiFilters.fechaDesde || undefined,
      fechaFin: uiFilters.fechaHasta || undefined,
    };

    setServerFilters(filters);
    fetchVentas(1, filters);
  };

  // navegación por páginas
  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > lastPage) return;
    fetchVentas(newPage);
  };

  const resetFilters = () => {
    setUiFilters({
      search: "",
      empleadoId: "",
      metodoPago: "",
      fechaDesde: "",
      fechaHasta: "",
    });
    setServerFilters({});
    fetchVentas(1, {});
  };

  return {
    ventas,
    page,
    lastPage,
    total,
    loading,
    errorMsg,
    uiFilters,
    updateUiFilters,
    applyFilters,
    goToPage,
    resetFilters,
  };
}
