import { useEffect, useState } from "react";
import clientesService, {
  Cliente,
  ClienteHistorialApi,
  VentaHistorial,
} from "../clientes.service";

export interface ClienteResumen {
  ultimaCompra: string | null;
  numeroCompras: number;
  totalGastado: number;
  ticketPromedio: number;
}

export interface ClienteConResumen extends Cliente {
  resumen?: ClienteResumen;
}

function calcularResumen(ventas: VentaHistorial[]): ClienteResumen {
  if (!ventas || ventas.length === 0) {
    return {
      ultimaCompra: null,
      numeroCompras: 0,
      totalGastado: 0,
      ticketPromedio: 0,
    };
  }

  let total = 0;
  let ultima: string | null = null;

  ventas.forEach((v) => {
    total += Number(v.montoTotal);
    if (!ultima) {
      ultima = v.fecha;
    } else {
      if (new Date(v.fecha) > new Date(ultima)) {
        ultima = v.fecha;
      }
    }
  });

  const numeroCompras = ventas.length;
  const ticketPromedio = numeroCompras > 0 ? total / numeroCompras : 0;

  return {
    ultimaCompra: ultima,
    numeroCompras,
    totalGastado: total,
    ticketPromedio,
  };
}

export function useClientesList() {
  const [clientes, setClientes] = useState<ClienteConResumen[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");

  const loadClientes = async (pageToLoad = 1, searchValue = search) => {
    try {
      setLoading(true);
      setError(null);

      const data = await clientesService.getClientes({
        page: pageToLoad,
        search: searchValue || undefined,
      });

      // Calculamos resumen para cada cliente llamando al historial
      const clientesConResumen: ClienteConResumen[] = await Promise.all(
        data.data.map(async (c) => {
          try {
            const historial: ClienteHistorialApi =
              await clientesService.getHistorialCompras(c.idCliente);
            const resumen = calcularResumen(historial.ventas);
            return { ...c, resumen };
          } catch {
            // Si falla el historial, igual mostramos el cliente
            return { ...c };
          }
        })
      );

      setClientes(clientesConResumen);
      setPage(data.current_page);
      setLastPage(data.last_page);
    } catch (e) {
      console.error(e);
      setError("Error al obtener los clientes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClientes(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    clientes,
    loading,
    error,
    page,
    lastPage,
    search,
    setSearch,
    loadClientes,
    setPage,
  };
}
