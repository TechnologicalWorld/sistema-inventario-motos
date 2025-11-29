import { useEffect, useState } from "react";
import { Compra, getCompraById } from "../compras.service";

export function useCompraDetalle(idCompra: number | null, open: boolean) {
  const [data, setData] = useState<Compra | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !idCompra) return;

    let canceled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const compra = await getCompraById(idCompra);
        if (!canceled) setData(compra);
      } catch (e: any) {
        if (!canceled)
          setError(e.message || "Error al obtener detalle de la compra");
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    load();

    return () => {
      canceled = true;
    };
  }, [idCompra, open]);

  return { data, loading, error };
}
