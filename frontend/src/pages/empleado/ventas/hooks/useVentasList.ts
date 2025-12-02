import { useEffect, useState } from "react";
import ventasService, { Venta, parseToNumber } from "../services/empleado.ventas.service";

export function useVentasList() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");

  const loadVentas = async (pageToLoad = 1, searchValue = search) => {
    try {
      setLoading(true);
      setError(null);

      // LLAMADA SEGURA a la API
      const response = await ventasService.getVentas({
        page: pageToLoad,
        search: searchValue || undefined,
      });

      console.log("📊 DEBUG - Respuesta API ventas:", response);
      
      // VALIDACIÓN DE DATOS
      if (!response) {
        throw new Error("No se recibió respuesta del servidor");
      }

      // Procesar ventas para asegurar tipos correctos
      const ventasProcesadas: Venta[] = Array.isArray(response.data) 
        ? response.data.map(venta => ({
            ...venta,
            // Asegurar que montoTotal sea number
            montoTotal: parseToNumber(venta.montoTotal),
            // Procesar detalles
            detalle_ventas: Array.isArray(venta.detalle_ventas) 
              ? venta.detalle_ventas.map(detalle => ({
                  ...detalle,
                  precioUnitario: parseToNumber(detalle.precioUnitario),
                  subTotal: parseToNumber(detalle.subTotal),
                  cantidad: Number(detalle.cantidad),
                }))
              : [],
          }))
        : [];

      setVentas(ventasProcesadas);
      setPage(response.current_page || 1);
      setLastPage(response.last_page || 1);
      
    } catch (err: any) {
      console.error("❌ Error en loadVentas:", err);
      
      // MANEJO DE ERRORES
      let errorMessage = "Error al cargar las ventas";
      
      if (err.response) {
        errorMessage = err.response.data?.error || err.response.data?.message || errorMessage;
      } else if (err.request) {
        errorMessage = "No se pudo conectar con el servidor";
      } else {
        errorMessage = err.message || errorMessage;
      }
      
      setError(errorMessage);
      setVentas([]);
    } finally {
      setLoading(false);
    }
  };

  const crearVenta = async (ventaData: {
    idCliente: number;
    metodoPago: 'efectivo' | 'tarjeta' | 'transferencia';
    descripcion?: string;
    detalles: {
      idProducto: number;
      cantidad: number;
    }[];
  }): Promise<boolean> => {
    try {
      setLoading(true);
      await ventasService.createVenta(ventaData);
      
      // Recargar la lista después de crear
      await loadVentas(1, search);
      return true;
    } catch (err: any) {
      console.error("❌ Error al crear venta:", err);
      
      let errorMessage = "Error al registrar la venta";
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
    loadVentas(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ventas,
    loading,
    error,
    page,
    lastPage,
    search,
    setSearch,
    loadVentas,
    setPage,
    crearVenta,
  };
}