import { useEffect, useState } from "react";
import inventarioService, {
  Producto,
  GetProductosParams,
} from "../service/empleado.inventario.service";

export function useInventarioList() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filtroStockBajo, setFiltroStockBajo] = useState(false);

  const loadProductos = async (pageToLoad = 1, searchValue = search, stockBajo = filtroStockBajo) => {
    try {
      setLoading(true);
      setError(null);

      const params: GetProductosParams = {
        page: pageToLoad,
        search: searchValue || undefined,
      };

      if (stockBajo) {
        params.stock_bajo = true;
      }

      const data = await inventarioService.getProductos(params);

      setProductos(data.data);
      setPage(data.current_page);
      setLastPage(data.last_page);
      
    } catch (e: any) {
      console.error('Error al cargar productos:', e);
      setError(e.message || "Error al obtener los productos.");
    } finally {
      setLoading(false);
    }
  };

  const loadStockBajo = async () => {
    try {
      setLoading(true);
      setError(null);

      const productosStockBajo = await inventarioService.getStockBajo();
      setProductos(productosStockBajo);
      setPage(1);
      setLastPage(1);
      
    } catch (e: any) {
      console.error('Error al cargar stock bajo:', e);
      setError(e.message || "Error al obtener productos con stock bajo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductos(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    productos,
    loading,
    error,
    page,
    lastPage,
    search,
    setSearch,
    filtroStockBajo,
    setFiltroStockBajo,
    loadProductos,
    loadStockBajo,
    setPage,
  };
}