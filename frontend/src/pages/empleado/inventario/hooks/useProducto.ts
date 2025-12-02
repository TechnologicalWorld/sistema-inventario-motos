import { useEffect, useState } from "react";
import inventarioService, { Producto } from "../service/empleado.inventario.service";

export function useProducto(id: number | null) {
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProducto = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await inventarioService.getProducto(id);
        setProducto(response);
      } catch (e: any) {
        console.error('Error al cargar producto:', e);
        setError(e.message || "Error al obtener el producto.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, [id]);

  return { producto, loading, error };
}