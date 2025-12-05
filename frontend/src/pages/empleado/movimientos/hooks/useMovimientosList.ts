import { useEffect, useState } from "react";
import movimientosService, { 
  Movimiento 
} from "../services/empleado.movimientos.service";

export interface FiltrosMovimientos {
  fecha_desde?: string;
  fecha_hasta?: string;
  tipo?: "entrada" | "salida" | "todos";
  search?: string;
}

export function useMovimientosList() {
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  const loadMovimientos = async (pageToLoad = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await movimientosService.getMovimientos({
        page: pageToLoad
      });
      // Validación de datos
      if (!response) {
        throw new Error("No se recibió respuesta del servidor");
      }

      if (!response.data || !Array.isArray(response.data)) {
        console.warn("Respuesta inesperada:", response);
        setMovimientos([]);
      } else {
        setMovimientos(response.data);
      }

      // Actualizar paginación
      setPage(response.current_page || 1);
      setLastPage(response.last_page || 1);
      setTotal(response.total || 0);
      
    } catch (err: any) {
      console.error("❌ Error en loadMovimientos:", err);
      
      let errorMessage = "Error al cargar los movimientos";
      
      if (err.response) {
        errorMessage = err.response.data?.error || err.response.data?.message || errorMessage;
      } else if (err.request) {
        errorMessage = "No se pudo conectar con el servidor";
      } else {
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
      setMovimientos([]);
    } finally {
      setLoading(false);
    }
  };

  const crearMovimiento = async (movimientoData: {
    tipo: "entrada" | "salida";
    idProducto: number;
    cantidad: number;
    observacion: string;
  }): Promise<boolean> => {
    try {
      setLoading(true);
      await movimientosService.createMovimiento(movimientoData);
      
      // Recargar la lista después de crear
      await loadMovimientos(1);
      return true;
    } catch (err: any) {
      console.error("❌ Error al crear movimiento:", err);
      
      let errorMessage = "Error al registrar el movimiento";
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      }
      
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    loadMovimientos(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    movimientos,
    loading,
    error,
    page,
    lastPage,
    total,
    loadMovimientos,
    setPage,
    crearMovimiento,
  };
}