import { useEffect, useState } from "react";
import {
  CompraListItem,
  ComprasFilters,
  getCompras,
  PaginationMeta,
} from "../compras.service";

export function useComprasList() {
  const [items, setItems] = useState<CompraListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    currentPage: 1,
    lastPage: 1,
    perPage: 15,
    total: 0,
  });
  const [filters, setFilters] = useState<ComprasFilters>({});
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [version, setVersion] = useState(0); 

  useEffect(() => {
    let canceled = false;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, meta } = await getCompras({ page, filters });
        if (!canceled) {
          setItems(data);
          setMeta(meta);
        }
      } catch (e: any) {
        if (!canceled) {
          setError(e.message || "Error al obtener las compras");
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    };

    load();
    return () => {
      canceled = true;
    };
  }, [page, filters, version]);

  const applyFilters = (newFilters: ComprasFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const reload = () => setVersion((v) => v + 1);

  return {
    items,
    meta,
    page,
    setPage,
    filters,
    applyFilters,
    loading,
    error,
    reload,
  };
}
