import { useEffect, useState } from "react";
import clientesService, {
  ClienteHistorialApi,
  VentaHistorial,
} from "../clientes.service";

export interface ClienteHistorialResumen {
  totalGastado: number;
  numeroCompras: number;
  ticketPromedio: number;
  ultimaCompra: string | null;
}

function buildResumen(ventas: VentaHistorial[]): ClienteHistorialResumen {
  if (!ventas || ventas.length === 0) {
    return {
      totalGastado: 0,
      numeroCompras: 0,
      ticketPromedio: 0,
      ultimaCompra: null,
    };
  }

  let total = 0;
  let ultima: string | null = null;

  ventas.forEach((v) => {
    total += Number(v.montoTotal);
    if (!ultima || new Date(v.fecha) > new Date(ultima)) {
      ultima = v.fecha;
    }
  });

  const numeroCompras = ventas.length;
  const ticketPromedio = numeroCompras > 0 ? total / numeroCompras : 0;

  return {
    totalGastado: total,
    numeroCompras,
    ticketPromedio,
    ultimaCompra: ultima,
  };
}

export function useClienteHistorial(idCliente: number | null) {
  const [data, setData] = useState<ClienteHistorialApi | null>(null);
  const [resumen, setResumen] =
    useState<ClienteHistorialResumen | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idCliente) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await clientesService.getHistorialCompras(
          idCliente
        );
        setData(response);
        setResumen(buildResumen(response.ventas));
      } catch (e) {
        console.error(e);
        setError("Error al obtener historial de compras.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [idCliente]);

  return { data, resumen, loading, error };
}
